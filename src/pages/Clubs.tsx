
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ClubCard from "@/components/clubs/ClubCard";
import ClubDetailSheet from "@/components/clubs/ClubDetailSheet";
import ClubMessaging from "@/components/clubs/ClubMessaging";
import { Book, Basketball, Code, Church, Music } from "lucide-react";

// Club type definition
export type Club = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  members: number;
  location: string;
  meetingTime: string;
  activities: string[];
};

// Message type definition
export type Message = {
  id: string;
  senderId: string;
  senderName: string;
  clubId: string;
  content: string;
  timestamp: Date;
};

const Clubs = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Define clubs
  const clubs: Club[] = [
    {
      id: "english-club",
      name: "English Club",
      description: "Improve your English speaking and writing skills in a friendly, supportive environment.",
      icon: <Book className="h-10 w-10 text-blue-500" />,
      members: 28,
      location: "AQ Building, Room 3005",
      meetingTime: "Tuesdays 4:30-6:00 PM",
      activities: ["Conversation practice", "Writing workshops", "Book discussions", "Grammar games"]
    },
    {
      id: "basketball-club",
      name: "Basketball Club",
      description: "Join us for casual games, skill development, and competitive play.",
      icon: <Basketball className="h-10 w-10 text-orange-500" />,
      members: 32,
      location: "West Gym",
      meetingTime: "Mondays & Thursdays 7:00-9:00 PM",
      activities: ["Pickup games", "Skills training", "Intramural tournaments", "Fitness sessions"]
    },
    {
      id: "it-club",
      name: "IT Club",
      description: "Learn about technology, coding, and digital innovations with like-minded peers.",
      icon: <Code className="h-10 w-10 text-green-500" />,
      members: 45,
      location: "Applied Sciences Building, Room 9705",
      meetingTime: "Wednesdays 5:00-7:00 PM",
      activities: ["Coding workshops", "Hackathons", "Tech talks", "Project collaborations"]
    },
    {
      id: "buddhist-club",
      name: "Buddhist Club",
      description: "Explore Buddhist philosophy, meditation, and mindfulness practices.",
      icon: <Church className="h-10 w-10 text-amber-600" />,
      members: 19,
      location: "Interfaith Centre, Room 3200",
      meetingTime: "Fridays 12:30-2:00 PM",
      activities: ["Meditation sessions", "Philosophy discussions", "Mindfulness workshops", "Community service"]
    },
    {
      id: "music-club",
      name: "Music Club",
      description: "Share your passion for music through performances, jam sessions, and music appreciation.",
      icon: <Music className="h-10 w-10 text-purple-500" />,
      members: 37,
      location: "Arts Building, Room 2050",
      meetingTime: "Saturdays 2:00-5:00 PM",
      activities: ["Jam sessions", "Open mic nights", "Music theory classes", "Concerts"]
    }
  ];

  // Load joined clubs from localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedJoinedClubs = localStorage.getItem(`joinedClubs-${user.id}`);
      if (savedJoinedClubs) {
        setJoinedClubs(JSON.parse(savedJoinedClubs));
      }
      
      // Load messages
      const savedMessages = localStorage.getItem(`clubMessages`);
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string dates back to Date objects
        Object.keys(parsedMessages).forEach(clubId => {
          parsedMessages[clubId] = parsedMessages[clubId].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        setMessages(parsedMessages);
      }
    }
  }, [isAuthenticated, user]);

  // Save joined clubs to localStorage when changed
  useEffect(() => {
    if (isAuthenticated && user && joinedClubs.length > 0) {
      localStorage.setItem(`joinedClubs-${user.id}`, JSON.stringify(joinedClubs));
    }
  }, [joinedClubs, isAuthenticated, user]);

  // Save messages to localStorage when changed
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem(`clubMessages`, JSON.stringify(messages));
    }
  }, [messages]);

  const handleJoinClub = (clubId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join clubs",
        variant: "destructive"
      });
      return;
    }

    if (joinedClubs.includes(clubId)) {
      setJoinedClubs(joinedClubs.filter(id => id !== clubId));
      toast({
        title: "Club Left",
        description: "You have left the club"
      });
    } else {
      setJoinedClubs([...joinedClubs, clubId]);
      toast({
        title: "Club Joined",
        description: "You have successfully joined the club"
      });
    }
  };

  const handleOpenDetail = (club: Club) => {
    setSelectedClub(club);
    setIsDetailOpen(true);
  };

  const handleOpenMessaging = (club: Club) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access messaging",
        variant: "destructive"
      });
      return;
    }

    if (!joinedClubs.includes(club.id)) {
      toast({
        title: "Join Required",
        description: "You need to join this club to message members",
        variant: "destructive"
      });
      return;
    }

    setSelectedClub(club);
    setIsMessagingOpen(true);
  };

  const handleSendMessage = (clubId: string, content: string) => {
    if (!user) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      clubId,
      content,
      timestamp: new Date()
    };

    setMessages(prev => {
      const clubMessages = prev[clubId] || [];
      return {
        ...prev,
        [clubId]: [...clubMessages, newMessage]
      };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Campus Clubs</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and join student clubs on campus, connect with members, and participate in activities.
            </p>
            {!isAuthenticated && (
              <Button 
                className="mt-4 bg-sfu-red hover:bg-sfu-red/90"
                onClick={() => toast({
                  title: "Authentication Required",
                  description: "Please log in to join clubs and message members",
                })}
              >
                Log In to Join Clubs
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map(club => (
              <ClubCard 
                key={club.id}
                club={club}
                isJoined={joinedClubs.includes(club.id)}
                onJoin={() => handleJoinClub(club.id)}
                onViewDetails={() => handleOpenDetail(club)}
                onOpenMessaging={() => handleOpenMessaging(club)}
              />
            ))}
          </div>
        </div>
      </main>
      
      {selectedClub && (
        <>
          <ClubDetailSheet 
            club={selectedClub}
            isOpen={isDetailOpen}
            setIsOpen={setIsDetailOpen}
            isJoined={joinedClubs.includes(selectedClub.id)}
            onJoin={() => handleJoinClub(selectedClub.id)}
            onOpenMessaging={() => {
              setIsDetailOpen(false);
              handleOpenMessaging(selectedClub);
            }}
          />
          
          <ClubMessaging 
            club={selectedClub}
            isOpen={isMessagingOpen}
            setIsOpen={setIsMessagingOpen}
            messages={messages[selectedClub.id] || []}
            onSendMessage={(content) => handleSendMessage(selectedClub.id, content)}
            currentUserId={user?.id || ""}
          />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Clubs;

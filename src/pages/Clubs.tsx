
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ClubCard from "@/components/clubs/ClubCard";
import ClubDetailSheet from "@/components/clubs/ClubDetailSheet";
import ClubMessaging from "@/components/clubs/ClubMessaging";
import { Book, Activity, Code, Church, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

// Helper function to map DB icon string to React component
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'book':
      return <Book className="h-10 w-10 text-blue-500" />;
    case 'activity':
      return <Activity className="h-10 w-10 text-orange-500" />;
    case 'code':
      return <Code className="h-10 w-10 text-green-500" />;
    case 'church':
      return <Church className="h-10 w-10 text-amber-600" />;
    case 'music':
      return <Music className="h-10 w-10 text-purple-500" />;
    default:
      return <Book className="h-10 w-10 text-gray-500" />;
  }
};

const Clubs = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [joinedClubs, setJoinedClubs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [clubs, setClubs] = useState<Club[]>([]);

  // Fetch clubs from Supabase
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('clubs')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Transform the data to match our Club type
          const transformedClubs = data.map((club) => ({
            id: club.id,
            name: club.name,
            description: club.description,
            icon: getIconComponent(club.icon),
            members: club.members,
            location: club.location,
            meetingTime: club.meeting_time,
            activities: club.activities,
          }));

          setClubs(transformedClubs);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
        toast({
          title: "Error",
          description: "Failed to load clubs",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, [toast]);

  // Fetch user club memberships
  useEffect(() => {
    const fetchUserMemberships = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const { data, error } = await supabase
          .from('club_memberships')
          .select('club_id')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        if (data) {
          setJoinedClubs(data.map((membership) => membership.club_id));
        }
      } catch (error) {
        console.error('Error fetching club memberships:', error);
      }
    };

    fetchUserMemberships();
  }, [isAuthenticated, user]);

  // Subscribe to club membership changes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channel = supabase
      .channel('club-memberships-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'club_memberships',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh memberships when changes happen
          fetchUserMemberships();
        }
      )
      .subscribe();

    const fetchUserMemberships = async () => {
      const { data, error } = await supabase
        .from('club_memberships')
        .select('club_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching memberships:', error);
        return;
      }

      if (data) {
        setJoinedClubs(data.map((membership) => membership.club_id));
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, user]);

  // Fetch club messages
  useEffect(() => {
    const fetchClubMessages = async (clubId: string) => {
      if (!clubId || !isAuthenticated) return;

      try {
        const { data, error } = await supabase
          .from('club_messages')
          .select('*')
          .eq('club_id', clubId)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // For each message, fetch the user's name separately
          const messagesWithUserInfo = await Promise.all(
            data.map(async (msg) => {
              let senderName = 'Unknown User';
              
              // Fetch the user's name from profiles
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', msg.user_id)
                .single();
              
              if (!profileError && profileData) {
                senderName = profileData.full_name || senderName;
              }
              
              return {
                id: msg.id,
                senderId: msg.user_id,
                senderName: senderName,
                clubId: msg.club_id,
                content: msg.content,
                timestamp: new Date(msg.created_at),
              };
            })
          );

          setMessages(prev => ({
            ...prev,
            [clubId]: messagesWithUserInfo
          }));
        }
      } catch (error) {
        console.error('Error fetching club messages:', error);
      }
    };

    // If a club is selected, fetch its messages
    if (selectedClub) {
      fetchClubMessages(selectedClub.id);
    }
  }, [selectedClub, isAuthenticated]);

  // Subscribe to message changes for the selected club
  useEffect(() => {
    if (!selectedClub || !isAuthenticated) return;

    const channel = supabase
      .channel(`club-messages-${selectedClub.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'club_messages',
          filter: `club_id=eq.${selectedClub.id}`
        },
        (payload) => {
          // Fetch the new message with user info
          fetchNewMessage(payload.new.id);
        }
      )
      .subscribe();

    const fetchNewMessage = async (messageId: string) => {
      const { data, error } = await supabase
        .from('club_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (error) {
        console.error('Error fetching new message:', error);
        return;
      }

      if (data) {
        let senderName = 'Unknown User';
        
        // Fetch the user's name from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', data.user_id)
          .single();
        
        if (!profileError && profileData) {
          senderName = profileData.full_name || senderName;
        }
        
        const newMessage = {
          id: data.id,
          senderId: data.user_id,
          senderName: senderName,
          clubId: selectedClub.id,
          content: data.content,
          timestamp: new Date(data.created_at),
        };

        setMessages(prev => ({
          ...prev,
          [selectedClub.id]: [...(prev[selectedClub.id] || []), newMessage]
        }));
      }
    };

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedClub, isAuthenticated]);

  const handleJoinClub = async (clubId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join clubs",
        variant: "destructive"
      });
      return;
    }

    try {
      if (joinedClubs.includes(clubId)) {
        // Leave club
        const { error } = await supabase
          .from('club_memberships')
          .delete()
          .eq('user_id', user.id)
          .eq('club_id', clubId);

        if (error) throw error;

        toast({
          title: "Club Left",
          description: "You have left the club"
        });
      } else {
        // Join club
        const { error } = await supabase
          .from('club_memberships')
          .insert({
            user_id: user.id,
            club_id: clubId
          });

        if (error) throw error;

        toast({
          title: "Club Joined",
          description: "You have successfully joined the club"
        });
      }
    } catch (error) {
      console.error('Error updating club membership:', error);
      toast({
        title: "Error",
        description: "Failed to update club membership",
        variant: "destructive"
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

  const handleSendMessage = async (clubId: string, content: string) => {
    if (!user || !isAuthenticated) return;
    
    try {
      const { error } = await supabase
        .from('club_messages')
        .insert({
          club_id: clubId,
          user_id: user.id,
          content: content
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-sfu-red" />
              <span className="ml-2 text-lg">Loading clubs...</span>
            </div>
          ) : (
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
          )}
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

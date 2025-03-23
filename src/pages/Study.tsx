
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Users, BookOpen, Clock, Calendar, Search, UserSearch, UserPlus, UserCheck, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Study = () => {
  const [studentIdLookup, setStudentIdLookup] = useState("");
  const [matchedStudents, setMatchedStudents] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [connections, setConnections] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<{[key: string]: {text: string, sender: string, timestamp: Date}[]}>({});
  const [showMessaging, setShowMessaging] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Sample data for specific students with the IDs provided
  const allStudentsData = [
    { 
      id: 1, 
      name: "Arya Pratama", 
      studentId: "2024D5963", 
      course: "CMPT 120", 
      major: "Computer Science", 
      batch: "2024", 
      avatar: "", 
      bio: "Passionate about AI and Machine Learning. Looking for study partners for algorithm practice.",
      interests: ["Programming", "Artificial Intelligence", "Data Science"],
      availability: "Weekdays after 4 PM"
    },
    { 
      id: 2, 
      name: "Maya Wijaya", 
      studentId: "2024D5962", 
      course: "CMPT 225", 
      major: "Computer Science", 
      batch: "2024", 
      avatar: "", 
      bio: "Interested in web development and UX design. Currently working on a portfolio website project.",
      interests: ["Web Development", "UI/UX Design", "JavaScript"],
      availability: "Tuesdays and Thursdays"
    },
    { 
      id: 3, 
      name: "Budi Santoso", 
      studentId: "2024D5899", 
      course: "MATH 151", 
      major: "Mathematics", 
      batch: "2024", 
      avatar: "", 
      bio: "Math enthusiast focusing on calculus and statistics. Would love to join a study group.",
      interests: ["Calculus", "Statistics", "Problem Solving"],
      availability: "Weekends and Wednesday evenings"
    },
    { 
      id: 4, 
      name: "Dewi Sari", 
      studentId: "2024D5965", 
      course: "BUS 272", 
      major: "Business Administration", 
      batch: "2024", 
      avatar: "", 
      bio: "Studying business with a focus on international marketing. Looking for case study partners.",
      interests: ["Marketing", "Business Strategy", "Global Markets"],
      availability: "Monday, Wednesday, Friday afternoons"
    },
    { 
      id: 5, 
      name: "Reza Gunawan", 
      studentId: "2024D5978", 
      course: "PHYS 101", 
      major: "Physics", 
      batch: "2024", 
      avatar: "", 
      bio: "First-year physics student interested in theoretical physics. Seeking study partners for weekly sessions.",
      interests: ["Physics", "Mathematics", "Research"],
      availability: "Evenings and weekends"
    },
  ];

  // Study sessions data
  const upcomingSessions = [
    { id: 1, subject: "Algorithms Study Group", date: "Today, 3:00 PM", location: "AQ 3005", participants: 5 },
    { id: 2, subject: "Calculus Review", date: "Tomorrow, 11:00 AM", location: "Library Room 2", participants: 3 },
    { id: 3, subject: "Physics Lab Prep", date: "Oct 20, 4:30 PM", location: "SSC 7172", participants: 4 },
  ];

  // Load connections from localStorage on component mount
  useEffect(() => {
    const savedConnections = localStorage.getItem("connections");
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
    
    const savedPendingRequests = localStorage.getItem("pendingRequests");
    if (savedPendingRequests) {
      setPendingRequests(JSON.parse(savedPendingRequests));
    }
    
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save connections to localStorage whenever they change
  useEffect(() => {
    if (connections.length > 0) {
      localStorage.setItem("connections", JSON.stringify(connections));
    }
  }, [connections]);
  
  // Save pending requests to localStorage whenever they change
  useEffect(() => {
    if (pendingRequests.length > 0) {
      localStorage.setItem("pendingRequests", JSON.stringify(pendingRequests));
    }
  }, [pendingRequests]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  const findStudentById = () => {
    if (!studentIdLookup.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a student ID to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSelectedStudent(null);
    setShowMessaging(false);
    
    // Search for students matching the ID
    setTimeout(() => {
      const results = allStudentsData.filter(student => 
        student.studentId.toLowerCase().includes(studentIdLookup.toLowerCase())
      );
      
      setMatchedStudents(results);
      setIsSearching(false);
      
      if (results.length === 0) {
        toast({
          title: "No matches found",
          description: "No students match the provided ID",
        });
      } else {
        toast({
          title: "Students found",
          description: `Found ${results.length} student(s) matching your search`,
        });
      }
    }, 800);
  };

  const viewStudentProfile = (student: any) => {
    setSelectedStudent(student);
    setShowMessaging(false);
  };
  
  const sendConnectionRequest = (studentId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to connect with other students",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send a request to the backend
    // For demo purposes, we'll just add it to pendingRequests
    setPendingRequests(prev => [...prev, studentId]);
    
    toast({
      title: "Connection request sent",
      description: `Your connection request has been sent to student ID: ${studentId}`,
    });
    
    // For demo purposes, auto-accept after 2 seconds
    setTimeout(() => {
      acceptConnection(studentId);
    }, 2000);
  };
  
  const acceptConnection = (studentId: string) => {
    // Add to connections list
    setConnections(prev => [...prev, studentId]);
    // Remove from pending requests
    setPendingRequests(prev => prev.filter(id => id !== studentId));
    
    toast({
      title: "Connection accepted",
      description: `You are now connected with student ID: ${studentId}`,
    });
  };
  
  const removeConnection = (studentId: string) => {
    setConnections(prev => prev.filter(id => id !== studentId));
    
    toast({
      title: "Connection removed",
      description: `You have removed the connection with student ID: ${studentId}`,
    });
  };
  
  const openMessaging = (student: any) => {
    setSelectedStudent(student);
    setShowMessaging(true);
    
    // Initialize messages array if it doesn't exist
    if (!messages[student.studentId]) {
      setMessages(prev => ({ ...prev, [student.studentId]: [] }));
    }
  };
  
  const sendMessage = () => {
    if (!messageText.trim() || !selectedStudent) return;
    
    const newMessage = {
      text: messageText,
      sender: "me",
      timestamp: new Date()
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedStudent.studentId]: [...(prev[selectedStudent.studentId] || []), newMessage]
    }));
    
    setMessageText("");
    
    // Simulate a reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "Sure, that works for me!",
        "When would you like to meet?",
        "Thanks for reaching out!",
        "I'm also studying for that exam.",
        "Let's meet at the library.",
        "I have class until 3pm, can we meet after?",
        "That's a great idea!",
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage = {
        text: randomReply,
        sender: selectedStudent.studentId,
        timestamp: new Date()
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedStudent.studentId]: [...(prev[selectedStudent.studentId] || []), replyMessage]
      }));
    }, 2000);
  };
  
  const isConnected = (studentId: string) => {
    return connections.includes(studentId);
  };
  
  const isPendingConnection = (studentId: string) => {
    return pendingRequests.includes(studentId);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Find Your Study Buddy</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with fellow students based on your courses, learning style, and location to enhance your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student ID Finder - Enhanced */}
            <div className="bg-sfu-lightgray p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                  <UserSearch size={20} />
                </div>
                <h2 className="text-xl font-display font-semibold">Find Students by ID</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Enter a student ID to find potential study partners from your college.
              </p>
              
              <div className="flex gap-3 mb-6">
                <div className="flex-grow">
                  <Input 
                    type="text" 
                    placeholder="Try: 2024D5963, 2024D5962, etc." 
                    value={studentIdLookup}
                    onChange={(e) => setStudentIdLookup(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button
                  onClick={findStudentById}
                  disabled={isSearching}
                  className="bg-sfu-red hover:bg-sfu-red/90 text-white"
                >
                  {isSearching ? "Searching..." : "Find Student"}
                </Button>
              </div>
              
              {user && (
                <div className="mb-4 p-3 bg-white rounded-lg text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Your student ID:</span>
                    <span className="font-mono text-xs font-semibold bg-sfu-red/10 text-sfu-red px-2 py-1 rounded">
                      {user.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Other students can find you using this ID. Share it with classmates you want to study with!
                  </p>
                </div>
              )}
              
              {connections.length > 0 && (
                <div className="mb-4 p-3 bg-white rounded-lg">
                  <h3 className="font-medium text-sm mb-2">Your Connections ({connections.length})</h3>
                  <div className="space-y-2">
                    {connections.map(studentId => {
                      const student = allStudentsData.find(s => s.studentId === studentId);
                      if (!student) return null;
                      
                      return (
                        <div key={student.id} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{student.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => openMessaging(student)}
                            >
                              <MessageCircle size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => removeConnection(student.studentId)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mt-6">
                <h3 className="font-medium text-sm uppercase text-gray-500">
                  {matchedStudents.length > 0 ? "Matched Students" : "Find students to display results"}
                </h3>
                
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 mx-auto border-2 border-sfu-red border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Searching for students...</p>
                  </div>
                ) : matchedStudents.length > 0 ? (
                  matchedStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-gray-200">
                          <AvatarFallback className="bg-sfu-red/10 text-sfu-red">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.major} - {student.batch}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-sfu-red">{student.course}</span>
                        <span className="text-xs text-gray-500">{student.studentId}</span>
                        <div className="flex gap-2 mt-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs p-0 h-auto text-blue-500"
                            onClick={() => viewStudentProfile(student)}
                          >
                            View Profile
                          </Button>
                          
                          {isConnected(student.studentId) ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs p-0 h-auto text-green-600 flex items-center gap-1"
                              onClick={() => openMessaging(student)}
                            >
                              <MessageCircle size={12} />
                              Message
                            </Button>
                          ) : isPendingConnection(student.studentId) ? (
                            <span className="text-xs text-orange-500">Request Sent</span>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs p-0 h-auto text-indigo-600 flex items-center gap-1"
                              onClick={() => sendConnectionRequest(student.studentId)}
                            >
                              <UserPlus size={12} />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Enter a student ID above to find potential study partners
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Side: Student Profile, Messaging or Upcoming Sessions */}
            <div className="bg-sfu-lightgray p-6 rounded-xl">
              {showMessaging && selectedStudent ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-gray-200">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {selectedStudent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-display font-semibold">{selectedStudent.name}</h2>
                        <div className="text-xs text-gray-500">{selectedStudent.course} • {selectedStudent.major}</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowMessaging(false)}
                    >
                      Back
                    </Button>
                  </div>
                  
                  <div className="bg-white rounded-lg h-80 overflow-y-auto mb-4 p-4">
                    <div className="space-y-3">
                      {messages[selectedStudent.studentId]?.length > 0 ? (
                        messages[selectedStudent.studentId].map((msg, index) => (
                          <div 
                            key={index} 
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[70%] px-3 py-2 rounded-lg ${
                                msg.sender === 'me' 
                                  ? 'bg-blue-500 text-white rounded-br-none' 
                                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-10">
                          <p>No messages yet</p>
                          <p className="text-xs mt-2">Send a message to start the conversation</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      type="text" 
                      placeholder="Type your message..." 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="bg-white"
                    />
                    <Button 
                      variant="message"
                      onClick={sendMessage}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              ) : selectedStudent ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-display font-semibold">Student Profile</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedStudent(null)}
                    >
                      Back to Sessions
                    </Button>
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border border-gray-200">
                          <AvatarFallback className="bg-sfu-red/10 text-sfu-red text-lg">
                            {selectedStudent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{selectedStudent.name}</CardTitle>
                          <CardDescription className="flex flex-col gap-1 mt-1">
                            <span className="text-sfu-red font-medium">{selectedStudent.studentId}</span>
                            <span>{selectedStudent.major} - {selectedStudent.batch}</span>
                            <span>Current Course: {selectedStudent.course}</span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-1">About</h3>
                          <p className="text-sm text-gray-600">{selectedStudent.bio}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Study Interests</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedStudent.interests.map((interest: string, index: number) => (
                              <span key={index} className="text-xs bg-sfu-red/10 text-sfu-red px-2 py-1 rounded-full">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-1">Availability</h3>
                          <p className="text-sm text-gray-600">{selectedStudent.availability}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isConnected(selectedStudent.studentId) ? (
                        <Button 
                          variant="connected" 
                          className="w-full gap-2"
                          onClick={() => openMessaging(selectedStudent)}
                        >
                          <MessageCircle size={16} />
                          Message {selectedStudent.name.split(' ')[0]}
                        </Button>
                      ) : isPendingConnection(selectedStudent.studentId) ? (
                        <Button 
                          disabled 
                          className="w-full gap-2 opacity-60"
                        >
                          <UserCheck size={16} />
                          Connection Request Sent
                        </Button>
                      ) : (
                        <Button 
                          variant="connect" 
                          className="w-full gap-2"
                          onClick={() => sendConnectionRequest(selectedStudent.studentId)}
                        >
                          <UserPlus size={16} />
                          Connect with {selectedStudent.name.split(' ')[0]}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <h2 className="text-xl font-display font-semibold">Upcoming Study Sessions</h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {upcomingSessions.map(session => (
                      <div key={session.id} className="bg-white p-4 rounded-lg hover:shadow-sm transition-all duration-200">
                        <h3 className="font-medium mb-2">{session.subject}</h3>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={16} />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} />
                            <span>{session.location}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users size={14} />
                            <span>{session.participants} participants</span>
                          </div>
                          <Button variant="outline" size="sm" className="text-xs">Join Session</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-white text-sfu-red hover:bg-gray-50 border border-sfu-red/20">
                    Create Study Session
                  </Button>
                  
                  <div className="mt-6 p-4 bg-sfu-red/10 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-sfu-red/20 text-sfu-red flex items-center justify-center flex-shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">Study Partner Matching</h3>
                        <p className="text-xs text-gray-600 mb-2">
                          Our AI-powered system can match you with compatible study partners based on your courses, learning style, and schedule.
                        </p>
                        <Button variant="outline" size="sm" className="text-xs w-full justify-center">Find My Perfect Match</Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Study;

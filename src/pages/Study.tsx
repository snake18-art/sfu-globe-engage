
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Users, BookOpen, Clock, Calendar, Search, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Study = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyStudents, setNearbyStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [studentIdLookup, setStudentIdLookup] = useState("");
  const [matchedStudents, setMatchedStudents] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Sample data for all students
  const allStudentsData = [
    { id: 1, name: "Alex Chen", studentId: "A12345", course: "CMPT 120", major: "Computer Science", batch: "2022", avatar: "" },
    { id: 2, name: "Morgan Liu", studentId: "A12346", course: "CMPT 225", major: "Computer Science", batch: "2021", avatar: "" },
    { id: 3, name: "Jessica Wong", studentId: "A12347", course: "MATH 151", major: "Mathematics", batch: "2022", avatar: "" },
    { id: 4, name: "David Kim", studentId: "A12348", course: "BUS 272", major: "Business", batch: "2023", avatar: "" },
    { id: 5, name: "Sarah Johnson", studentId: "A12349", course: "CHEM 121", major: "Chemistry", batch: "2022", avatar: "" },
    { id: 6, name: "Michael Park", studentId: "A12350", course: "PHYS 101", major: "Physics", batch: "2021", avatar: "" },
    { id: 7, name: "Emma Wilson", studentId: "A12351", course: "BISC 100", major: "Biology", batch: "2023", avatar: "" },
    { id: 8, name: "James Lee", studentId: "A12352", course: "PSYC 100", major: "Psychology", batch: "2022", avatar: "" },
    { id: 9, name: "Olivia Martinez", studentId: "A12353", course: "ENGL 101", major: "English", batch: "2021", avatar: "" },
    { id: 10, name: "Noah Brown", studentId: "A12354", course: "ECON 103", major: "Economics", batch: "2023", avatar: "" },
  ];

  // Study sessions data
  const upcomingSessions = [
    { id: 1, subject: "Algorithms Study Group", date: "Today, 3:00 PM", location: "AQ 3005", participants: 5 },
    { id: 2, subject: "Calculus Review", date: "Tomorrow, 11:00 AM", location: "Library Room 2", participants: 3 },
    { id: 3, subject: "Physics Lab Prep", date: "Oct 20, 4:30 PM", location: "SSC 7172", participants: 4 },
  ];

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
    
    // Simulate API call with timeout
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
    }, 1000);
  };

  // Legacy location-based function
  const getLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Simulate fetching nearby students
          setTimeout(() => {
            setNearbyStudents(allStudentsData.slice(0, 5));
            setIsLoading(false);
          }, 1500);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          // Simulate fetching nearby students even if location fails
          setTimeout(() => {
            setNearbyStudents(allStudentsData.slice(0, 5));
          }, 1500);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      // Simulate fetching nearby students even if geolocation is not supported
      setTimeout(() => {
        setNearbyStudents(allStudentsData.slice(0, 5));
      }, 1500);
    }
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
            {/* Student ID Finder - New Section */}
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
                    placeholder="Enter student ID (e.g., A12345)" 
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
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.major} - {student.batch}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-sfu-red">{student.course}</span>
                        <span className="text-xs text-gray-500">{student.studentId}</span>
                        <button className="text-xs text-blue-500 hover:underline mt-1">Connect</button>
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
            
            {/* Upcoming Study Sessions */}
            <div className="bg-sfu-lightgray p-6 rounded-xl">
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Study;

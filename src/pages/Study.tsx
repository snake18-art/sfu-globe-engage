
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Users, BookOpen, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Study = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyStudents, setNearbyStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for nearby students
  const studentsData = [
    { id: 1, name: "Alex Chen", course: "CMPT 120", distance: "0.5 km", avatar: "" },
    { id: 2, name: "Morgan Liu", course: "CMPT 225", distance: "0.8 km", avatar: "" },
    { id: 3, name: "Jessica Wong", course: "MATH 151", distance: "1.2 km", avatar: "" },
    { id: 4, name: "David Kim", course: "BUS 272", distance: "1.5 km", avatar: "" },
    { id: 5, name: "Sarah Johnson", course: "CHEM 121", distance: "2.1 km", avatar: "" },
  ];

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
            setNearbyStudents(studentsData);
            setIsLoading(false);
          }, 1500);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          // Simulate fetching nearby students even if location fails
          setTimeout(() => {
            setNearbyStudents(studentsData);
          }, 1500);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
      // Simulate fetching nearby students even if geolocation is not supported
      setTimeout(() => {
        setNearbyStudents(studentsData);
      }, 1500);
    }
  };

  // Study sessions data
  const upcomingSessions = [
    { id: 1, subject: "Algorithms Study Group", date: "Today, 3:00 PM", location: "AQ 3005", participants: 5 },
    { id: 2, subject: "Calculus Review", date: "Tomorrow, 11:00 AM", location: "Library Room 2", participants: 3 },
    { id: 3, subject: "Physics Lab Prep", date: "Oct 20, 4:30 PM", location: "SSC 7172", participants: 4 },
  ];

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
            {/* Location Finder */}
            <div className="bg-sfu-lightgray p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-display font-semibold">Find Nearby Students</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Share your location to find study partners currently near you on campus.
              </p>
              
              <Button
                onClick={getLocation}
                disabled={isLoading}
                className="w-full bg-sfu-red hover:bg-sfu-red/90 text-white mb-6"
              >
                {isLoading ? "Finding Students..." : (location ? "Refresh Location" : "Share My Location")}
              </Button>
              
              {location && (
                <div className="mb-4 p-3 bg-white rounded-lg text-sm">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Your coordinates:</span>
                    <span className="font-mono text-xs">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                  </div>
                  <div className="h-2 bg-sfu-red/20 rounded-full overflow-hidden">
                    <div className="h-full bg-sfu-red w-full animate-pulse"></div>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 mt-6">
                <h3 className="font-medium text-sm uppercase text-gray-500">Nearby Students</h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 mx-auto border-2 border-sfu-red border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Finding students near you...</p>
                  </div>
                ) : nearbyStudents.length > 0 ? (
                  nearbyStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">{student.course}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-sfu-red">{student.distance}</span>
                        <button className="text-xs text-blue-500 hover:underline">Connect</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {location ? "No students found nearby" : "Share your location to find students"}
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

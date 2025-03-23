
import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Users, BookOpen, Clock, Calendar } from "lucide-react";

interface StudySessionsProps {
  upcomingSessions: {
    id: number;
    subject: string;
    date: string;
    location: string;
    participants: number;
  }[];
}

const StudySessions: React.FC<StudySessionsProps> = ({ upcomingSessions }) => {
  return (
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
  );
};

export default StudySessions;

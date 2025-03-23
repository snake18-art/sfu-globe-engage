
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";

interface StudentProfileProps {
  student: any;
  onBack: () => void;
  onOpenMessaging: (student: any) => void;
  onSendConnectionRequest: (studentId: string) => void;
  isConnected: (studentId: string) => boolean;
  isPendingConnection: (studentId: string) => boolean;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, 
  onBack,
  onOpenMessaging,
  onSendConnectionRequest,
  isConnected,
  isPendingConnection
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-semibold">Student Profile</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back to Sessions
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border border-gray-200">
              <AvatarFallback className="bg-sfu-red/10 text-sfu-red text-lg">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription className="flex flex-col gap-1 mt-1">
                <span className="text-sfu-red font-medium">{student.studentId}</span>
                <span>{student.major} - {student.batch}</span>
                <span>Current Course: {student.course}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">About</h3>
              <p className="text-sm text-gray-600">{student.bio}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Study Interests</h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest: string, index: number) => (
                  <span key={index} className="text-xs bg-sfu-red/10 text-sfu-red px-2 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Availability</h3>
              <p className="text-sm text-gray-600">{student.availability}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isConnected(student.studentId) ? (
            <Button 
              variant="connected" 
              className="w-full gap-2"
              onClick={() => onOpenMessaging(student)}
            >
              <MessageCircle size={16} />
              Message {student.name.split(' ')[0]}
            </Button>
          ) : isPendingConnection(student.studentId) ? (
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
              onClick={() => onSendConnectionRequest(student.studentId)}
            >
              <UserPlus size={16} />
              Connect with {student.name.split(' ')[0]}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default StudentProfile;

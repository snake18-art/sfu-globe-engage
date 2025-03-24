
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MessageSquare, Users } from "lucide-react";
import { Club } from "@/pages/Clubs";

interface ClubCardProps {
  club: Club;
  isJoined: boolean;
  onJoin: () => void;
  onViewDetails: () => void;
  onOpenMessaging: () => void;
}

const ClubCard: React.FC<ClubCardProps> = ({
  club,
  isJoined,
  onJoin,
  onViewDetails,
  onOpenMessaging
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100">
            {club.icon}
          </div>
          <div>
            <h3 className="text-xl font-medium">{club.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-1" />
              <span>{club.members} members</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 text-sm mb-2">{club.description}</p>
        <div className="text-xs text-gray-500">
          <div className="mb-1"><strong>Location:</strong> {club.location}</div>
          <div><strong>Meets:</strong> {club.meetingTime}</div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button 
          onClick={onJoin}
          variant={isJoined ? "outline" : "default"}
          className={isJoined ? "border-green-500 text-green-600" : "bg-sfu-red hover:bg-sfu-red/90"}
          size="sm"
        >
          {isJoined ? "Joined" : "Join Club"}
        </Button>
        
        <div className="flex gap-2">
          {isJoined && (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600"
              onClick={onOpenMessaging}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewDetails}
          >
            Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClubCard;

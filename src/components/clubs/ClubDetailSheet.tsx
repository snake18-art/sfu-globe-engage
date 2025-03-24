
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from "@/components/ui/sheet";
import { MessageSquare, Users, Calendar, MapPin } from "lucide-react";
import { Club } from "@/pages/Clubs";

interface ClubDetailSheetProps {
  club: Club;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isJoined: boolean;
  onJoin: () => void;
  onOpenMessaging: () => void;
}

const ClubDetailSheet: React.FC<ClubDetailSheetProps> = ({
  club,
  isOpen,
  setIsOpen,
  isJoined,
  onJoin,
  onOpenMessaging
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gray-100">
              {club.icon}
            </div>
            <div>
              <SheetTitle className="text-2xl">{club.name}</SheetTitle>
              <SheetDescription className="flex items-center mt-1">
                <Users className="h-4 w-4 mr-1 text-gray-500" />
                <span>{club.members} members</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">About</h3>
            <p className="text-gray-600">{club.description}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Meeting Details</h3>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{club.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{club.meetingTime}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Activities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {club.activities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <SheetFooter className="mt-8 flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onJoin}
            className={isJoined ? "border-green-500 text-green-600" : "bg-sfu-red hover:bg-sfu-red/90 text-white"}
            variant={isJoined ? "outline" : "default"}
          >
            {isJoined ? "Joined" : "Join Club"}
          </Button>
          
          {isJoined && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onOpenMessaging}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message Club Members</span>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ClubDetailSheet;

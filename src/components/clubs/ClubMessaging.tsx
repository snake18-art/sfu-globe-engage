
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Send } from "lucide-react";
import { Club, Message } from "@/pages/Clubs";

interface ClubMessagingProps {
  club: Club;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

const ClubMessaging: React.FC<ClubMessagingProps> = ({
  club,
  isOpen,
  setIsOpen,
  messages,
  onSendMessage,
  currentUserId
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-lg">{club.name} Chat</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-10">
              <p>No messages yet.</p>
              <p className="text-sm">Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showDateHeader = index === 0 || 
                new Date(messages[index-1].timestamp).getDate() !== new Date(message.timestamp).getDate();
              
              return (
                <React.Fragment key={message.id}>
                  {showDateHeader && (
                    <div className="text-center text-xs text-gray-500 my-2">
                      {isToday(new Date(message.timestamp)) ? 'Today' : formatDate(new Date(message.timestamp))}
                    </div>
                  )}
                  <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        isCurrentUser 
                          ? 'bg-sfu-red/90 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-medium mb-1">{message.senderName}</div>
                      )}
                      <div>{message.content}</div>
                      <div className="text-xs opacity-70 text-right mt-1">
                        {formatTime(new Date(message.timestamp))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <SheetFooter className="p-4 border-t mt-auto">
          <div className="flex w-full gap-2">
            <textarea
              className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-sfu-red"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
            />
            <Button 
              className="bg-sfu-red hover:bg-sfu-red/90"
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ""}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ClubMessaging;

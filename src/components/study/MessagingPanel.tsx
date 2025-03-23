
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessagingPanelProps {
  student: any;
  onBack: () => void;
  messages: { text: string; sender: string; timestamp: Date }[];
  onSendMessage: (text: string) => void;
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ 
  student, 
  onBack, 
  messages,
  onSendMessage
}) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText);
    setMessageText("");
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-gray-200">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {student.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display font-semibold">{student.name}</h2>
            <div className="text-xs text-gray-500">{student.course} • {student.major}</div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      
      <div className="bg-white rounded-lg h-80 overflow-y-auto mb-4 p-4">
        <div className="space-y-3">
          {messages?.length > 0 ? (
            messages.map((msg, index) => (
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
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="bg-white"
        />
        <Button 
          variant="message"
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessagingPanel;

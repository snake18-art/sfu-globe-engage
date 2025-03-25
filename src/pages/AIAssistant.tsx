
import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Sparkles, Send, Heart, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample responses for demo purposes
const MENTAL_HEALTH_RESPONSES = [
  "Remember to take breaks and practice self-care during stressful periods.",
  "Deep breathing exercises can help manage anxiety. Try breathing in for 4 counts, holding for 4, and releasing for 6.",
  "It's important to maintain a healthy sleep schedule, especially during exam periods.",
  "Connecting with friends and family can provide emotional support when you're feeling overwhelmed.",
  "Consider reaching out to campus counseling services if you're experiencing persistent distress.",
  "Physical activity, even just a short walk, can significantly improve your mood and reduce stress.",
  "Remember that it's okay to ask for help when you need it - everyone struggles sometimes.",
  "Setting realistic goals and celebrating small achievements can help maintain a positive outlook.",
];

const CAREER_GUIDANCE_RESPONSES = [
  "Consider gaining internship experience in fields you're interested in to build your resume.",
  "Networking events and career fairs are great opportunities to connect with potential employers.",
  "Tailoring your resume to each job application can significantly improve your chances of getting an interview.",
  "LinkedIn is a valuable tool for professional networking and job searching.",
  "Preparing specific examples of your achievements for interviews will help you stand out.",
  "Informational interviews can provide insights into career paths you're considering.",
  "Building a portfolio that showcases your skills and projects can be valuable for many fields.",
  "Consider joining professional organizations related to your field of interest for networking opportunities.",
];

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  category: "mental-health" | "career";
};

const AIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [category, setCategory] = useState<"mental-health" | "career">("mental-health");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initial greeting message
  useEffect(() => {
    const initialMessage = {
      id: "welcome",
      content: category === "mental-health" 
        ? "Hi there! I'm your mental health assistant. How are you feeling today?"
        : "Hello! I'm your career guidance assistant. How can I help with your career questions?",
      sender: "assistant" as const,
      timestamp: new Date(),
      category: category,
    };
    
    setMessages([initialMessage]);
  }, [category]);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
      category: category,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const responsePool = category === "mental-health" 
        ? MENTAL_HEALTH_RESPONSES 
        : CAREER_GUIDANCE_RESPONSES;
      
      const responseContent = responsePool[Math.floor(Math.random() * responsePool.length)];

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
        category: category,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTabChange = (value: string) => {
    setCategory(value as "mental-health" | "career");
  };

  const handleEmergencyHelp = () => {
    toast({
      title: "Emergency Resources",
      description: "If you need immediate support, please contact the campus counseling center at 123-456-7890 or national crisis hotline at 988.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">AI Guidance Assistant</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get support for mental health concerns and career guidance through our AI assistant.
              <span className="block mt-2 text-sm text-red-500">
                Note: This is not a substitute for professional advice.
              </span>
            </p>
          </div>

          <Tabs value={category} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="mental-health" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Mental Health
              </TabsTrigger>
              <TabsTrigger value="career" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Career Guidance
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="bg-white shadow-md rounded-xl overflow-hidden border-0">
            {/* Chat header */}
            <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  {category === "mental-health" ? (
                    <Heart className="h-5 w-5 text-white" />
                  ) : (
                    <GraduationCap className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {category === "mental-health" ? "Mental Health Assistant" : "Career Guidance Assistant"}
                  </h3>
                  <p className="text-xs text-white/80">Powered by AI</p>
                </div>
              </div>
              <Button 
                onClick={handleEmergencyHelp}
                variant="destructive" 
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-xs"
              >
                Emergency Help
              </Button>
            </div>
            
            {/* Chat messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "assistant" && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {category === "mental-health" ? "MH" : "CG"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-right text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarFallback className="bg-blue-500 text-white">
                        You
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center justify-start mb-4">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {category === "mental-health" ? "MH" : "CG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Type your ${category === "mental-health" ? "mental health" : "career"} question...`}
                  className="flex-1 focus-visible:ring-purple-500"
                />
                <Button
                  onClick={handleSend}
                  className="ml-2 bg-purple-500 hover:bg-purple-600"
                  size="icon"
                  disabled={isTyping || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                This AI assistant is for informational purposes only and not a substitute for professional {category === "mental-health" ? "medical or psychological" : "career"} advice.
              </p>
            </div>
          </Card>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="font-semibold text-purple-700">Mental Health Resources</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Campus Counseling Center: (123) 456-7890</li>
                <li>• 24/7 Crisis Helpline: 988</li>
                <li>• Online Mindfulness Resources: <a href="#" className="text-purple-600 underline">mindful.edu</a></li>
                <li>• Student Support Groups: Mon & Wed at 5PM</li>
                <li>• Wellness Center Hours: 9AM-5PM Weekdays</li>
              </ul>
            </Card>
            
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="font-semibold text-blue-700">Career Development</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Career Center Hours: 9AM-4PM Weekdays</li>
                <li>• Resume Workshop: Every Tuesday at 3PM</li>
                <li>• Job Board: <a href="#" className="text-blue-600 underline">campus-careers.edu</a></li>
                <li>• Mock Interviews: Book online or call (123) 456-7891</li>
                <li>• Alumni Mentorship Program: Applications open now</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIAssistant;

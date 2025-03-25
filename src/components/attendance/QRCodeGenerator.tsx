
import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { RefreshCw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  courseId: string;
  courseName: string;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ courseId, courseName, className }) => {
  const [qrValue, setQrValue] = useState("");
  const [expiresIn, setExpiresIn] = useState(300); // 5 minutes by default
  const { toast } = useToast();
  
  // Generate a new code
  const generateQRCode = () => {
    // Create a unique code with timestamp, course ID, and random string
    const timestamp = new Date().getTime();
    const randomStr = Math.random().toString(36).substring(2, 10);
    const newCode = `${courseId}:${timestamp}:${randomStr}`;
    
    setQrValue(newCode);
    setExpiresIn(300); // Reset timer
    
    toast({
      title: "New QR code generated",
      description: "The QR code will expire in 5 minutes",
    });
    
    // In a real app, you would save this to the database
    // saveQRCodeToDatabase(courseId, newCode, new Date(timestamp + 300000));
  };
  
  // Initialize QR code on component mount
  useEffect(() => {
    generateQRCode();
    
    // Set up timer to count down
    const timer = setInterval(() => {
      setExpiresIn(prev => {
        if (prev <= 1) {
          generateQRCode();
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [courseId]);
  
  // Format the remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue);
    toast({
      title: "Copied to clipboard",
      description: "The attendance code has been copied",
    });
  };
  
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Today's Attendance Code</h3>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={generateQRCode}
            title="Generate new code"
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            title="Copy code to clipboard"
          >
            <Copy size={16} className="mr-1" />
            Copy
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer bg-white p-3 rounded-lg hover:shadow-md transition-shadow">
              <QRCode
                value={qrValue}
                size={150}
                level="H"
                className="mx-auto"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Attendance QR Code for {courseName}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-6">
              <QRCode
                value={qrValue}
                size={280}
                level="H"
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              Display this on your screen or projector for students to scan
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="mt-3 text-sm font-medium">
          Code expires in: <span className={`${expiresIn < 60 ? 'text-red-500' : 'text-green-600'}`}>{formatTime(expiresIn)}</span>
        </div>
        
        <div className="mt-2 text-sm text-center text-gray-500">
          Students must scan this code in class to mark attendance
        </div>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;

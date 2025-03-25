
import React, { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, QrCode } from "lucide-react";

interface QRCodeScannerProps {
  onCodeScanned: (code: string) => void;
  className?: string;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onCodeScanned, className }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDecode = (result: string) => {
    // Close the scanner dialog
    setIsOpen(false);
    setIsScanning(false);

    // Notify parent component with the scanned code
    onCodeScanned(result);
    
    toast({
      title: "QR Code Scanned",
      description: "Processing your attendance...",
    });
  };

  const handleError = (error: Error) => {
    console.error("QR Scanner error:", error);
    toast({
      variant: "destructive",
      title: "Camera error",
      description: "Could not access camera. Please check permissions and try again.",
    });
    setIsScanning(false);
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-3">Scan Attendance QR Code</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="default" 
              className="mx-auto"
              onClick={() => setIsScanning(true)}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan Attendance QR Code</DialogTitle>
            </DialogHeader>
            
            {isScanning ? (
              <div className="h-72 w-full">
                <QrScanner
                  onDecode={handleDecode}
                  onError={handleError}
                  scanDelay={500}
                  constraints={{
                    facingMode: "environment"
                  }}
                />
              </div>
            ) : (
              <div className="h-72 w-full flex flex-col items-center justify-center bg-gray-100 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Initializing camera...</p>
              </div>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-2">
              Please scan the QR code displayed by your instructor
            </p>
          </DialogContent>
        </Dialog>
        
        <p className="text-sm text-gray-500 mt-2">
          You must be physically present in class to mark attendance
        </p>
      </div>
    </Card>
  );
};

export default QRCodeScanner;

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentDashboard from "@/components/attendance/StudentDashboard";
import TeacherDashboard from "@/components/attendance/TeacherDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const Attendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Get user role from metadata - default to student if no role specified
  const userRole = user?.user_metadata?.role === "teacher" ? "teacher" : "student";
  
  // State to track the currently selected view
  const [selectedView, setSelectedView] = useState<"student" | "teacher">(userRole);
  
  // When view changes, check for permission
  const handleViewChange = (value: string) => {
    const newValue = value as "student" | "teacher";
    
    // If user is a student and trying to access teacher view
    if (userRole === "student" && newValue === "teacher") {
      toast({
        title: "Access Denied",
        description: "Only teachers can access the teacher dashboard.",
        variant: "destructive",
      });
      return; // Don't change the view
    }
    
    // Otherwise, allow the change
    setSelectedView(newValue);
  };
  
  // Sample courses data
  const courses = [
    { id: "cmpt120", code: "CMPT 120", name: "Introduction to Computing", schedule: "Mon/Wed/Fri 10:30-11:20", attendance: 100 },
    { id: "math151", code: "MATH 151", name: "Calculus I", schedule: "Tue/Thu 13:30-15:20", attendance: 95 },
    { id: "chem121", code: "CHEM 121", name: "General Chemistry", schedule: "Mon/Wed 15:30-16:20, Fri 14:30-16:20", attendance: 88 },
    { id: "engl105", code: "ENGL 105", name: "Introduction to University Writing", schedule: "Tue/Thu 10:30-12:20", attendance: 91 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Attendance Management</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Secure and efficient attendance tracking with QR codes. 
              Scan the code in your class to mark your attendance.
            </p>
          </div>

          <Tabs value={selectedView} onValueChange={handleViewChange}>
            <div className="flex justify-center mb-6">
              <TabsList className="mx-auto">
                <TabsTrigger value="student">Student View</TabsTrigger>
                <TabsTrigger value="teacher" disabled={userRole === "student"}>
                  {userRole === "student" && (
                    <Shield className="h-4 w-4 mr-1" />
                  )}
                  Teacher View
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="student">
              <StudentDashboard courses={courses} />
            </TabsContent>
            
            <TabsContent value="teacher">
              <TeacherDashboard courses={courses} />
            </TabsContent>
          </Tabs>
          
          {userRole === "student" && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Teacher features are restricted to authorized teaching staff only.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Attendance;

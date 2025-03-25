
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import QRCodeScanner from "./QRCodeScanner";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Star } from "lucide-react";

interface StudentDashboardProps {
  courses: Array<{
    id: string;
    code: string;
    name: string;
    schedule: string;
    attendance: number;
  }>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ courses }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const [upcomingClasses, setUpcomingClasses] = useState<Array<{
    id: string;
    code: string;
    name: string;
    time: string;
    status: "upcoming" | "in-progress" | "completed";
  }>>([]);
  
  useEffect(() => {
    // Simulate fetching upcoming classes
    // In a real app, this would be filtered based on the day of week and current time
    const currentHour = new Date().getHours();
    
    const classes = courses.map(course => {
      // Extract just the first time from the schedule for demo purposes
      const timeMatch = course.schedule.match(/\d{1,2}:\d{2}/);
      const classTime = timeMatch ? timeMatch[0] : "10:30";
      
      // Parse the hour for simple comparison
      const hourMatch = classTime.match(/(\d{1,2}):/);
      const classHour = hourMatch ? parseInt(hourMatch[1]) : 0;
      
      let status: "upcoming" | "in-progress" | "completed" = "upcoming";
      
      if (classHour < currentHour) {
        status = "completed";
      } else if (classHour === currentHour) {
        status = "in-progress";
      }
      
      return {
        id: course.id,
        code: course.code,
        name: course.name,
        time: classTime,
        status
      };
    });
    
    setUpcomingClasses(classes);
  }, [courses]);
  
  const handleCodeScanned = (code: string) => {
    console.log("QR Code scanned:", code);
    
    // Parse the code (courseId:timestamp:random)
    const parts = code.split(":");
    if (parts.length !== 3) {
      toast({
        variant: "destructive",
        title: "Invalid QR code",
        description: "The QR code format is not recognized.",
      });
      return;
    }
    
    const courseId = parts[0];
    const timestamp = parseInt(parts[1]);
    
    // Check if code is expired (more than 5 minutes old)
    const now = new Date().getTime();
    if (now - timestamp > 5 * 60 * 1000) {
      toast({
        variant: "destructive",
        title: "Expired QR code",
        description: "This attendance code has expired. Please ask your instructor for a new code.",
      });
      return;
    }
    
    // Check if the course exists
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      toast({
        variant: "destructive",
        title: "Invalid course",
        description: "This QR code is for a course you are not enrolled in.",
      });
      return;
    }
    
    // Success! Mark attendance
    toast({
      title: "Attendance marked!",
      description: `You have been marked present for ${course.code}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <QRCodeScanner 
            onCodeScanned={handleCodeScanned}
          />
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Today's Classes</h3>
              <div className="space-y-3">
                {upcomingClasses.map(cls => (
                  <div 
                    key={cls.id} 
                    className={`p-3 border rounded-lg ${
                      cls.status === 'in-progress' 
                        ? 'border-green-200 bg-green-50' 
                        : cls.status === 'completed'
                          ? 'border-gray-200 bg-gray-50' 
                          : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{cls.code}</div>
                        <div className="text-sm text-gray-500">{cls.time}</div>
                      </div>
                      {cls.status === 'in-progress' ? (
                        <div className="pill bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          In Progress
                        </div>
                      ) : cls.status === 'completed' ? (
                        <div className="pill bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                          Completed
                        </div>
                      ) : (
                        <div className="pill bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          Upcoming
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-3">Attendance Overview</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="text-gray-500 text-sm mb-1">Present</div>
                  <div className="text-2xl font-bold text-gray-800">42</div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-100">
                  <XCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <div className="text-gray-500 text-sm mb-1">Absent</div>
                  <div className="text-2xl font-bold text-gray-800">3</div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-gray-500 text-sm mb-1">Late</div>
                  <div className="text-2xl font-bold text-gray-800">5</div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
                  <Star className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-gray-500 text-sm mb-1">Streak</div>
                  <div className="text-2xl font-bold text-gray-800">16</div>
                </div>
              </div>
              
              <div className="mb-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="all-courses">
            <TabsList>
              <TabsTrigger value="all-courses">All Courses</TabsTrigger>
              <TabsTrigger value="at-risk">At Risk</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all-courses">
              <div className="rounded-md border">
                <div className="bg-sfu-black text-white p-4">
                  <h3 className="font-semibold">Course Attendance</h3>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{course.code}</div>
                          <div className="text-sm text-gray-500">{course.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {course.schedule}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex flex-col items-center">
                            <div className={`text-sm font-medium ${
                              course.attendance >= 90 ? 'text-green-600' : 
                              course.attendance >= 80 ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {course.attendance}%
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                              <div 
                                className={`h-full ${
                                  course.attendance >= 90 ? 'bg-green-500' : 
                                  course.attendance >= 80 ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                style={{ width: `${course.attendance}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="at-risk">
              <div className="rounded-md border">
                <div className="bg-sfu-red text-white p-4">
                  <h3 className="font-semibold">At Risk Courses</h3>
                </div>
                
                <div className="p-6 text-center">
                  <div className="text-lg font-medium text-gray-500">
                    You have no courses below the attendance threshold.
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Keep up the good work!
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

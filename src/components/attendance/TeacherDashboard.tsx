
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCodeGenerator from "./QRCodeGenerator";
import AttendanceTable from "./AttendanceTable";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface TeacherDashboardProps {
  courses: Array<{
    id: string;
    code: string;
    name: string;
  }>;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ courses }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || "");
  const { toast } = useToast();

  // Sample student data - in a real app, this would come from your backend
  const [studentAttendance, setStudentAttendance] = useState([
    {
      id: "1",
      name: "Alex Johnson",
      status: "present" as const,
      checkInTime: "10:15 AM",
      method: "qr" as const
    },
    {
      id: "2",
      name: "Jamie Smith",
      status: "late" as const,
      checkInTime: "10:45 AM",
      method: "qr" as const
    },
    {
      id: "3",
      name: "Taylor Brown",
      status: "absent" as const,
      checkInTime: undefined,
      method: "system" as const
    },
    {
      id: "4",
      name: "Morgan Williams",
      status: "excused" as const,
      checkInTime: undefined,
      method: "manual" as const
    }
  ]);

  const handleStatusChange = (studentId: string, newStatus: "present" | "absent" | "late" | "excused") => {
    const updatedAttendance = studentAttendance.map(student => {
      if (student.id === studentId) {
        const updatedStudent = { 
          ...student, 
          status: newStatus,
          method: "manual" as const,
          // If marking as present/late and there was no check-in time, add current time
          checkInTime: (newStatus === "present" || newStatus === "late") && !student.checkInTime 
            ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            : student.checkInTime
        };
        return updatedStudent;
      }
      return student;
    });
    
    setStudentAttendance(updatedAttendance);
    
    toast({
      title: "Attendance updated",
      description: `Student status has been changed to ${newStatus}`,
    });
  };

  const getCurrentCourse = () => {
    return courses.find(course => course.id === selectedCourse) || courses[0];
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={courses[0]?.id} value={selectedCourse} onValueChange={setSelectedCourse}>
        <TabsList className="mb-4">
          {courses.map(course => (
            <TabsTrigger key={course.id} value={course.id}>
              {course.code}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {courses.map(course => (
          <TabsContent key={course.id} value={course.id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <QRCodeGenerator 
                  courseId={course.id} 
                  courseName={course.name} 
                />
                
                <Card className="p-4">
                  <h3 className="font-semibold text-lg mb-3">Select Date</h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <AttendanceTable 
                  students={studentAttendance}
                  date={selectedDate}
                  courseId={course.id}
                  onStatusChange={handleStatusChange}
                  isTeacher={true}
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;

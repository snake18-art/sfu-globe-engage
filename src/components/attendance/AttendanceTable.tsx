
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

interface StudentAttendance {
  id: string;
  name: string;
  status: "present" | "absent" | "late" | "excused";
  checkInTime?: string;
  method: "qr" | "manual" | "system";
}

interface AttendanceTableProps {
  students: StudentAttendance[];
  date: Date;
  courseId: string;
  onStatusChange?: (studentId: string, newStatus: StudentAttendance["status"]) => void;
  isTeacher?: boolean;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  students, 
  date, 
  onStatusChange,
  isTeacher = false 
}) => {
  const getStatusIcon = (status: StudentAttendance["status"]) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: StudentAttendance["status"]) => {
    switch (status) {
      case "present":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Present</Badge>;
      case "late":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Late</Badge>;
      case "absent":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Absent</Badge>;
      case "excused":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Excused</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleStatusChange = (studentId: string, newStatus: StudentAttendance["status"]) => {
    if (onStatusChange) {
      onStatusChange(studentId, newStatus);
    }
  };

  return (
    <div className="rounded-md border">
      <div className="bg-sfu-black text-white p-4">
        <h3 className="font-semibold">Attendance for {formatDate(date)}</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Student</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in Time</TableHead>
            <TableHead>Method</TableHead>
            {isTeacher && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(student.status)}
                  <span>{getStatusBadge(student.status)}</span>
                </div>
              </TableCell>
              <TableCell>{student.checkInTime || "-"}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {student.method === "qr" ? "QR Scan" : 
                   student.method === "manual" ? "Manual Entry" : "System"}
                </Badge>
              </TableCell>
              
              {isTeacher && (
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(student.id, "present")}
                      disabled={student.status === "present"}
                    >
                      Present
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(student.id, "late")}
                      disabled={student.status === "late"}
                    >
                      Late
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(student.id, "absent")}
                      disabled={student.status === "absent"}
                    >
                      Absent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStatusChange(student.id, "excused")}
                      disabled={student.status === "excused"}
                    >
                      Excused
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;

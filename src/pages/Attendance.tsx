
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CalendarCheck, CheckCircle, XCircle, Clock, BarChart, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Sample attendance data
  const attendanceData = {
    total: 45,
    present: 42,
    absent: 3,
    late: 5,
    streak: 16,
    percentage: 93.3,
    history: [
      { date: "2023-10-02", status: "present" },
      { date: "2023-10-03", status: "present" },
      { date: "2023-10-05", status: "present" },
      { date: "2023-10-06", status: "late" },
      { date: "2023-10-09", status: "present" },
      { date: "2023-10-10", status: "present" },
      { date: "2023-10-12", status: "absent" },
      { date: "2023-10-13", status: "present" },
      { date: "2023-10-16", status: "present" },
      { date: "2023-10-17", status: "late" },
      { date: "2023-10-19", status: "present" },
      { date: "2023-10-20", status: "present" },
    ]
  };

  // Sample courses
  const courses = [
    { code: "CMPT 120", name: "Introduction to Computing", schedule: "Mon/Wed/Fri 10:30-11:20", attendance: 100 },
    { code: "MATH 151", name: "Calculus I", schedule: "Tue/Thu 13:30-15:20", attendance: 95 },
    { code: "CHEM 121", name: "General Chemistry", schedule: "Mon/Wed 15:30-16:20, Fri 14:30-16:20", attendance: 88 },
    { code: "ENGL 105", name: "Introduction to University Writing", schedule: "Tue/Thu 10:30-12:20", attendance: 91 },
  ];

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Get day status for calendar
  const getDayStatus = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = attendanceData.history.find(item => item.date === dateStr);
    
    if (!dayData) return null;
    return dayData.status;
  };

  // Generate calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      const status = getDayStatus(day);
      
      days.push(
        <div 
          key={day} 
          className={`h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
            isToday ? 'border border-sfu-red' : ''
          } ${
            isSelected ? 'bg-sfu-red text-white' : ''
          } ${
            status === 'present' ? 'bg-green-100' : 
            status === 'late' ? 'bg-yellow-100' : 
            status === 'absent' ? 'bg-red-100' : ''
          } hover:bg-gray-100`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Attendance Tracking</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep track of your class attendance, view statistics, and maintain your perfect attendance streak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Attendance Stats */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4">
                  <h2 className="font-display font-semibold">Attendance Overview</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-sfu-lightgray p-4 rounded-lg text-center">
                      <div className="text-gray-500 text-sm mb-1">Attendance Rate</div>
                      <div className="text-3xl font-bold text-sfu-black">{attendanceData.percentage}%</div>
                    </div>
                    
                    <div className="bg-sfu-lightgray p-4 rounded-lg text-center">
                      <div className="text-gray-500 text-sm mb-1">Current Streak</div>
                      <div className="text-3xl font-bold text-sfu-black">{attendanceData.streak} days</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <span>Present</span>
                      </div>
                      <div className="font-bold">{attendanceData.present}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle size={18} className="text-red-500" />
                        <span>Absent</span>
                      </div>
                      <div className="font-bold">{attendanceData.absent}</div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-yellow-500" />
                        <span>Late</span>
                      </div>
                      <div className="font-bold">{attendanceData.late}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4">
                  <h2 className="font-display font-semibold">Today's Classes</h2>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">CMPT 120</div>
                        <div className="text-sm text-gray-500">10:30 - 11:20 AM</div>
                      </div>
                      <div className="pill bg-green-500 text-white text-xs px-2 py-1">
                        Present
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 bg-white rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">MATH 151</div>
                        <div className="text-sm text-gray-500">1:30 - 3:20 PM</div>
                      </div>
                      <Button size="sm" className="text-xs bg-sfu-red hover:bg-sfu-red/90">
                        Check In
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 bg-white rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">CHEM 121</div>
                        <div className="text-sm text-gray-500">3:30 - 4:20 PM</div>
                      </div>
                      <div className="text-xs text-gray-500">Upcoming</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calendar */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4 flex justify-between items-center">
                  <h2 className="font-display font-semibold">Attendance Calendar</h2>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      onClick={getPrevMonth}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    
                    <div className="text-sm">{formatDate(currentMonth)}</div>
                    
                    <button 
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      onClick={getNextMonth}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {renderCalendar()}
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-100"></div>
                      <span>Present</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
                      <span>Late</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-100"></div>
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-red text-white p-4">
                  <h2 className="font-display font-semibold">Course Attendance</h2>
                </div>
                
                <div className="p-4">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Attendance;

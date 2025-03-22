
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Trophy, ArrowUp, Crown, Award, Calendar, Search, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Leaderboard = () => {
  const [filter, setFilter] = useState("week");
  const [category, setCategory] = useState("all");
  const [animatedScores, setAnimatedScores] = useState<{[key: number]: number}>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample leaderboard data
  const leaderboardData = {
    week: [
      { rank: 1, name: "Sophia Chen", points: 1250, progress: "+28", avatar: "" },
      { rank: 2, name: "David Kim", points: 1198, progress: "+15", avatar: "" },
      { rank: 3, name: "Emily Wong", points: 1145, progress: "+21", avatar: "" },
      { rank: 4, name: "Michael Patel", points: 1089, progress: "+18", avatar: "" },
      { rank: 5, name: "Sarah Johnson", points: 1056, progress: "+12", avatar: "" },
      { rank: 6, name: "Jason Lee", points: 1022, progress: "+9", avatar: "" },
      { rank: 7, name: "Emma Thompson", points: 986, progress: "+14", avatar: "" },
      { rank: 8, name: "Ryan Garcia", points: 954, progress: "+7", avatar: "" },
      { rank: 9, name: "Lisa Wang", points: 921, progress: "+16", avatar: "" },
      { rank: 10, name: "Alex Martinez", points: 897, progress: "+11", avatar: "" },
      { rank: 11, name: "Kevin Brown", points: 865, progress: "+8", avatar: "" },
      { rank: 12, name: "Mia Wilson", points: 842, progress: "+10", avatar: "" },
      { rank: 13, name: "Daniel Jackson", points: 818, progress: "+6", avatar: "" },
      { rank: 14, name: "Olivia Davis", points: 795, progress: "+9", avatar: "" },
      { rank: 15, name: "James Miller", points: 772, progress: "+7", avatar: "" },
    ],
    month: [
      { rank: 1, name: "David Kim", points: 3450, progress: "+120", avatar: "" },
      { rank: 2, name: "Sophia Chen", points: 3280, progress: "+95", avatar: "" },
      { rank: 3, name: "Emily Wong", points: 3145, progress: "+87", avatar: "" },
      { rank: 4, name: "Michael Patel", points: 2920, progress: "+76", avatar: "" },
      { rank: 5, name: "Sarah Johnson", points: 2850, progress: "+68", avatar: "" },
      // Additional data...
    ],
    allTime: [
      { rank: 1, name: "Emily Wong", points: 12450, progress: "+350", avatar: "" },
      { rank: 2, name: "David Kim", points: 11980, progress: "+280", avatar: "" },
      { rank: 3, name: "Sophia Chen", points: 11450, progress: "+210", avatar: "" },
      { rank: 4, name: "Michael Patel", points: 10890, progress: "+190", avatar: "" },
      { rank: 5, name: "Sarah Johnson", points: 10560, progress: "+170", avatar: "" },
      // Additional data...
    ]
  };

  // Ref for animation
  const animationFrameRef = useRef<number>();

  // Sample rank levels data
  const rankLevels = [
    { name: "Bronze", points: "0 - 500", icon: <Award size={20} className="text-amber-700" /> },
    { name: "Silver", points: "501 - 1000", icon: <Award size={20} className="text-gray-400" /> },
    { name: "Gold", points: "1001 - 2000", icon: <Award size={20} className="text-yellow-500" /> },
    { name: "Platinum", points: "2001 - 3500", icon: <Crown size={20} className="text-blue-500" /> },
    { name: "Diamond", points: "3501+", icon: <Crown size={20} className="text-purple-500" /> },
  ];

  // Get user's rank (for demo, we'll assume the user is at rank 12 in the weekly data)
  const userRank = 12;
  const userData = leaderboardData.week.find(user => user.rank === userRank);

  // Function to animate the score counting
  const animateScores = (data: typeof leaderboardData.week) => {
    const finalScores: {[key: number]: number} = {};
    data.forEach((user) => {
      finalScores[user.rank] = user.points;
    });
    
    const initialScores: {[key: number]: number} = {};
    data.forEach((user) => {
      initialScores[user.rank] = 0;
    });
    
    setAnimatedScores(initialScores);
    
    let startTime: number | null = null;
    const duration = 1500; // 1.5 seconds
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const newScores: {[key: number]: number} = {};
      data.forEach((user) => {
        newScores[user.rank] = Math.floor(progress * user.points);
      });
      
      setAnimatedScores(newScores);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(step);
  };

  // Effect to simulate loading data and start animation
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      animateScores(leaderboardData[filter as keyof typeof leaderboardData]);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [filter]);

  // Function to get the correct badge for a rank
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown size={16} className="text-yellow-500" />;
    if (rank === 2) return <Crown size={16} className="text-gray-400" />;
    if (rank === 3) return <Crown size={16} className="text-amber-700" />;
    return rank;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Global Leaderboard</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Compete with fellow students and rise through the ranks to gain recognition for your academic achievements and participation.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Main Leaderboard */}
            <div className="w-full md:w-2/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy size={20} className="text-yellow-500" />
                    <h2 className="font-display font-semibold">Leaderboard Rankings</h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      className="text-xs bg-white/20 border border-white/10 rounded-md px-2 py-1"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="allTime">All Time</option>
                    </select>
                    
                    <select 
                      className="text-xs bg-white/20 border border-white/10 rounded-md px-2 py-1"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="academic">Academic</option>
                      <option value="social">Social</option>
                      <option value="athletic">Athletic</option>
                    </select>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 flex items-center justify-between text-sm text-gray-500 font-medium">
                  <div className="w-16 text-center">Rank</div>
                  <div className="flex-grow">Student</div>
                  <div className="w-24 text-right">Points</div>
                  <div className="w-16 text-right">Change</div>
                </div>

                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-sfu-red/20 border-t-sfu-red rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500">Loading leaderboard data...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {leaderboardData[filter as keyof typeof leaderboardData].map((user) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center p-4 hover:bg-gray-50 transition-colors duration-150 ${
                          user.rank === userRank ? 'bg-sfu-red/5 border-l-4 border-sfu-red' : ''
                        }`}
                      >
                        <div className="w-16 flex justify-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            user.rank === 1 ? 'bg-yellow-500' : 
                            user.rank === 2 ? 'bg-gray-400' : 
                            user.rank === 3 ? 'bg-amber-700' : 
                            'bg-gray-200 text-gray-500'
                          }`}>
                            {getRankBadge(user.rank)}
                          </div>
                        </div>
                        
                        <div className="flex-grow flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">
                              Level: {
                                user.points < 500 ? 'Bronze' :
                                user.points < 1000 ? 'Silver' :
                                user.points < 2000 ? 'Gold' :
                                user.points < 3500 ? 'Platinum' :
                                'Diamond'
                              }
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-24 text-right font-mono font-bold text-gray-800">
                          {animatedScores[user.rank] !== undefined ? animatedScores[user.rank].toLocaleString() : 0}
                        </div>
                        
                        <div className="w-16 text-right text-green-500 flex items-center justify-end gap-1">
                          <ArrowUp size={12} />
                          <span>{user.progress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <Button variant="outline" size="sm">
                    <ChevronDown size={16} className="mr-1" />
                    Load More
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    Showing 1-15 of 120 students
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full md:w-1/3 space-y-6">
              {/* User Card */}
              {userData && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-sfu-red to-sfu-red/80 text-white p-4">
                    <h3 className="font-display font-semibold">Your Ranking</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="font-medium text-lg">{userData.name}</div>
                        <div className="text-sm text-gray-500">Rank #{userData.rank}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <div className="text-sm text-gray-500">Level Progress</div>
                        <div className="text-sm font-medium">Silver</div>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-sfu-red rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        158 points to Gold Level
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-2xl font-bold">{animatedScores[userData.rank] || 0}</div>
                        <div className="text-xs text-gray-500">Total Points</div>
                      </div>
                      <div>
                        <div className="text-green-500 flex items-center justify-end gap-1">
                          <ArrowUp size={12} />
                          <span className="font-medium">{userData.progress}</span>
                        </div>
                        <div className="text-xs text-gray-500">This {filter}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Rank Levels */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4">
                  <h3 className="font-display font-semibold">Ranking Levels</h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {rankLevels.map((level, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 2 ? 'bg-white border border-yellow-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {level.icon}
                        <span className="font-medium">{level.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{level.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ways to Earn Points */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-sfu-black text-white p-4">
                  <h3 className="font-display font-semibold">Ways to Earn Points</h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {[
                    { activity: 'Complete quizzes', points: '5-25' },
                    { activity: 'Attend events', points: '10-50' },
                    { activity: 'Study group sessions', points: '15-30' },
                    { activity: 'Help other students', points: '5-20' },
                    { activity: 'Perfect attendance', points: '50' },
                    { activity: 'Win competitions', points: '25-100' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                          <ArrowUp size={14} />
                        </div>
                        {item.activity}
                      </div>
                      <div className="text-sm font-medium">
                        {item.points} pts
                      </div>
                    </div>
                  ))}
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

export default Leaderboard;

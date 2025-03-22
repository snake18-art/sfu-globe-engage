
import React from 'react';
import { Trophy, ArrowUp, Crown, Award } from 'lucide-react';

const RankingSection: React.FC = () => {
  const leaderboardUsers = [
    { rank: 1, name: 'Sophia Chen', points: 1250, progress: '+28', avatar: '' },
    { rank: 2, name: 'David Kim', points: 1198, progress: '+15', avatar: '' },
    { rank: 3, name: 'Emily Wong', points: 1145, progress: '+21', avatar: '' },
    { rank: 4, name: 'Michael Patel', points: 1089, progress: '+18', avatar: '' },
    { rank: 5, name: 'Sarah Johnson', points: 1056, progress: '+12', avatar: '' },
  ];

  const rankLevels = [
    { name: 'Bronze', points: '0 - 500', icon: <Award size={20} className="text-amber-700" /> },
    { name: 'Silver', points: '501 - 1000', icon: <Award size={20} className="text-gray-400" /> },
    { name: 'Gold', points: '1001 - 2000', icon: <Award size={20} className="text-yellow-500" /> },
    { name: 'Platinum', points: '2001 - 3500', icon: <Crown size={20} className="text-blue-500" /> },
    { name: 'Diamond', points: '3501+', icon: <Crown size={20} className="text-purple-500" /> },
  ];

  return (
    <section className="section bg-white">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-block">
              <span className="pill bg-sfu-red/10 text-sfu-red flex items-center gap-2">
                <Trophy size={14} /> Ranking System
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Compete and Earn Recognition
            </h2>
            
            <p className="text-gray-600">
              Our comprehensive ranking system rewards your engagement, academic achievements, and 
              community contributions with points and prestigious levels.
            </p>
            
            <div className="bg-sfu-lightgray rounded-lg p-5">
              <h3 className="font-medium text-lg mb-3">Ranking Levels</h3>
              <div className="space-y-3">
                {rankLevels.map((level, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 2 ? 'bg-white border border-yellow-200' : 'bg-white/50'
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
            
            <div className="space-y-3">
              <h3 className="font-medium text-lg">Ways to Earn Points</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Complete quizzes', 
                  'Attend events', 
                  'Study group sessions',
                  'Help other students',
                  'Perfect attendance',
                  'Win competitions'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                      <ArrowUp size={14} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <button className="px-6 py-3 bg-sfu-red text-white rounded-lg font-medium hover:bg-sfu-red/90 transition-all duration-300">
              View Full Leaderboard
            </button>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-sfu-black text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs">Global Leaderboard</div>
                </div>
                <div className="text-xs">Updated live</div>
              </div>
              
              <div className="bg-gradient-to-b from-sfu-lightgray to-white p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Top Performers</h3>
                  <select className="text-xs bg-white/70 border border-gray-200 rounded-md px-2 py-1">
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                </div>
                
                <div className="space-y-3 mb-6">
                  {leaderboardUsers.map((user, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200' 
                          : 'bg-white/80 border border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-700' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {index === 0 ? <Crown size={16} /> : user.rank}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">Level: Gold</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{user.points}</div>
                        <div className="text-xs text-green-500 flex items-center justify-end gap-1">
                          <ArrowUp size={12} />
                          {user.progress}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 rounded-lg bg-sfu-red/5 border border-sfu-red/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-sfu-black text-white flex items-center justify-center">
                        24
                      </div>
                      <div>
                        <div className="font-medium">You</div>
                        <div className="text-xs text-gray-500">Level: Silver</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">842</div>
                      <div className="text-xs text-green-500 flex items-center justify-end gap-1">
                        <ArrowUp size={12} />
                        +56
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">158 points to Gold Level</div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-sfu-red rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-sfu-red/5 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-sfu-red/10 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RankingSection;

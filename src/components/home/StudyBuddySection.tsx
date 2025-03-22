
import React, { useState } from 'react';
import { BookOpen, ChevronRight, Coffee, Calendar, Users } from 'lucide-react';

const StudyBuddySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { icon: <Users size={20} />, label: 'Find a Buddy' },
    { icon: <Calendar size={20} />, label: 'Schedule' },
    { icon: <Coffee size={20} />, label: 'Meet Up' }
  ];

  return (
    <section className="section bg-white">
      <div className="container-narrow">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-block">
              <span className="pill bg-sfu-red/10 text-sfu-red flex items-center gap-2">
                <BookOpen size={14} /> Study Buddy
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Find Your Perfect Study Partner
            </h2>
            
            <p className="text-gray-600">
              Our intelligent matching system connects you with compatible study partners 
              based on your courses, learning style, and schedule preferences.
            </p>
            
            <div className="bg-sfu-lightgray rounded-lg p-1 flex">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 text-sm py-2 px-4 rounded-md transition-all duration-200 flex-1 ${
                    activeTab === index 
                      ? 'bg-white text-sfu-black shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.icon}
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-6 bg-sfu-lightgray/50 rounded-lg border border-gray-100">
              {activeTab === 0 && (
                <div className="animate-fade-in">
                  <h3 className="font-medium mb-2 text-lg">Match Based On:</h3>
                  <ul className="space-y-3">
                    {[
                      'Course alignment',
                      'Learning style compatibility',
                      'Schedule availability',
                      'Study goals and objectives'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                          <ChevronRight size={14} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 1 && (
                <div className="animate-fade-in">
                  <h3 className="font-medium mb-2 text-lg">Smart Scheduling:</h3>
                  <ul className="space-y-3">
                    {[
                      'AI-powered schedule matcher',
                      'Sync with your calendar',
                      'Set study session durations',
                      'Get reminders before sessions'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                          <ChevronRight size={14} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 2 && (
                <div className="animate-fade-in">
                  <h3 className="font-medium mb-2 text-lg">Study Meet-Ups:</h3>
                  <ul className="space-y-3">
                    {[
                      'Campus location suggestions',
                      'Virtual meeting options',
                      'Study session templates',
                      'Post-session feedback'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-sfu-red/10 text-sfu-red flex items-center justify-center">
                          <ChevronRight size={14} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button className="px-6 py-3 bg-sfu-red text-white rounded-lg font-medium hover:bg-sfu-red/90 transition-all duration-300">
              Find a Study Buddy
            </button>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-sfu-black text-white p-3 flex items-center gap-3">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs">Study Buddy Finder</div>
              </div>
              
              <div className="bg-white p-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course</label>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sfu-red">
                      <option>CMPT 120 - Introduction to Computing</option>
                      <option>CMPT 225 - Data Structures and Algorithms</option>
                      <option>MATH 151 - Calculus I</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Learning Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'
                      ].map((style, i) => (
                        <div 
                          key={i} 
                          className={`px-3 py-2 border rounded-lg text-sm cursor-pointer transition-all duration-200 text-center ${
                            i === 0 ? 'border-sfu-red bg-sfu-red/5 text-sfu-red' : 'border-gray-200 hover:border-sfu-red/50'
                          }`}
                        >
                          {style}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Availability</label>
                    <div className="grid grid-cols-7 gap-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div 
                          key={i} 
                          className={`h-8 flex items-center justify-center rounded-md text-xs transition-all duration-200 ${
                            [0, 2, 4].includes(i) ? 'bg-sfu-red text-white' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button className="w-full py-2 bg-sfu-red text-white rounded-lg font-medium hover:bg-sfu-red/90 transition-all duration-200 text-sm">
                      Find Matches
                    </button>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium mb-3">Potential Matches</h4>
                    <div className="space-y-3">
                      {[
                        {name: 'Alex Chen', match: '95%', course: 'CMPT 120'},
                        {name: 'Morgan Liu', match: '87%', course: 'CMPT 120'}
                      ].map((match, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <div>
                              <div className="text-sm font-medium">{match.name}</div>
                              <div className="text-xs text-gray-500">{match.course}</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-sfu-red">{match.match}</div>
                        </div>
                      ))}
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

export default StudyBuddySection;

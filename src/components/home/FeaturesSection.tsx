
import React from 'react';
import FeatureCard from '../ui/feature-card';
import { BookOpen, Users, HelpCircle, CalendarCheck, Trophy, Gamepad } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Study Buddy',
      description: 'Find the perfect study partner to collaborate and excel in your courses together.',
      delay: 0
    },
    {
      icon: Users,
      title: 'Club Activities',
      description: 'Discover and join club events, workshops, and activities happening across campus.',
      delay: 1
    },
    {
      icon: HelpCircle,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with engaging quizzes designed to reinforce learning.',
      delay: 2
    },
    {
      icon: CalendarCheck,
      title: 'Attendance Tracking',
      description: 'Never miss a class with our sophisticated attendance tracking system.',
      delay: 3
    },
    {
      icon: Trophy,
      title: 'Ranking System',
      description: 'Compete with peers and earn recognition for your academic achievements.',
      delay: 4
    },
    {
      icon: Gamepad,
      title: 'Minor Games',
      description: 'Take a study break with our collection of fun, brain-stimulating mini-games.',
      delay: 5
    }
  ];

  return (
    <section id="features" className="section bg-gradient-to-b from-white to-sfu-lightgray">
      <div className="container-narrow">
        <div className="text-center mb-16">
          <span className="pill bg-sfu-red/10 text-sfu-red mb-4 inline-block">Features</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            SFU Globe combines powerful features to enhance your university experience
            both academically and socially.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

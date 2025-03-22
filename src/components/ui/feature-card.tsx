
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className,
  delay = 0
}) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-5px]",
        className
      )}
      style={{ 
        animationDelay: `${delay * 100}ms`,
        opacity: 0,
        animation: 'fadeIn 0.5s ease-out forwards',
        animationDelay: `${delay * 0.1}s`
      }}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-sfu-lightgray text-sfu-red mb-4 transition-all duration-300 group-hover:bg-sfu-red group-hover:text-white">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-display font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-sfu-red/5 rounded-full transform scale-0 transition-transform duration-300 group-hover:scale-[6]"></div>
    </div>
  );
};

export default FeatureCard;

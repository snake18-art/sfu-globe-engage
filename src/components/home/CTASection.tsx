
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-sfu-black -z-10"></div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-sfu-red opacity-5 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sfu-red opacity-10" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white opacity-5" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="pill bg-white/10 text-white inline-block mb-6">Join SFU Globe Today</span>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
          Ready to Enhance Your <br className="hidden md:block" />
          University Experience?
        </h2>
        
        <p className="text-gray-300 max-w-2xl mx-auto mb-10">
          Join thousands of SFU students who are already using SFU Globe to connect,
          learn, and grow. Start your journey today and unlock your full potential.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-3 rounded-lg bg-sfu-red text-white font-medium hover:bg-sfu-red/90 transition-all duration-300 flex items-center gap-2 min-w-48">
            Get Started <ArrowRight size={16} />
          </button>
          <button className="px-8 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm min-w-48 border border-white/20">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

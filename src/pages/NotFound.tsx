
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sfu-lightgray p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-sfu-red/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-6xl font-display font-bold text-sfu-red">404</span>
        </div>
        
        <h1 className="text-3xl font-display font-bold mb-4">Page Not Found</h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-sfu-red text-white rounded-lg font-medium hover:bg-sfu-red/90 transition-all duration-300"
        >
          <ArrowLeft size={18} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

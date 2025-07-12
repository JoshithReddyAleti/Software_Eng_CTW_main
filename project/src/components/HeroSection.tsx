import React from 'react';
import { Search, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onBrowseProperties: () => void;
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onBrowseProperties, onGetStarted }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Dream Home
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of properties from trusted sellers and agents. Your
            next home is just a search away.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={onBrowseProperties}
              className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Browse Properties</span>
            </button>
            <button
              onClick={onGetStarted}
              className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-orange-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">25+</div>
              <div className="text-blue-200 font-medium">Active Listings</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-blue-200 font-medium">Happy Clients</div>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">5+</div>
              <div className="text-blue-200 font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="rgb(249 250 251)"
          />
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
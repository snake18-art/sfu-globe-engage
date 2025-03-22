
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Calendar, MapPin, ChevronRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Sample clubs data
  const clubsData = [
    {
      id: 1,
      name: "Computing Science Student Society",
      acronym: "CSSS",
      category: "academic",
      members: 120,
      upcoming: "Fall Welcome Social - Oct 25",
      image: "https://picsum.photos/id/237/300/200"
    },
    {
      id: 2,
      name: "Women in Computing Science",
      acronym: "WiCS",
      category: "academic",
      members: 85,
      upcoming: "Career Panel - Oct 30",
      image: "https://picsum.photos/id/91/300/200"
    },
    {
      id: 3,
      name: "Game Development Club",
      acronym: "GameDev",
      category: "hobby",
      members: 65,
      upcoming: "Game Jam - Nov 5-7",
      image: "https://picsum.photos/id/160/300/200"
    },
    {
      id: 4,
      name: "Photography Club",
      acronym: "PhotoSFU",
      category: "hobby",
      members: 72,
      upcoming: "Campus Photo Walk - Oct 28",
      image: "https://picsum.photos/id/96/300/200"
    },
    {
      id: 5,
      name: "Sustainability Club",
      acronym: "SustainSFU",
      category: "community",
      members: 95,
      upcoming: "Tree Planting - Nov 12",
      image: "https://picsum.photos/id/106/300/200"
    },
    {
      id: 6,
      name: "Dance Club",
      acronym: "SFUDance",
      category: "athletic",
      members: 88,
      upcoming: "Dance Workshop - Oct 27",
      image: "https://picsum.photos/id/83/300/200"
    }
  ];

  // Filter clubs based on search term and category
  const filteredClubs = clubsData.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          club.acronym.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || club.category === filter;
    return matchesSearch && matchesFilter;
  });

  // Featured club events
  const featuredEvents = [
    {
      id: 1,
      title: "Hackathon SFU 2023",
      organizer: "CSSS & WiCS",
      date: "November 18-20, 2023",
      location: "AQ 3000",
      description: "48-hour coding challenge with prizes and networking opportunities."
    },
    {
      id: 2,
      title: "Fall Clubs Day",
      organizer: "SFSS",
      date: "October 26, 2023",
      location: "Convocation Mall",
      description: "Explore all clubs at SFU and find the ones that match your interests."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Campus Clubs & Activities</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and join student clubs, attend events, and engage with the SFU community.
            </p>
          </div>

          {/* Search and Filtering */}
          <div className="bg-sfu-lightgray p-4 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sfu-red"
                />
              </div>
              
              <div className="flex gap-2">
                {["all", "academic", "hobby", "athletic", "community"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                      filter === category 
                        ? 'bg-sfu-red text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Events */}
          <div className="mb-10">
            <h2 className="text-2xl font-display font-semibold mb-4">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.map(event => (
                <div key={event.id} className="bg-gradient-to-br from-sfu-red/5 to-sfu-red/10 rounded-xl p-6 hover:shadow-md transition-all duration-300">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-sfu-red font-medium text-sm mb-3">{event.organizer}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  
                  <Button className="w-full bg-sfu-red hover:bg-sfu-red/90 text-white">RSVP to Event</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Clubs List */}
          <h2 className="text-2xl font-display font-semibold mb-4">Browse Clubs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <div key={club.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="h-40 overflow-hidden">
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{club.name}</h3>
                    <span className="pill bg-sfu-lightgray text-xs px-2 py-1 rounded-full">
                      {club.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Users size={16} />
                    <span>{club.members} members</span>
                  </div>
                  
                  {club.upcoming && (
                    <div className="bg-sfu-lightgray p-2 rounded-lg text-xs mb-3">
                      <div className="font-medium mb-1">Upcoming:</div>
                      <div>{club.upcoming}</div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" className="text-xs">Join Club</Button>
                    <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
                      <span>View Profile</span>
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredClubs.length === 0 && (
            <div className="text-center py-12 bg-sfu-lightgray rounded-xl mt-6">
              <p className="text-gray-500">No clubs found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Clubs;

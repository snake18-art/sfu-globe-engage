import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PostCard, PostData } from "@/components/newsfeed/PostCard";
import CreatePostCard from "@/components/newsfeed/CreatePostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Filter, UserPlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample trending topics
const TRENDING_TOPICS = [
  "#FinalsWeek",
  "#CampusEvents", 
  "#StudyTips",
  "#ScholarshipDeadlines",
  "#InternshipOpportunities"
];

// Sample suggested users to follow
const SUGGESTED_USERS = [
  {
    name: "International Student Club",
    username: "int_student_club",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg"
  },
  {
    name: "Career Services",
    username: "career_services",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    name: "Student Health Center",
    username: "health_center",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg"
  }
];

// Sample posts for the newsfeed
const INITIAL_POSTS: PostData[] = [
  {
    id: 1,
    author: {
      name: "University Student Council",
      username: "sfu_council",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    content: "🎉 Important Announcement: Registration for the Annual Student Conference is now open! This year's theme is 'Innovation and Sustainability'. Limited slots available, so sign up early!",
    images: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"],
    timestamp: new Date(Date.now() - 2 * 3600 * 1000),
    likes: 42,
    comments: 8,
    shares: 15,
    isOfficial: true
  },
  {
    id: 2,
    author: {
      name: "Sarah Lee",
      username: "sarah_lee",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    content: "Just finished my final project for Computer Graphics! Here's a sneak peek at what I've been working on for the past month. Feedback appreciated! #ComputerScience #GraphicsDesign",
    images: ["https://images.unsplash.com/photo-1545670723-196ed0954986?q=80&w=1000&auto=format&fit=crop"],
    timestamp: new Date(Date.now() - 5 * 3600 * 1000),
    likes: 35,
    comments: 12,
    shares: 3,
    location: "Computer Science Building"
  },
  {
    id: 3,
    author: {
      name: "CS Study Group",
      username: "cs_study",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    content: "Study session for Algorithm Analysis this Thursday at 6PM in Library Room 302. We'll be covering dynamic programming and graph algorithms. Bring your notes and questions! #StudyGroup #Algorithms",
    timestamp: new Date(Date.now() - 12 * 3600 * 1000),
    likes: 28,
    comments: 6,
    shares: 9,
    event: {
      title: "Algorithm Analysis Study Session",
      date: new Date(Date.now() + 2 * 24 * 3600 * 1000),
      location: "Library Room 302"
    }
  },
  {
    id: 4,
    author: {
      name: "David Chen",
      username: "dave_chen",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    content: "Does anyone have the notes from yesterday's Business Ethics lecture? I had to miss class due to a doctor's appointment. Would really appreciate if someone could share them!",
    timestamp: new Date(Date.now() - 24 * 3600 * 1000),
    likes: 15,
    comments: 23,
    shares: 0
  },
  {
    id: 5,
    author: {
      name: "Campus Library",
      username: "sfu_library",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    content: "The library will be extending its hours during finals week. Starting next Monday, we'll be open from 7AM to 2AM daily. Study rooms can be booked online as usual. Good luck with your exams! 📚",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000),
    likes: 87,
    comments: 5,
    shares: 32,
    isOfficial: true
  },
  {
    id: 6,
    author: {
      name: "Tech Club",
      username: "tech_club",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    content: "Check out our latest tech demo! We've been working on this AR project for the campus tour app. Still in beta, but we'd love your feedback!",
    videos: [
      {
        url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        viewCount: 124
      }
    ],
    timestamp: new Date(Date.now() - 48 * 3600 * 1000),
    likes: 52,
    comments: 18,
    shares: 7
  }
];

const Newsfeed = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS);
  
  // Filter posts based on active filter
  const filteredPosts = posts.filter(post => {
    if (activeFilter === "official") {
      return post.isOfficial;
    } else if (activeFilter === "events") {
      return post.event;
    } else if (activeFilter === "media") {
      return post.images?.length || post.videos?.length;
    }
    return true;
  });

  // Handle creating a new post
  const handleNewPost = (newPost: PostData) => {
    setPosts([newPost, ...posts]);
  };

  // Handle deleting a post
  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <ul className="space-y-3">
                {TRENDING_TOPICS.map((topic, index) => (
                  <li key={index}>
                    <a href="#" className="text-sfu-red hover:underline text-sm">
                      {topic}
                    </a>
                  </li>
                ))}
              </ul>
              
              <hr className="my-6 border-gray-200" />
              
              <h3 className="font-semibold mb-4">Suggested to Follow</h3>
              <ul className="space-y-4">
                {SUGGESTED_USERS.map((suggestedUser, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={suggestedUser.avatar} />
                        <AvatarFallback>
                          {suggestedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{suggestedUser.name}</p>
                        <p className="text-xs text-gray-500">@{suggestedUser.username}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Post creation card */}
            <CreatePostCard onPostCreated={handleNewPost} />
            
            {/* Filters */}
            <div className="mb-6">
              <Tabs defaultValue={activeFilter} onValueChange={setActiveFilter}>
                <TabsList className="w-full bg-white">
                  <TabsTrigger value="all" className="flex-1">All Posts</TabsTrigger>
                  <TabsTrigger value="official" className="flex-1">Official</TabsTrigger>
                  <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
                  <TabsTrigger value="media" className="flex-1">Media</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Feed posts */}
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          </div>
          
          {/* Right sidebar (desktop only) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Upcoming Events</h3>
              
              <div className="space-y-4">
                <div className="border-l-2 border-sfu-red pl-3">
                  <p className="text-xs text-gray-500">Tomorrow, 3:00 PM</p>
                  <p className="font-medium">Graduation Photoshoot</p>
                  <p className="text-sm text-gray-600">Main Campus, Building A</p>
                </div>
                
                <div className="border-l-2 border-blue-500 pl-3">
                  <p className="text-xs text-gray-500">May 15, 9:00 AM</p>
                  <p className="font-medium">Career Fair 2023</p>
                  <p className="text-sm text-gray-600">Student Center</p>
                </div>
                
                <div className="border-l-2 border-green-500 pl-3">
                  <p className="text-xs text-gray-500">May 18, 6:30 PM</p>
                  <p className="font-medium">International Food Festival</p>
                  <p className="text-sm text-gray-600">University Park</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Filter className="h-4 w-4 mr-2" />
                View All Events
              </Button>
              
              <hr className="my-6 border-gray-200" />
              
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-700 hover:text-sfu-red">Academic Calendar</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-sfu-red">Library Resources</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-sfu-red">Course Catalog</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-sfu-red">Student Handbook</a>
                </li>
                <li>
                  <a href="#" className="text-gray-700 hover:text-sfu-red">Campus Map</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Newsfeed;

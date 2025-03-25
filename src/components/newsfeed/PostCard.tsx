
import React, { useState } from "react";
import { MapPin, Calendar, BookmarkPlus, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ReactionBar } from "./ReactionBar";
import { CommentSection } from "./CommentSection";
import { useAuth } from "@/contexts/AuthContext";

interface Comment {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

export interface PostData {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  videos?: {
    url: string;
    viewCount: number;
  }[];
  timestamp: Date;
  likes: number;
  comments: number | Comment[];
  shares: number;
  location?: string;
  event?: {
    title: string;
    date: Date;
    location: string;
  };
  isOfficial?: boolean;
}

interface PostCardProps {
  post: PostData;
  onDelete?: (id: number) => void;
}

export const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const { id, author, content, images, videos, timestamp, likes, comments, shares, location, event, isOfficial } = post;

  // Check if the logged-in user is the post owner
  const isOwner = user?.email?.split('@')[0] === author.username;

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Convert number of comments to empty array for initial state
  const initialComments = Array.isArray(comments) 
    ? comments 
    : [];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Post header */}
        <div className="p-4 flex justify-between items-start">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={author.avatar} />
              <AvatarFallback>
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <p className="font-semibold">{author.name}</p>
                {isOfficial && (
                  <span className="ml-2 bg-sfu-red text-white text-xs px-1.5 py-0.5 rounded-full">
                    Official
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span>@{author.username}</span>
                <span className="mx-1">•</span>
                <span>{format(timestamp, 'MMM d, h:mm a')}</span>
                {location && (
                  <>
                    <span className="mx-1">•</span>
                    <MapPin className="h-3 w-3 mr-0.5" />
                    <span>{location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Post content */}
        <div className="px-4 pb-4">
          <p className="whitespace-pre-line">{content}</p>
        </div>
        
        {/* Post images */}
        {images && images.length > 0 && (
          <div className="w-full">
            <img 
              src={images[0]} 
              alt="Post image" 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Post videos */}
        {videos && videos.length > 0 && (
          <div className="w-full relative">
            <video 
              src={videos[0].url}
              controls
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {videos[0].viewCount} views
            </div>
          </div>
        )}
        
        {/* Event details */}
        {event && (
          <div className="m-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-sfu-red" />
              <h4 className="font-medium">{event.title}</h4>
            </div>
            <div className="mt-2 text-sm text-gray-600 ml-7">
              <p>{format(event.date, 'EEEE, MMMM d, yyyy • h:mm a')}</p>
              <p className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {event.location}
              </p>
            </div>
          </div>
        )}
        
        {/* Reaction bar */}
        <ReactionBar 
          postId={id}
          initialLikes={likes}
          initialComments={typeof comments === 'number' ? comments : comments.length}
          initialShares={shares}
          isOwner={isOwner}
          onDelete={handleDeletePost}
          onToggleComments={() => setShowComments(!showComments)}
        />
        
        {/* Comments section (only show when toggled) */}
        {showComments && (
          <CommentSection 
            postId={id} 
            initialComments={initialComments}
          />
        )}
      </CardContent>
    </Card>
  );
};

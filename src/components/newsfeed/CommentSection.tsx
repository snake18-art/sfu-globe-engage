import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

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

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export const CommentSection = ({ postId, initialComments = [] }: CommentSectionProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");

  const handlePostComment = () => {
    if (!newComment.trim() || !user) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: {
        name: user.name || "User",
        username: user.email?.split("@")[0] || "user",
        avatar: user.profilePic || "",
      },
      content: newComment,
      timestamp: new Date()
    };
    
    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <div className="px-4 pt-2 pb-4 border-t">
      {/* Existing comments */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <p className="font-medium text-sm">{comment.author.name}</p>
                <p className="text-sm">{comment.content}</p>
              </div>
              <div className="flex gap-3 mt-1 text-xs text-gray-500">
                <span>{format(comment.timestamp, 'MMM d, h:mm a')}</span>
                <button className="hover:text-gray-700">Like</button>
                <button className="hover:text-gray-700">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add new comment */}
      <div className="flex gap-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profilePic} />
          <AvatarFallback className="bg-sfu-red text-white">
            {user ? user.name.charAt(0) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2 bg-gray-100 rounded-full px-3 py-1">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-transparent text-sm border-none focus:outline-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handlePostComment();
              }
            }}
          />
          <Button 
            size="sm" 
            variant="ghost"
            className="h-7 w-7 p-0 rounded-full" 
            onClick={handlePostComment}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

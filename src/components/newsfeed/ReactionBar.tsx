
import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, BookmarkPlus, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type Reaction = "none" | "smile" | "haha" | "wow" | "sad" | "angry";

interface ReactionBarProps {
  postId: number;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
  userReaction?: Reaction;
  isOwner?: boolean;
  onDelete?: () => void;
  onToggleComments: () => void;
}

export const ReactionBar = ({
  postId,
  initialLikes,
  initialComments,
  initialShares,
  userReaction = "none",
  isOwner = false,
  onDelete,
  onToggleComments
}: ReactionBarProps) => {
  const [reaction, setReaction] = useState<Reaction>(userReaction);
  const [likes, setLikes] = useState(initialLikes);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { toast } = useToast();

  // Reaction emojis
  const reactionEmojis = {
    none: "👍",
    smile: "🙂",
    haha: "😂",
    wow: "😮",
    sad: "😢",
    angry: "😡"
  };

  const handleReactionClick = (newReaction: Reaction) => {
    if (reaction === newReaction) {
      // Remove reaction
      setReaction("none");
      if (reaction !== "none") {
        setLikes(likes - 1);
      }
    } else {
      // Add or change reaction
      if (reaction === "none") {
        setLikes(likes + 1);
      }
      setReaction(newReaction);
    }
    setShowReactionPicker(false);
  };

  const handleShareClick = () => {
    setShowShareDialog(true);
  };

  const handleSavePost = () => {
    toast({
      title: "Post saved",
      description: "This post has been saved to your collections."
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/post/${postId}`);
    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard."
    });
    setShowShareDialog(false);
  };

  const handleSendToFriend = () => {
    toast({
      title: "Send to friend",
      description: "Feature coming soon."
    });
    setShowShareDialog(false);
  };

  const handleDeletePost = () => {
    if (onDelete) {
      onDelete();
    }
    toast({
      title: "Post deleted",
      description: "Your post has been deleted."
    });
  };

  return (
    <>
      {/* Post stats */}
      <div className="px-4 py-2 border-t border-b flex justify-between text-xs text-gray-500">
        <span>{likes} {reaction !== "none" ? reactionEmojis[reaction] : "likes"}</span>
        <div>
          <span>{initialComments} comments</span>
          <span className="mx-1">•</span>
          <span>{initialShares} shares</span>
        </div>
      </div>
      
      {/* Post actions */}
      <div className="grid grid-cols-3 divide-x">
        <div className="relative">
          <Button
            variant="ghost" 
            className={`rounded-none py-2 h-auto w-full ${reaction !== "none" ? "text-sfu-red" : ""}`}
            onMouseEnter={() => setShowReactionPicker(true)}
            onClick={() => handleReactionClick(reaction === "none" ? "smile" : "none")}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {reaction === "none" ? "Like" : reactionEmojis[reaction]}
          </Button>
          
          {/* Reaction picker */}
          {showReactionPicker && (
            <div 
              className="absolute bottom-full left-0 bg-white rounded-lg shadow-lg p-2 flex gap-2 mb-2 z-10"
              onMouseLeave={() => setShowReactionPicker(false)}
            >
              <button onClick={() => handleReactionClick("smile")} className="text-xl hover:scale-125 transition">🙂</button>
              <button onClick={() => handleReactionClick("haha")} className="text-xl hover:scale-125 transition">😂</button>
              <button onClick={() => handleReactionClick("wow")} className="text-xl hover:scale-125 transition">😮</button>
              <button onClick={() => handleReactionClick("sad")} className="text-xl hover:scale-125 transition">😢</button>
              <button onClick={() => handleReactionClick("angry")} className="text-xl hover:scale-125 transition">😡</button>
            </div>
          )}
        </div>
        <Button variant="ghost" className="rounded-none py-2 h-auto" onClick={onToggleComments}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Comment
        </Button>
        <Button variant="ghost" className="rounded-none py-2 h-auto" onClick={handleShareClick}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
      
      {/* Post options dropdown (only for post owner) */}
      {isOwner && (
        <div className="px-4 py-2 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-auto flex">
                <MoreHorizontal className="h-4 w-4 mr-1" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSavePost}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Save Post
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeletePost} className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Share dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={handleSendToFriend} className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Send to a friend
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Copy link
            </Button>
            <Button onClick={handleSavePost} variant="outline" className="w-full justify-start">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save post
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

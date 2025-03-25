
import React, { useState, useRef } from "react";
import { Image, Video, MapPin, Calendar, Send, X } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CreatePostCardProps {
  onPostCreated: (post: any) => void;
}

export const CreatePostCard = ({ onPostCreated }: CreatePostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [postText, setPostText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<{ type: 'image' | 'video', url: string }[]>([]);
  const [location, setLocation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Create object URLs for previews
      const newPreviews = newFiles.map(file => {
        const isVideo = file.type.startsWith('video/');
        return {
          type: isVideo ? 'video' as const : 'image' as const,
          url: URL.createObjectURL(file)
        };
      });
      
      setMediaFiles([...mediaFiles, ...newFiles]);
      setMediaPreviews([...mediaPreviews, ...newPreviews]);
    }
  };
  
  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index].url);
    
    const updatedFiles = [...mediaFiles];
    updatedFiles.splice(index, 1);
    
    const updatedPreviews = [...mediaPreviews];
    updatedPreviews.splice(index, 1);
    
    setMediaFiles(updatedFiles);
    setMediaPreviews(updatedPreviews);
  };
  
  const handlePostSubmit = () => {
    if (!postText.trim() && mediaFiles.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some text or media to your post.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new post object
    const newPost = {
      id: Date.now(),
      author: {
        name: user?.name || "User",
        username: user?.email?.split('@')[0] || "user",
        avatar: user?.profilePic || "",
      },
      content: postText,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      location: location || undefined,
    };
    
    // Add image URLs if there are any
    if (mediaFiles.some(file => file.type.startsWith('image/'))) {
      newPost.images = mediaPreviews
        .filter(preview => preview.type === 'image')
        .map(preview => preview.url);
    }
    
    // Add video URLs if there are any
    if (mediaFiles.some(file => file.type.startsWith('video/'))) {
      newPost.videos = mediaPreviews
        .filter(preview => preview.type === 'video')
        .map(preview => ({
          url: preview.url,
          viewCount: 0
        }));
    }
    
    // Call parent function to add the post
    onPostCreated(newPost);
    
    // Reset form
    setPostText("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setLocation("");
    
    toast({
      title: "Post created",
      description: "Your post was published successfully."
    });
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback className="bg-sfu-red text-white">
              {user ? user.name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea 
              placeholder="What's on your mind?"
              className="w-full resize-none border-none focus-visible:ring-0 p-0"
              rows={3}
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </div>
        </div>
        
        {/* Location input */}
        {location && (
          <div className="mt-2 ml-14 flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{location}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 ml-1" 
              onClick={() => setLocation("")}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {/* Media previews */}
        {mediaPreviews.length > 0 && (
          <div className="mt-4 ml-14 grid grid-cols-2 gap-2">
            {mediaPreviews.map((preview, index) => (
              <div key={index} className="relative rounded-md overflow-hidden">
                {preview.type === 'image' ? (
                  <img 
                    src={preview.url} 
                    alt={`Upload preview ${index}`} 
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <video 
                    src={preview.url} 
                    className="w-full h-40 object-cover" 
                    controls
                  />
                )}
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-80 hover:opacity-100" 
                  onClick={() => removeMedia(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*,video/*" 
          multiple
          onChange={handleFileChange}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image className="h-4 w-4 mr-1" /> Photo
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <Video className="h-4 w-4 mr-1" /> Video
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => setLocation("University Campus")}
          >
            <MapPin className="h-4 w-4 mr-1" /> Location
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
          >
            <Calendar className="h-4 w-4 mr-1" /> Event
          </Button>
        </div>
        <Button 
          className="bg-sfu-red hover:bg-sfu-red/90"
          disabled={!postText.trim() && mediaFiles.length === 0}
          onClick={handlePostSubmit}
        >
          <Send className="h-4 w-4 mr-2" /> Post
        </Button>
      </CardFooter>
    </Card>
  );
};

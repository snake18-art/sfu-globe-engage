
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Image, Video, MapPin, Smile, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface MediaPreview {
  url: string;
  type: "image" | "video";
  file: File;
}

// Updated post type to include images and videos arrays
interface Post {
  id: number;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: any[];
  shares: number;
  location: string;
  images?: string[];
  videos?: {url: string, views: number}[];
}

interface CreatePostCardProps {
  onPostCreated: (post: Post) => void;
}

const CreatePostCard: React.FC<CreatePostCardProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleLocationAdd = () => {
    // This would typically use browser geolocation or let user select
    setLocation("San Francisco, CA");
    toast({
      title: "Location added",
      description: "San Francisco, CA has been added to your post",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newMediaPreviews: MediaPreview[] = [];
    
    Array.from(files).forEach(file => {
      const objectUrl = URL.createObjectURL(file);
      newMediaPreviews.push({
        url: objectUrl,
        type,
        file
      });
    });
    
    setMediaFiles(prev => [...prev, ...newMediaPreviews]);
    e.target.value = ''; // Reset the input
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updatedMedia = [...prev];
      // Release object URL to avoid memory leaks
      URL.revokeObjectURL(updatedMedia[index].url);
      updatedMedia.splice(index, 1);
      return updatedMedia;
    });
  };

  const handleSubmit = async () => {
    if (!postText.trim() && mediaFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please add some text or media to your post.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, would upload media to storage and get URLs
      // Simulating a server call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create post object with images and videos arrays
      const newPost: Post = {
        id: Date.now(),
        author: {
          name: user?.name || "Anonymous User",
          username: user?.email?.split('@')[0] || "anonymous",
          avatar: user?.profilePic || "/placeholder.svg",
        },
        content: postText,
        timestamp: new Date(),
        likes: 0,
        comments: [],
        shares: 0,
        location,
        images: mediaFiles.filter(m => m.type === "image").map(m => m.url),
        videos: mediaFiles.filter(m => m.type === "video").map(m => ({
          url: m.url,
          views: 0
        }))
      };
      
      onPostCreated(newPost);
      
      // Reset form
      setPostText("");
      setLocation("");
      setMediaFiles([]);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <img 
              src={user?.profilePic || "/placeholder.svg"} 
              alt={user?.name || "User"} 
              className="h-full w-full object-cover" 
            />
          </Avatar>
          <div className="flex-1">
            <Input
              className="border-none bg-gray-100 focus-visible:ring-0 rounded-full px-4 h-12"
              placeholder="What's on your mind?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            {location && (
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" /> 
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {mediaFiles.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {mediaFiles.map((media, index) => (
              <div key={index} className="relative rounded-md overflow-hidden bg-gray-100">
                {media.type === "image" ? (
                  <img 
                    src={media.url} 
                    alt={`Upload ${index}`} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video 
                    src={media.url} 
                    className="w-full h-48 object-cover" 
                    controls
                  />
                )}
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => removeMedia(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              className="text-gray-600" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-5 w-5 mr-2" />
              Photo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />

            <Button 
              variant="ghost" 
              className="text-gray-600" 
              size="sm"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="h-5 w-5 mr-2" />
              Video
            </Button>
            <input
              type="file"
              ref={videoInputRef}
              className="hidden"
              multiple
              accept="video/*"
              onChange={(e) => handleFileChange(e, "video")}
            />

            <Button 
              variant="ghost" 
              className="text-gray-600" 
              size="sm"
              onClick={handleLocationAdd}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Location
            </Button>

            <Button 
              variant="ghost" 
              className="text-gray-600" 
              size="sm"
            >
              <Smile className="h-5 w-5 mr-2" />
              Feeling
            </Button>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="bg-sfu-red hover:bg-sfu-red/90"
            disabled={isLoading}
          >
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePostCard;

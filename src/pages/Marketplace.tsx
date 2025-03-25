import React, { useState, useEffect } from "react";
import { Filter, Search, ShoppingBag, Tag, ArrowUpDown, Grid, List, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostItemForm from "@/components/marketplace/PostItemForm";
import ItemDetailSheet from "@/components/marketplace/ItemDetailSheet";
import OrdersManager from "@/components/marketplace/OrdersManager";
import type { MarketplaceItem } from "@/components/marketplace/ItemDetailSheet";

const Marketplace = () => {
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  
  const fetchItems = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("marketplace_items")
        .select("*")
        .eq("status", "available");
        
      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }
      
      if (sortBy === "price-low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("posted_at", { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const itemsWithSellerInfo = await Promise.all(
        (data || []).map(async (item) => {
          const { data: sellerData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", item.seller_id)
            .single();
            
          return {
            ...item,
            seller: {
              name: sellerData?.full_name || "Unknown Seller"
            }
          };
        })
      );
      
      setItems(itemsWithSellerInfo);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredItems = items.filter(item => {
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  useEffect(() => {
    fetchItems();
  }, [selectedCategory, sortBy]);
  
  useEffect(() => {
    const handleOpenDetail = (event: CustomEvent) => {
      setSelectedItem(event.detail);
      setDetailSheetOpen(true);
    };
    
    window.addEventListener('openItemDetail', handleOpenDetail as EventListener);
    
    const handleCloseSheet = () => {
      document.querySelectorAll('[data-state="open"]').forEach((el) => {
        if (el.id.includes('radix-')) {
          const closeButton = el.querySelector('button[type="button"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        }
      });
    };
    
    document.addEventListener('closeSheet', handleCloseSheet);
    
    return () => {
      window.removeEventListener('openItemDetail', handleOpenDetail as EventListener);
      document.removeEventListener('closeSheet', handleCloseSheet);
    };
  }, []);
  
  const openItemDetail = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setDetailSheetOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold">Marketplace</h1>
                <p className="text-gray-500">Buy and sell items with fellow students</p>
              </div>
              
              <div className="flex gap-2">
                {isAuthenticated && <OrdersManager />}
                <PostItemForm />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search items..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px]">
                    <Tag className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Notes">Notes</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <ArrowUpDown className="mr-2 h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="hidden md:flex">
                <Tabs defaultValue={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
                  <TabsList>
                    <TabsTrigger value="grid">
                      <Grid className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4 animate-pulse" />
                <h3 className="font-medium text-gray-800 mb-2">Loading items...</h3>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="font-medium text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}`}>
                {filteredItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden transition-all hover:shadow-md ${viewMode === "list" ? "flex flex-col md:flex-row" : ""}`}
                  >
                    <div 
                      className={`${viewMode === "list" ? "md:w-1/3" : "w-full"} h-48 bg-cover bg-center`}
                      style={{ backgroundImage: `url(${item.image_url || "https://images.unsplash.com/photo-1579251929932-250ab69fee7c"})` }}
                    />
                    <CardContent className={`p-4 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                        <span className="font-bold text-sfu-red">${item.price.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {item.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{item.seller?.name || "Unknown Seller"}</span>
                        <span>{formatTimeAgo(item.posted_at)}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => openItemDetail(item)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <ItemDetailSheet 
        item={selectedItem}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
      
      <Footer />
    </div>
  );
};

const formatTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? `${interval} minute ago` : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
};

export default Marketplace;

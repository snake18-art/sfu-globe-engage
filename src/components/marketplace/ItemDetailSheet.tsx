
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, User, Tag, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import OrderRequestForm from "./OrderRequestForm";

export type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_url: string | null;
  seller_id: string;
  posted_at: string;
  status: string;
  seller?: {
    name?: string;
    studentId?: string;
    email?: string;
    avatar_url?: string;
  };
};

interface ItemDetailSheetProps {
  item: MarketplaceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ItemDetailSheet({ item, open, onOpenChange }: ItemDetailSheetProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [relatedItems, setRelatedItems] = useState<MarketplaceItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState<boolean>(false);
  
  const fetchSellerInfo = async (sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, student_id, avatar_url")
        .eq("id", sellerId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        item!.seller = {
          name: data.full_name || undefined,
          studentId: data.student_id || undefined,
          avatar_url: data.avatar_url || undefined,
        };
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };
  
  const fetchRelatedItems = async () => {
    if (!item) return;
    
    try {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .eq("category", item.category)
        .neq("id", item.id)
        .eq("status", "available")
        .limit(3);
        
      if (error) throw error;
      setRelatedItems(data || []);
    } catch (error) {
      console.error("Error fetching related items:", error);
    }
  };
  
  useEffect(() => {
    if (item && open) {
      fetchSellerInfo(item.seller_id);
      fetchRelatedItems();
    }
    
    if (!open) {
      setShowOrderForm(false);
    }
  }, [item, open]);
  
  if (!item) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const isOwnItem = user?.id === item.seller_id;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{item.title}</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          {/* Item Image */}
          {item.image_url && (
            <div className="w-full h-56 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* Price & Category */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{item.category}</span>
            </div>
            <span className="text-lg font-bold text-sfu-red">${item.price.toFixed(2)}</span>
          </div>
          
          {/* Item Details */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{item.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Condition</h3>
              <p className="text-sm text-gray-600">{item.condition}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Posted</h3>
              <p className="text-sm text-gray-600">{formatDate(item.posted_at)}</p>
            </div>
          </div>
          
          {/* Seller Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {item.seller?.avatar_url ? (
                  <img src={item.seller.avatar_url} alt="Seller" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.seller?.name || 'Seller'}</p>
                {item.seller?.studentId && (
                  <p className="text-xs text-gray-500">Student ID: {item.seller.studentId}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Contact/Order Actions */}
          {!showOrderForm ? (
            <div className="space-y-3 pt-4">
              {isAuthenticated && !isOwnItem && (
                <Button 
                  className="w-full" 
                  onClick={() => setShowOrderForm(true)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Request to Purchase
                </Button>
              )}
              
              {!isAuthenticated && (
                <div className="text-sm text-center text-gray-500 p-3 bg-gray-50 rounded-md">
                  Please log in to request this item
                </div>
              )}
              
              {isOwnItem && (
                <div className="text-sm text-center text-gray-500 p-3 bg-gray-50 rounded-md">
                  This is your listing
                </div>
              )}
            </div>
          ) : (
            <OrderRequestForm 
              item={item} 
              onCancel={() => setShowOrderForm(false)}
              onSuccess={() => {
                setShowOrderForm(false);
                onOpenChange(false);
              }}
            />
          )}
          
          {/* Related Items */}
          {relatedItems.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Related Items</h3>
              <div className="space-y-3">
                {relatedItems.map((relatedItem) => (
                  <div 
                    key={relatedItem.id} 
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      onOpenChange(false);
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('openItemDetail', { detail: relatedItem }));
                      }, 300);
                    }}
                  >
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {relatedItem.image_url ? (
                        <img 
                          src={relatedItem.image_url} 
                          alt={relatedItem.title} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{relatedItem.title}</p>
                      <p className="text-sm text-gray-500">${relatedItem.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

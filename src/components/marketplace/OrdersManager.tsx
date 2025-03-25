
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, ShoppingBag, User, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { MarketplaceItem } from "./ItemDetailSheet";

type Order = {
  id: string;
  item_id: string;
  buyer_id: string;
  seller_id: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  item?: MarketplaceItem;
  buyer?: {
    name?: string;
    studentId?: string;
    email?: string;
    avatar_url?: string;
  };
  seller?: {
    name?: string;
    studentId?: string;
    email?: string;
    avatar_url?: string;
  };
};

type Message = {
  id: string;
  order_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

export default function OrdersManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  
  // Fetch orders
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      const query = supabase
        .from("marketplace_orders")
        .select(`
          *,
          item:item_id(*)
        `)
        .order("updated_at", { ascending: false });
      
      // Filter by buyer or seller based on active tab
      const { data, error } = await (activeTab === "buying" 
        ? query.eq("buyer_id", user.id)
        : query.eq("seller_id", user.id));
      
      if (error) throw error;
      
      // Process order data
      const processedOrders: Order[] = data.map((order: any) => ({
        ...order,
        item: order.item
      }));
      
      // Fetch user info for each order
      for (const order of processedOrders) {
        // Fetch buyer info if we're selling
        if (activeTab === "selling") {
          const { data: buyerData } = await supabase
            .from("profiles")
            .select("full_name, student_id, avatar_url")
            .eq("id", order.buyer_id)
            .single();
            
          if (buyerData) {
            order.buyer = {
              name: buyerData.full_name || undefined,
              studentId: buyerData.student_id || undefined,
              avatar_url: buyerData.avatar_url || undefined
            };
          }
        }
        
        // Fetch seller info if we're buying
        if (activeTab === "buying") {
          const { data: sellerData } = await supabase
            .from("profiles")
            .select("full_name, student_id, avatar_url")
            .eq("id", order.seller_id)
            .single();
            
          if (sellerData) {
            order.seller = {
              name: sellerData.full_name || undefined,
              studentId: sellerData.student_id || undefined,
              avatar_url: sellerData.avatar_url || undefined
            };
          }
        }
      }
      
      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  // Fetch messages for an order
  const fetchMessages = async (orderId: string) => {
    setLoadingMessages(true);
    
    try {
      const { data, error } = await supabase
        .from("marketplace_messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(
          msg => !msg.read && msg.sender_id !== user?.id
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from("marketplace_messages")
            .update({ read: true })
            .in("id", unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };
  
  // Send a new message
  const sendMessage = async () => {
    if (!user || !selectedOrder || !newMessage.trim()) return;
    
    setSendingMessage(true);
    
    try {
      const { error } = await supabase
        .from("marketplace_messages")
        .insert({
          order_id: selectedOrder.id,
          sender_id: user.id,
          content: newMessage.trim()
        });
        
      if (error) throw error;
      
      // Update the order's updated_at timestamp
      await supabase
        .from("marketplace_orders")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedOrder.id);
        
      // Refresh messages
      fetchMessages(selectedOrder.id);
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (status: string) => {
    if (!selectedOrder) return;
    
    setUpdatingOrder(true);
    
    try {
      const { error } = await supabase
        .from("marketplace_orders")
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedOrder.id);
        
      if (error) throw error;
      
      // If completing the order, update the item status
      if (status === "completed") {
        await supabase
          .from("marketplace_items")
          .update({ status: "sold" })
          .eq("id", selectedOrder.item_id);
      }
      
      // Refresh the selected order
      setSelectedOrder({
        ...selectedOrder,
        status
      });
      
      // Refresh the orders list
      fetchOrders();
      
      toast({
        title: "Order updated",
        description: `Order status updated to ${status}`
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setUpdatingOrder(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, activeTab]);
  
  useEffect(() => {
    if (selectedOrder) {
      fetchMessages(selectedOrder.id);
    }
  }, [selectedOrder]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Accepted</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          My Orders
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>My Marketplace Orders</SheetTitle>
          </SheetHeader>
          
          <Tabs 
            defaultValue="buying" 
            className="flex-1 flex flex-col"
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "buying" | "selling");
              setSelectedOrder(null);
            }}
          >
            <div className="flex border-b">
              <TabsList className="h-12 w-full rounded-none bg-transparent border-b">
                <TabsTrigger value="buying" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Items I'm Buying
                </TabsTrigger>
                <TabsTrigger value="selling" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                  Items I'm Selling
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {!selectedOrder ? (
                /* Order List */
                <div className="w-full overflow-y-auto p-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="font-medium text-gray-800 mb-1">No orders found</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">
                        {activeTab === "buying" 
                          ? "You haven't requested any items yet."
                          : "You don't have any incoming order requests."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-0" onClick={() => setSelectedOrder(order)}>
                            <div className="flex items-center p-4">
                              <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                                {order.item?.image_url ? (
                                  <img 
                                    src={order.item.image_url} 
                                    alt={order.item.title} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {order.item?.title}
                                  </p>
                                  <div className="ml-2 flex-shrink-0">
                                    {getStatusBadge(order.status)}
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span className="truncate">
                                    {activeTab === "buying" 
                                      ? `Seller: ${order.seller?.name || 'Unknown'}`
                                      : `Buyer: ${order.buyer?.name || 'Unknown'}`}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
                                  <span>${order.item?.price.toFixed(2)}</span>
                                  <span>{formatDate(order.updated_at)}</span>
                                </div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Order Detail */
                <div className="flex flex-col w-full h-full">
                  <div className="p-4 border-b flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedOrder(null)}
                      className="p-0 h-8"
                    >
                      <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                      <span>Back</span>
                    </Button>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  
                  <div className="p-4 border-b">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden mr-3">
                        {selectedOrder.item?.image_url ? (
                          <img 
                            src={selectedOrder.item.image_url} 
                            alt={selectedOrder.item.title} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ShoppingBag className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{selectedOrder.item?.title}</h3>
                        <p className="text-sm text-gray-500">${selectedOrder.item?.price.toFixed(2)} · {selectedOrder.item?.condition}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500">
                          {activeTab === "buying" ? "Seller" : "Buyer"}:
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-1">
                            {(activeTab === "buying" ? selectedOrder.seller?.avatar_url : selectedOrder.buyer?.avatar_url) ? (
                              <img 
                                src={activeTab === "buying" ? selectedOrder.seller?.avatar_url : selectedOrder.buyer?.avatar_url} 
                                alt="User" 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <User className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                          <span>
                            {activeTab === "buying" 
                              ? selectedOrder.seller?.name || 'Unknown'
                              : selectedOrder.buyer?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500">Order Date:</p>
                        <p>{formatDate(selectedOrder.created_at)}</p>
                      </div>
                    </div>
                    
                    {/* Seller Actions */}
                    {activeTab === "selling" && selectedOrder.status === "pending" && (
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus("rejected")}
                          disabled={updatingOrder}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Decline
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus("accepted")}
                          disabled={updatingOrder}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    )}
                    
                    {/* Complete Order */}
                    {activeTab === "selling" && selectedOrder.status === "accepted" && (
                      <div className="mt-4">
                        <Button 
                          size="sm"
                          className="w-full"
                          onClick={() => updateOrderStatus("completed")}
                          disabled={updatingOrder}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark as Completed
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4">
                      {loadingMessages ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">Loading messages...</p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                          <p className="text-sm text-gray-500">No messages yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                    isOwnMessage 
                                      ? 'bg-blue-50 text-blue-900' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                  <p className="text-xs mt-1 opacity-70">{formatDate(message.created_at)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Input */}
                    {selectedOrder.status !== "rejected" && selectedOrder.status !== "completed" && (
                      <div className="p-3 border-t bg-gray-50">
                        <div className="flex space-x-2">
                          <Textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="min-h-[80px] bg-white"
                          />
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            disabled={!newMessage.trim() || sendingMessage}
                            onClick={sendMessage}
                          >
                            {sendingMessage ? "Sending..." : "Send"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

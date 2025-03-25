
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { MarketplaceItem } from "./ItemDetailSheet";

interface OrderRequestFormProps {
  item: MarketplaceItem;
  onCancel: () => void;
  onSuccess: () => void;
}

type FormValues = {
  message: string;
};

export default function OrderRequestForm({ item, onCancel, onSuccess }: OrderRequestFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      message: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Create order request
      const { data: order, error } = await supabase
        .from("marketplace_orders")
        .insert({
          item_id: item.id,
          buyer_id: user.id,
          seller_id: item.seller_id,
          message: data.message,
          status: "pending"
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add first message to conversation
      if (data.message.trim()) {
        const { error: messageError } = await supabase
          .from("marketplace_messages")
          .insert({
            order_id: order.id,
            sender_id: user.id,
            content: data.message,
          });
          
        if (messageError) console.error("Error saving message:", messageError);
      }
      
      toast({
        title: "Request sent",
        description: "Your purchase request has been sent to the seller",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error sending request",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-orange-50 text-orange-800 p-3 rounded-md text-sm">
          Send a message to the seller with your request. The seller will be able to contact you about this item.
        </div>
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message to Seller</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Introduce yourself and explain why you're interested in this item..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

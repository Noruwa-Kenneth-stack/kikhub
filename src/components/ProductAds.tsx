import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { getAppSettings } from "@/utils/appSettings";

const settings = getAppSettings();
const formSchema = z.object({
  image: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  price: z.string().optional(),
  offer: z.string().optional(),
  hotkey: z.string().optional(),
  city: z.string().optional(),
});

export default function ProductAds() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      title: "",
      subtitle: "",
      price: "",
      offer: "",
      hotkey: "",
      city: settings?.defaultCity ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Submitting form value:", form.getValues());
      const response = await fetch("/api/product-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: values.image || null,
          title: values.title,
          subtitle: values.subtitle || null,
          price: values.price || null,
          offer: values.offer || null,
          hotkey: values.hotkey || null,
          city: values.city || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product ad");
      }

      toast({
        title: "Success",
        description: "Product ad created successfully",
         style: {
          background: "green",
          color: "white",
        },
      });

      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create product ad",
        variant: "destructive",
      });
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Basic Information
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ad title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subtitle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Pricing & Offers
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="₦0.00"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const raw = e.target.value;

                              // Remove everything except digits and dot
                              let cleaned = raw.replace(/[^0-9.]/g, "");

                              // Only allow one decimal
                              cleaned = cleaned.replace(/(\..*)\./g, "$1");

                              if (cleaned === "") {
                                field.onChange("");
                                return;
                              }

                              // Store with ₦ prefix
                              field.onChange(`₦${cleaned}`);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="offer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 20% off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hotkey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotkey</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter hotkey" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Media
                </h2>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Product Ad..." : "Add Product Ad"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}

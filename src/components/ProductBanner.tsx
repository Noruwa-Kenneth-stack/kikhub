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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { getAppSettings } from "@/utils/appSettings";

const settings = getAppSettings();
// ---------------- Zod Schema ----------------
const formSchema = z.object({
  product_id: z
    .number({ message: "Product ID must be a number" })
    .min(1, "Product ID is required"),
  title: z.string().min(1, "Title is required"),
  headlines: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  city: z.string().optional(),
});

export default function ProductBanners() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: undefined,
      title: "",
      headlines: "",
      subtitle: "",
      image: "",
      city: settings?.defaultCity ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/product-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to create product banner");

      toast({
        title: "Success",
        description: "Product banner created successfully",
        variant: "success",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          (error as Error).message || "Failed to create product banner",
        variant: "destructive",
      });
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SidebarProvider>
      <div className="container mx-auto px-6 py-8">
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Basic Information
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="product_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product ID</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              placeholder="1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter banner title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="headlines"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Headlines</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter headlines" {...field} />
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

                {/* Content */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Content
                  </h2>
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter subtitle"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Media */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Media
                  </h2>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="imagebanner.jpg" {...field} />
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
                  {isSubmitting ? "Adding Banner..." : "Add Product Banner"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </SidebarProvider>
  );
}

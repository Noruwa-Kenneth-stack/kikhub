"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";
import { OpeningHoursField } from "@/components/OpeningHoursField";
import { getAppSettings } from "@/utils/appSettings";

const settings = getAppSettings();

const categories = [
  "Groceries",
  "Electronics",
  "Fashion",
  "Pharmacy",
  "General Merchandise",
];

const formSchema = z.object({
  store_name: z.string().min(1, "Store name is required"),
  image_url: z.string().optional().or(z.literal("")),
  status: z.string().optional(),
  featured: z.boolean(),
  logo: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable()
    .optional(),
  opening_hours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const StoreSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      store_name: "",
      image_url: "",
      status: "",
      featured: false,
      logo: "",
      city: settings?.defaultCity ?? "",
      address: "",
      categories: [],
      location: null,
      opening_hours: [],
    },
  });

  // save forms when reload
  const watchForm = form.watch;
  useEffect(() => {
    const saved = localStorage.getItem("store-form");
    if (saved) {
      form.reset(JSON.parse(saved));
    }
  }, [form]);

  useEffect(() => {
    const subscription = watchForm((value) => {
      localStorage.setItem("store-form", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watchForm]);
  // save forms when  reload

 const onSubmit = async (values: FormValues) => {
  setIsSubmitting(true);
  try {
    // Convert opening_hours objects → single text block
    const openingHoursText = values.opening_hours
      .map(h => `${h.day}: ${h.open} – ${h.close}`)
      .join("\n");

    // Convert location to POINT
    const pointValue = values.location
      ? `POINT(${values.location.lng} ${values.location.lat})`
      : null;

    const payload = {
      ...values,
      location: pointValue,
      opening_hours: openingHoursText,
    };

    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add store");

    toast({
      title: "Success!",
      description: "Store has been added successfully.",
      variant: "success",
    });

    form.reset();

  } catch (error) {
    toast({
      title: "Error",
      description: (error as Error).message,
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="flex min-h-screen w-full bg-muted/30 overflow-y-auto">
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <Card className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Basic Information
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="store_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter store name"
                              {...field}
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 'until Tuesday'"
                              {...field}
                              value={field.value as string}
                            />
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
                            <Input
                              placeholder="Enter city"
                              {...field}
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Store</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Mark as featured
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Location Details
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter full address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Location (Lat & Lng)</FormLabel>

                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              type="number"
                              placeholder="Latitude"
                              value={field.value?.lat ?? ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  lat: Number(e.target.value),
                                })
                              }
                            />

                            <Input
                              type="number"
                              placeholder="Longitude"
                              value={field.value?.lng ?? ""}
                              onChange={(e) =>
                                field.onChange({
                                  ...field.value,
                                  lng: Number(e.target.value),
                                })
                              }
                            />
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Media */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Media
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Image </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="image.jpg"
                              {...field}
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="logo.png"
                              {...field}
                              value={field.value as string}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Categories
                  </h2>
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Categories</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {categories.map((category) => (
                            <label
                              key={category}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={field.value?.includes(category)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...(field.value || []), category]
                                    : (field.value || []).filter(
                                        (v) => v !== category
                                      );
                                  field.onChange(newValue);
                                }}
                                className="rounded border-border accent-blue-500"
                              />
                              <span className="text-sm">{category}</span>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Opening Hours */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Opening Hours
                    </h2>
                  </div>
                  <FormField
                    control={form.control}
                    name="opening_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <OpeningHoursField
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Buttons */}
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
                    {isSubmitting ? "Adding Store..." : "Add Store"}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoreSection;

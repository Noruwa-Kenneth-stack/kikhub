import { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { User, Globe, Database } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import StoreTable from "@/components/StoreTable";
import FlyerProductsTable from "@/components/FlyerProductTable";
import StoreAdsTable from "@/components/StoreAdsTable";
import ProductAdsTable from "@/components/ProductAdsTable";
import ProductBannerTable from "@/components/ProductBannerTable";
import ItemListTable from "./ItemListTable";
import { eventBus } from "@/utils/eventBus";
import { useTheme } from "next-themes";
import { useAutoSave } from "@/hooks/useAutoSave"; // adjust path if needed

const generalSettingsSchema = z.object({
  defaultCity: z.string().optional(),
  itemsPerPage: z.string().min(1, "Items per page is required"),
  defaultTab: z.string(),
  enableNotifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
  imageOptimization: z.boolean(),
  autosaveInterval: z.number().min(10).max(600).optional(),
  enableAutoRefresh: z.boolean(),
  refreshInterval: z.number().optional(),
});

const profileSettingsSchema = z
  .object({
    userName: z.string().min(1, "Username is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),

    confirmPassword: z.string().optional().or(z.literal("")),

    role: z.enum(["admin", "editor", "viewer"]).optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type GeneralSettings = z.infer<typeof generalSettingsSchema>;
type ProfileSettings = z.infer<typeof profileSettingsSchema>;

export default function Edit() {
  const [isSaving, setIsSaving] = useState(false);
  const { setTheme } = useTheme();

  // Decode JWT to check if user is admin
  const getIsAdmin = (): boolean => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "admin";
    } catch (e) {
      console.error("Failed to decode token", e);
      return false;
    }
  };

  const isAdmin = getIsAdmin();

  // Load saved settings on mount
  const loadSavedSettings = (): GeneralSettings => {
    try {
      const saved = localStorage.getItem("appSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.theme) {
          setTheme(parsed.theme);
        }
        return {
          ...parsed,
          itemsPerPage: parsed.itemsPerPage?.toString() || "10",
          defaultTab: parsed.defaultTab || "product-ads",
        };
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    return {
      defaultCity: "",
      itemsPerPage: "10",
      defaultTab: "product-ads",
      enableNotifications: true,
      theme: "light",
      imageOptimization: true,
      autosaveInterval: 30,
      enableAutoRefresh: true,
      refreshInterval: 15,
    };
  };

  const generalForm = useForm<GeneralSettings>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: loadSavedSettings(),
  });

  const profileForm = useForm<ProfileSettings>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    },
  });

  useAutoSave(
    generalForm.watch(), // watch all general form fields
    () => generalForm.handleSubmit(onGeneralSubmit)() // auto-submit when changes happen
  );

  const onGeneralSubmit = async (values: GeneralSettings) => {
    setIsSaving(true);
    try {
      localStorage.setItem("appSettings", JSON.stringify(values));

      // 🔥 Tell the dashboard to switch now
      eventBus.emit("switchTab", values.defaultTab);
      eventBus.emit("settingsUpdated", {
        enableAutoRefresh: values.enableAutoRefresh,
        refreshInterval: values.refreshInterval,
      });

      toast({
        title: "Success!",
        description: "General settings saved successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onProfileSubmit = async (values: ProfileSettings) => {
    setIsSaving(true);

    try {
      // Get current user info from JWT in localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT
      const currentUserId = payload.id;

      // Build payload for API
      const payloadData = {
        userId: currentUserId,
        userName: values.userName,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };

      // Call your PATCH API
      const res = await fetch("/api/admin/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      toast({
        title: "Success!",
        description: "Profile updated successfully",
      });

      // Optionally: update localStorage for client-side use
      localStorage.setItem(
        "profile",
        JSON.stringify({ ...payloadData, password: undefined })
      );
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      console.error(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState<string>("general");
  const [contentSection, setContentSection] = useState<string>("main");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <div className="flex-1">
          <div className="container mx-auto px-6 py-8">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="general" className="gap-2">
                  <Globe className="h-4 w-4 text-blue-700" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4 text-blue-700" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-2">
                  <Database className="h-4 w-4 text-blue-700" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
              </TabsList>

              {/* General Settings Tab */}
              <TabsContent value="general">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        General Settings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Configure default application settings
                      </p>
                    </div>
                    <Separator />

                    <Form {...generalForm}>
                      <form
                        onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid gap-6 md:grid-cols-2">
                          <FormField
                            control={generalForm.control}
                            name="defaultTab"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Dashboard Tab</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select tab" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="stores">
                                      Stores
                                    </SelectItem>
                                    <SelectItem value="flyer-products">
                                      Flyer Products
                                    </SelectItem>
                                    <SelectItem value="store-ads">
                                      Store Ads
                                    </SelectItem>
                                    <SelectItem value="product-ads">
                                      Product Ads
                                    </SelectItem>
                                    <SelectItem value="item-list">
                                      Items List
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Tab shown first when dashboard loads
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="defaultCity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default City</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter default city"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Default city for new ads and stores
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={generalForm.control}
                            name="itemsPerPage"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Items Per Page</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select items per page" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Number of items to display in list views
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* 3. Theme Mode */}
                          <FormField
                            control={generalForm.control}
                            name="theme"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Theme Mode</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setTheme(value); // 🔥 apply instantly
                                  }}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                    <SelectItem value="system">
                                      System
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Choose how the dashboard looks
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* 4. Auto-save Interval */}
                          <FormField
                            control={generalForm.control}
                            name="autosaveInterval"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>
                                  Auto-save Interval (seconds)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={10}
                                    max={600}
                                    step={5}
                                    placeholder="e.g. 30"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormDescription>
                                  Automatically save drafts every X seconds
                                  (10–600)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* 5. Auto-refresh Table */}
                          <FormField
                            control={generalForm.control}
                            name="enableAutoRefresh"
                            render={({ field }) => (
                              <FormItem className="flex items-center justify-between rounded-lg border p-4 mt-4">
                                <div className="space-y-0.5">
                                  <FormLabel>Auto-refresh Tables</FormLabel>
                                  <FormDescription>
                                    Refresh lists without reloading the page
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          {/* 6. Auto-refresh interval */}
                          <FormField
                            control={generalForm.control}
                            name="refreshInterval"
                            render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>
                                  Refresh Interval (seconds)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="e.g. 15"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={generalForm.control}
                          name="enableNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Enable Notifications</FormLabel>
                                <FormDescription>
                                  Receive notifications for new submissions and
                                  updates
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Settings"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="profile">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Profile Settings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your account information
                      </p>
                    </div>
                    <Separator />

                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={profileForm.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>User Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your username"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter new password"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Leave blank if you do not want to change
                                password
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm new password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isAdmin && (
                          <FormField
                            control={profileForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="editor">
                                      Editor
                                    </SelectItem>
                                    <SelectItem value="viewer">
                                      Viewer
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  Access level (admin only)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Updating..." : "Update Profile"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="content">
                <Card className="p-6">
                  {contentSection === "main" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Content Management
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Configure content-related settings
                        </p>
                      </div>
                      <Separator />

                      <div className="space-y-4">
                        {/* STORES */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Stores</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Edit store names, status, location etc.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("stores")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Stores
                          </Button>
                        </div>

                        {/* FLYERS */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Flyers</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Manage flyers and their products categories
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("flyers")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Products
                          </Button>
                        </div>

                        {/* STORE ADS */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Store Ads</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Manage your Ads
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("storeAds")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Ads
                          </Button>
                        </div>

                        {/* PRODUCT ADS */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Products Ads</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Manage Product Ads
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("productAds")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Ads
                          </Button>
                        </div>

                        {/* PRODUCT BANNER */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Products Banner</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Manage Products Banner
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("productBanner")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Banner
                          </Button>
                        </div>

                        {/* ITEMS LIST */}
                        <div className="rounded-lg border p-4">
                          <h3 className="font-bold mb-2">Items List</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Manage Items List
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setContentSection("items")}
                            className="bg-white hover:bg-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Manage Items
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ⚡ STORES TABLE */}
                  {contentSection === "stores" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4 ">
                        <StoreTable />
                      </Card>
                    </div>
                  )}

                  {/* ⚡ Other sections placeholders */}
                  {contentSection === "flyers" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4 max-w-full overflow-x-hidden">
                        <div className="w-full overflow-x-auto">
                          <FlyerProductsTable
                            itemsPerPage={parseInt(
                              generalForm.watch("itemsPerPage")
                            )}
                          />
                        </div>
                      </Card>
                    </div>
                  )}

                  {contentSection === "storeAds" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4">
                        <StoreAdsTable
                          itemsPerPage={parseInt(
                            generalForm.watch("itemsPerPage")
                          )}
                        />
                      </Card>
                    </div>
                  )}

                  {contentSection === "productAds" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4">
                        <ProductAdsTable
                          itemsPerPage={parseInt(
                            generalForm.watch("itemsPerPage")
                          )}
                        />
                      </Card>
                    </div>
                  )}

                  {contentSection === "productBanner" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4">
                        <ProductBannerTable
                          itemsPerPage={parseInt(
                            generalForm.watch("itemsPerPage")
                          )}
                        />
                      </Card>
                    </div>
                  )}

                  {contentSection === "items" && (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => setContentSection("main")}
                      >
                        ← Back
                      </Button>
                      <Card className="p-4">
                        <ItemListTable
                          itemsPerPage={parseInt(
                            generalForm.watch("itemsPerPage")
                          )}
                        />
                      </Card>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

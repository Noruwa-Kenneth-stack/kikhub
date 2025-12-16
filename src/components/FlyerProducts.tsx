"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const DEFAULT_BRANDS = [
  "Nike",
  "Adidas",
  "Louis Vuitton",
  "Bic",
  "Binatone",
  "Tecno",
  "iPhone",
];

// Define your default categories
const defaultMainCategories = [
  "Personal Care",
  "Grains & Staples",
  "Electronics",
  "Meat & Seafood",
  "Fruits",
  "Oils & Fats",
  "Soft Drinks",
  "Groceries",
  "Vegetables",
  "Breakfast & Dairy",
  "Baking & Sweets",
  "Cooking Essentials",
  "Home Essentials",
  "Health & Beauty",
  "Beverages",
];

const defaultCategories = [
  "Body Care",
  "Oral Care",
  "Hair Care",
  "Bath & Shower",
  "Deodorants",
  "Feminine Care",
  "Men’s Grooming",
  "Rice",
  "Flour",
  "Pasta & Noodles",
  "Beans & Legumes",
  "Garri & Local Staples",
  "Cereals",
  "Home Appliances",
  "Mobile Accessories",
  "Kitchen Appliances",
  "Fresh Meat",
  "Frozen Fish",
  "Seafood",
  "Fresh Fruits",
  "Local Fruits",
  "Cooking Oils",
  "Butter & Margarine",
  "Carbonated Drinks",
  "Energy Drinks",
  "Juice",
  "General Groceries",
  "Fresh Veggies",
  "Leafy Greens",
  "Milk",
  "Cheese & Yogurt",
  "Butter & Spreads",
  "Breakfast Meals",
  "Baking Basics",
  "Sweets",
  "Cake Add-ons",
  "Spices",
  "Sauces",
  "Dry Ingredients",
  "Cleaning Supplies",
  "Tissue & Wipes",
  "Kitchen Essentials",
  "Skin Care",
  "Health Items",
  "Hot Drinks",
  "Cold Drinks",
  "Chips & Crackers",
  "Biscuits & Cookies",
  "Chocolate & Candy",
];

const defaultSubCategories = [
  "Body cream",
  "Body lotion",
  "Body oil",
  "Toothpaste",
  "Toothbrush",
  "Mouthwash",
  "Shampoo",
  "Conditioner",
  "Hair cream",
  "Soap",
  "Shower gel",
  "Sponge",
  "Roll-on",
  "Spray deodorant",
  "Antiperspirant",
  "Sanitary pads",
  "Pantyliners",
  "Feminine wipes",
  "Shaving cream",
  "Razors",
  "Aftershave",
  "Long-grain rice",
  "Basmati rice",
  "Parboiled rice",
  "All-purpose flour",
  "Wheat flour",
  "Semolina",
  "Spaghetti",
  "Macaroni",
  "Instant noodles",
  "Brown beans",
  "Lentils",
  "Chickpeas",
  "Yellow garri",
  "White garri",
  "Fufu",
  "Amala",
  "Golden Morn",
  "Oats",
  "Blender",
  "Kettle",
  "Microwave",
  "Chargers",
  "Power banks",
  "Earphones",
  "Air fryer",
  "Toaster",
  "Gas cooker",
  "Beef",
  "Chicken",
  "Goat meat",
  "Mackerel",
  "Croaker",
  "Catfish",
  "Prawns",
  "Shrimp",
  "Crab",
  "Apple",
  "Banana",
  "Orange",
  "Pineapple",
  "Mango",
  "Watermelon",
  "Pawpaw",
  "Vegetable oil",
  "Olive oil",
  "Palm oil",
  "Margarine",
  "Baking butter",
  "Coke",
  "Fanta",
  "Sprite",
  "Monster",
  "Red Bull",
  "5 Alive",
  "Chivita",
  "Sugar",
  "Salt",
  "Spices",
  "Canned foods",
  "Tomato",
  "Pepper",
  "Onions",
  "Spinach",
  "Ugwu",
  "Lettuce",
  "Cabbage",
  "Powdered milk",
  "Fresh milk",
  "Evaporated milk",
  "Yogurt drink",
  "Greek yogurt",
  "Peanut butter",
  "Chocolate spread",
  "Cornflakes",
  "Oats (breakfast)",
  "Custard",
  "Baking powder",
  "Yeast",
  "Flour (baking)",
  "Honey",
  "Syrup",
  "Sprinkles",
  "Flavours",
  "Icing sugar",
  "Curry",
  "Thyme",
  "Seasoning cubes",
  "Tomato paste",
  "Pepper mix",
  "Salt (cooking)",
  "Baking soda",
  "Detergent",
  "Bleach",
  "Dish soap",
  "Tissue roll",
  "Wet wipes",
  "Foil paper",
  "Napkins",
  "Bin bags",
  "Face wash",
  "Toner",
  "Face cream",
  "Vitamins",
  "Pain relief",
  "Supplements",
  "Tea",
  "Coffee",
  "Cocoa drink",
  "Malt",
  "Plantain chips",
  "Pringles",
  "Cream biscuits",
  "Shortbread",
  "Chocolate bars",
  "Sweets",
];

interface FormValues {
  store_id: string;
  name: string;
  price?: string;
  discounted_price?: string;
  product_status?: string;
  item_id?: string;
  image?: string;
  sku?: string;
  brands: string[];
  weight: string[];
  image_thumbnails: string[] | string;
  compare_key?: string;
  category?: string;
  subcategory?: string;
  maincategory?: string;
  short_description?: string;
  long_description?: string;
  offer_start_date?: string;
  offer_end_date?: string;
}

export default function FlyerProducts() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [compareKeys, setCompareKeys] = useState<string[]>([]);
  const [newCompareKey, setNewCompareKey] = useState("");
  const [openCompareDialog, setOpenCompareDialog] = useState(false);
  const [mainCategories, setMainCategories] = useState<string[]>([]);
  const [openCatDialog, setOpenCatDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  // Brand inpunt handlers
  // Load from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("brands");
    if (saved) {
      setBrands(JSON.parse(saved));
    } else {
      setBrands(DEFAULT_BRANDS);
      localStorage.setItem("brands", JSON.stringify(DEFAULT_BRANDS));
    }
  }, []);

  // Save brands to localStorage whenever updated
  const addBrand = () => {
    if (!newBrand.trim()) return;

    const updated = [...brands, newBrand.trim()];
    setBrands(updated);
    localStorage.setItem("brands", JSON.stringify(updated));

    setNewBrand("");
    setOpenDialog(false);
  };

  const form = useForm<FormValues>({
    defaultValues: {
      store_id: "",
      name: "",
      price: "",
      discounted_price: "",
      product_status: "",
      item_id: "",
      image: "",
      sku: "",
      brands: [],
      weight: [],
      image_thumbnails: [],
      compare_key: "",
      category: "",
      subcategory: "",
      maincategory: "",
      short_description: "",
      long_description: "",
      offer_start_date: "",
      offer_end_date: "",
    },
  });

  const weights = form.watch("weight") || [];

  // Weight handlers
  const removeWeight = (index: number) => {
    const updated = weights.filter((_, i) => i !== index);
    form.setValue("weight", updated);
  };

  // comparekey  handler
  // Load default or saved compare keys
  // Load compare keys from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("compareKeys") || "[]");
    setCompareKeys(saved.map((k: string) => k.toLowerCase()));
  }, []);

  // Save new compare key (force lowercase)
  const addCompareKey = () => {
    const key = newCompareKey.trim().toLowerCase();
    if (!key) return;

    const updated = [...compareKeys, key];

    setCompareKeys(updated);
    localStorage.setItem("compareKeys", JSON.stringify(updated));

    setNewCompareKey("");
    setOpenCompareDialog(false);
  };

  // Remove compare key from list + localStorage
  const removeCompareKey = (key: string) => {
    const updated = compareKeys.filter((k) => k !== key);

    setCompareKeys(updated);
    localStorage.setItem("compareKeys", JSON.stringify(updated));

    // Clear form value if it was the one removed
    const selected = form.getValues("compare_key") || "";
    if (selected === key) {
      form.setValue("compare_key", "");
    }
  };

  // Main Category handlers
  // Load from localStorage OR fallback to defaults
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mainCategories") || "[]");
    setMainCategories(saved.length ? saved : defaultMainCategories);
  }, []);

  // Save new category
  const addMainCategory = () => {
    if (!newCategory.trim()) return;

    const updated = [...mainCategories, newCategory.trim()];

    setMainCategories(updated);
    localStorage.setItem("mainCategories", JSON.stringify(updated));

    setNewCategory("");
    setOpenCatDialog(false);
  };

  const removeMainCategory = (cat: string) => {
    const updated = mainCategories.filter((c) => c !== cat);

    setMainCategories(updated);
    localStorage.setItem("mainCategories", JSON.stringify(updated));

    // If the admin deleted the selected category, clear it in the form
    if (form.getValues("maincategory") === cat) {
      form.setValue("maincategory", "");
    }
  };

  // Category handlers
  const addCategory = () => {
    if (!newCategory.trim()) return;

    const newList = [...categories, newCategory.trim()];
    setCategories(newList);
    localStorage.setItem("categories", JSON.stringify(newList));

    setNewCategory("");
    setOpenCategoryDialog(false);
  };

  const removeCategory = (cat: string) => {
    const updated = categories.filter((c) => c !== cat);

    setCategories(updated);
    localStorage.setItem("categories", JSON.stringify(updated));

    // clear form value if deleted category was selected
    if (form.getValues("category") === cat) {
      form.setValue("category", "");
    }
  };

  // Subcategory handlers
  useEffect(() => {
    const saved = localStorage.getItem("subcategories");

    if (saved && JSON.parse(saved).length > 0) {
      setSubcategories(JSON.parse(saved));
    } else {
      setSubcategories(defaultSubCategories);
      localStorage.setItem(
        "subcategories",
        JSON.stringify(defaultSubCategories)
      );
    }
  }, []);

  const saveSubcategories = (list: string[]) => {
    setSubcategories(list);
    localStorage.setItem("subcategories", JSON.stringify(list));
  };

  const addSubcategory = () => {
    const cleaned = newSubcategory.trim();
    if (!cleaned) return;

    const updated = [...subcategories, cleaned];
    saveSubcategories(updated);
    setNewSubcategory("");
  };

  const removeSubcategory = (sub: string) => {
    const filtered = subcategories.filter((x) => x !== sub);
    saveSubcategories(filtered);

    if (form.getValues("subcategory") === sub) {
      form.setValue("subcategory", "");
    }
  };

  // Form submission
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true);
    try {
      const normalizedImageThumbnails: string[] =
        Array.isArray(values.image_thumbnails) &&
        values.image_thumbnails.length > 0
          ? values.image_thumbnails
          : typeof values.image_thumbnails === "string" &&
            values.image_thumbnails.trim().length > 0
          ? values.image_thumbnails
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

      const payload = {
        store_id: values.store_id ? Number(values.store_id) : null, // int or null
        name: values.name,
        price: values.price ? Number(values.price) : null, // numeric(10,2) or null
        discounted_price: values.discounted_price
          ? Number(values.discounted_price)
          : null,
        product_status: values.product_status || null,
        item_id: values.item_id ? Number(values.item_id) : null,
        image: values.image || null,
        sku: values.sku || null,
        brands: values.brands && values.brands.length ? values.brands : null, // text[] or null
        weight: values.weight && values.weight.length ? values.weight : null, // text[] or null
        image_thumbnails: normalizedImageThumbnails.length
          ? normalizedImageThumbnails
          : null, // text[] or null
        compare_key: Array.isArray(values.compare_key)
          ? values.compare_key.join(", ").toLowerCase()
          : values.compare_key
          ? values.compare_key.toLowerCase()
          : null,
        category: values.category || null,
        subcategory: values.subcategory || null,
        maincategory: values.maincategory || null,
        short_description: values.short_description || null,
        long_description: values.long_description || null,
        offer_start_date: values.offer_start_date
          ? new Date(values.offer_start_date).toISOString()
          : null,
        offer_end_date: values.offer_end_date
          ? new Date(values.offer_end_date).toISOString()
          : null,
      };
      console.log(payload);

      const res = await fetch("/api/flyer-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to add flyer product");

      toast({
        title: "Success!",
        description: "Flyer product has been added successfully.",
        variant: "success",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to add flyer product",
        variant: "destructive",
      });
      console.error("Error adding flyer product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <div className="flex-1">
          <div className="container mx-auto px-6 py-10">
            <Card className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Basic Information - 2 Columns */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Basic Information
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="store_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter store ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="item_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter item ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter SKU" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brands"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brands</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(v) => {
                                  if (v === "__empty__") {
                                    field.onChange([]); // Clear the selection
                                  } else {
                                    field.onChange([v]); // Save selected brand as array
                                  }
                                }}
                                value={field.value[0] || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="__empty__">
                                    Clear selection
                                  </SelectItem>
                                  {brands.map((brand, i) => (
                                    <SelectItem key={i} value={brand}>
                                      {brand}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              type="button"
                              onClick={() => setOpenDialog(true)}
                            >
                              + Add Brand
                            </Button>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Dialog for adding brand */}
                      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Brand</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Enter new brand name"
                            value={newBrand}
                            onChange={(e) => setNewBrand(e.target.value)}
                          />
                          <DialogFooter>
                            <Button onClick={addBrand}>Save Brand</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Weight */}
                      <FormField
                        control={form.control}
                        name="weight"
                        render={() => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {weights.map((w, i) => (
                                <div
                                  key={i}
                                  className="px-3 py-1 bg-secondary rounded-md flex items-center gap-2"
                                >
                                  <span>{w}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeWeight(i)}
                                    className="text-red-500 text-sm"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  value={value}
                                  onChange={(e) => setValue(e.target.value)}
                                />
                              </FormControl>

                              <FormControl>
                                <Select onValueChange={setUnit} value={unit}>
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {["kg", "g", "ton", "litres", "cl"].map(
                                      (u) => (
                                        <SelectItem key={u} value={u}>
                                          {u}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="product_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Status</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(val) =>
                                  field.onChange(val === "__empty__" ? "" : val)
                                }
                                value={field.value || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {/* Special "Clear" item */}
                                  <SelectItem value="__empty__">
                                    Clear selection
                                  </SelectItem>
                                  <SelectItem value="Hot">Hot</SelectItem>
                                  <SelectItem value="New">New</SelectItem>
                                  <SelectItem value="Out Of Stock">
                                    Out Of Stock
                                  </SelectItem>
                                  <SelectItem value="In Stock">
                                    In Stock
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="compare_key"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compare Key</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(val) =>
                                  field.onChange([val.toLowerCase()])
                                }
                                value={
                                  Array.isArray(field.value)
                                    ? field.value[0] || ""
                                    : ""
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a compare key" />
                                </SelectTrigger>
                                <SelectContent>
                                  {compareKeys.map((key, i) => (
                                    <SelectItem
                                      key={i}
                                      value={key.toLowerCase()}
                                    >
                                      {key.toLowerCase()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => setOpenCompareDialog(true)}
                              >
                                + Add Compare Key
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => field.onChange([])}
                              >
                                Remove Selection
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  if (
                                    Array.isArray(field.value) &&
                                    field.value[0]
                                  ) {
                                    removeCompareKey(field.value[0]); // remove from localStorage
                                    field.onChange([]); // clear selection in the form
                                  }
                                }}
                              >
                                Delete Key
                              </Button>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Dialog for adding compare key */}
                      <Dialog
                        open={openCompareDialog}
                        onOpenChange={setOpenCompareDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Compare Key</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Enter new compare key"
                            value={newCompareKey}
                            onChange={(e) => setNewCompareKey(e.target.value)}
                          />
                          <DialogFooter>
                            <Button onClick={addCompareKey}>Save Key</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Pricing - 2 Columns */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Pricing
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {["price", "discounted_price"].map((name) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name as keyof FormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {name
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Categories - 3 Columns */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Categories
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="maincategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Main Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select main category" />
                                </SelectTrigger>

                                <SelectContent>
                                  {mainCategories.map((cat, i) => (
                                    <SelectItem key={i} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            {/* ADD CATEGORY BUTTON */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              type="button"
                              onClick={() => setOpenCatDialog(true)}
                            >
                              + Add Category
                            </Button>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ADD-CATEGORY DIALOG */}
                      <Dialog
                        open={openCatDialog}
                        onOpenChange={setOpenCatDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Categories</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                              Add new categories or remove existing ones.
                            </p>
                          </DialogHeader>

                          {/* New category input */}
                          <Input
                            placeholder="Enter new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                          />

                          <Button onClick={addMainCategory} className="mt-2">
                            Add Category
                          </Button>

                          {/* Category list with delete buttons */}
                          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                            {mainCategories.map((cat, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between bg-secondary px-3 py-2 rounded-md"
                              >
                                <span>{cat}</span>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeMainCategory(cat)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>

                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>

                                <SelectContent>
                                  {categories.map((cat, i) => (
                                    <SelectItem key={i} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenCategoryDialog(true)}
                              >
                                + Add Category
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange("")}
                              >
                                Remove
                              </Button>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Dialog
                        open={openCategoryDialog}
                        onOpenChange={setOpenCategoryDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Categories</DialogTitle>
                          </DialogHeader>

                          <Input
                            placeholder="Enter new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                          />

                          <Button className="mt-2" onClick={addCategory}>
                            Add Category
                          </Button>

                          <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                            {categories.map((cat, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center bg-secondary rounded-md px-3 py-2"
                              >
                                <span>{cat}</span>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeCategory(cat)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>

                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <FormField
                        control={form.control}
                        name="subcategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subcategory" />
                                </SelectTrigger>

                                <SelectContent>
                                  {subcategories.map((sub, i) => (
                                    <SelectItem key={i} value={sub}>
                                      {sub}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>

                            <div className="flex gap-2 mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenSubDialog(true)}
                              >
                                + Add Subcategory
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => field.onChange("")}
                              >
                                Remove
                              </Button>
                            </div>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Dialog
                        open={openSubDialog}
                        onOpenChange={setOpenSubDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Subcategories</DialogTitle>
                          </DialogHeader>

                          <Input
                            placeholder="Enter new subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                          />

                          <Button className="mt-2" onClick={addSubcategory}>
                            Add Subcategory
                          </Button>

                          <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                            {subcategories.map((sub, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center bg-secondary rounded-md px-3 py-2"
                              >
                                <span>{sub}</span>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeSubcategory(sub)}
                                >
                                  Delete
                                </Button>
                              </div>
                            ))}
                          </div>

                          <DialogFooter />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {/* Media - 2 Columns */}
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      Media
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {["image.jpg", "image_thumbnails.jpg"].map((name) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name as keyof FormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {name
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`Enter ${name.replace(
                                    /_/g,
                                    " "
                                  )}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description - single column textareas */}
                  <div className="grid gap-6">
                    {["short_description", "long_description"].map((name) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name as keyof FormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {name
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={name === "short_description" ? 2 : 4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Offer Period - 2 Columns */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold text-foreground">
                        Offer Period
                      </h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {["offer_start_date", "offer_end_date"].map((name) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name as keyof FormValues}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {name === "offer_start_date"
                                  ? "Offer Start Date & Time"
                                  : "Offer End Date & Time"}
                              </FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
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
                      {isSubmitting ? "Adding Product..." : "Add Product"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

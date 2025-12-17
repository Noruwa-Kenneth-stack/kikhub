// src/types/flyerproducts.ts

export interface FlyerProduct {
  id: number; // auto-increment
  store_id: number;
  name: string | null;
  price: number | null;
  discounted_price: number | null;
  product_status: string | null;
  item_id: number | null;
  image: string | null;
  sku: string | null;

  brands: string[] | null;
  weight: string[] | null;
  image_thumbnails: string[] | null;

  compare_key: string | null;    

  category: string | null;
  subcategory: string | null;
  maincategory: string | null;

  short_description: string | null;
  long_description: string | null;

  offer_start_date: string | null; // ISO string
  offer_end_date: string | null;   // ISO string
}

// Used for forms or editing (id not required)
export type EditableFlyerProduct = Partial<FlyerProduct>;

// Used for creating new product (id must be excluded)
export type CreateFlyerProduct = Omit<FlyerProduct, "id">;

--
-- PostgreSQL database dump
--

\restrict sjgJzlCQIqoL0OnpYFDCay87TZUpZfccyc8qR47yrlmVJwraIl2RgBgj5PzEV0E

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash text NOT NULL,
    role character varying(20) DEFAULT 'admin'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: flyer_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.flyer_products (
    id integer NOT NULL,
    store_id integer,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    discounted_price numeric(10,2),
    product_status text,
    item_id bigint,
    image text,
    sku text,
    brands text[],
    weight text[],
    image_thumbnails text[],
    compare_key text,
    category text,
    subcategory text,
    short_description text,
    long_description text,
    created_at timestamp without time zone DEFAULT now(),
    maincategory character varying(255),
    offer_start_date timestamp without time zone,
    offer_end_date timestamp without time zone,
    CONSTRAINT flyer_products_product_status_check CHECK ((product_status = ANY (ARRAY['In Stock'::text, 'Out Of Stock'::text, 'New'::text, 'Hot'::text])))
);


--
-- Name: flyer_products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.flyer_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: flyer_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.flyer_products_id_seq OWNED BY public.flyer_products.id;


--
-- Name: itemlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.itemlist (
    id integer NOT NULL,
    name text NOT NULL,
    language text DEFAULT 'en'::text,
    icon text
);


--
-- Name: itemlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.itemlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: itemlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.itemlist_id_seq OWNED BY public.itemlist.id;


--
-- Name: product_ads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_ads (
    id integer NOT NULL,
    image character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    subtitle text,
    price text,
    offer character varying(50),
    hotkey character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    city character varying(100)
);


--
-- Name: product_ads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_ads_id_seq OWNED BY public.product_ads.id;


--
-- Name: product_banner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_banner (
    id integer NOT NULL,
    headline character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    subtitle character varying(255),
    image character varying(255),
    city character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    product_id integer
);


--
-- Name: product_banner_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_banner_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_banner_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_banner_id_seq OWNED BY public.product_banner.id;


--
-- Name: store_ads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_ads (
    id integer NOT NULL,
    src text NOT NULL,
    alt text NOT NULL,
    title text,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    city character varying(100)
);


--
-- Name: store_ads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_ads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_ads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_ads_id_seq OWNED BY public.store_ads.id;


--
-- Name: stores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    store_name text NOT NULL,
    image_url text,
    status text,
    featured boolean DEFAULT false,
    logo text,
    city text,
    address text,
    categories text[] NOT NULL,
    location public.geography(Point,4326) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    opening_hours text
);


--
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: flyer_products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyer_products ALTER COLUMN id SET DEFAULT nextval('public.flyer_products_id_seq'::regclass);


--
-- Name: itemlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itemlist ALTER COLUMN id SET DEFAULT nextval('public.itemlist_id_seq'::regclass);


--
-- Name: product_ads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_ads ALTER COLUMN id SET DEFAULT nextval('public.product_ads_id_seq'::regclass);


--
-- Name: product_banner id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_banner ALTER COLUMN id SET DEFAULT nextval('public.product_banner_id_seq'::regclass);


--
-- Name: store_ads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_ads ALTER COLUMN id SET DEFAULT nextval('public.store_ads_id_seq'::regclass);


--
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, username, password_hash, role, created_at) FROM stdin;
\.


--
-- Data for Name: flyer_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.flyer_products (id, store_id, name, price, discounted_price, product_status, item_id, image, sku, brands, weight, image_thumbnails, compare_key, category, subcategory, short_description, long_description, created_at, maincategory, offer_start_date, offer_end_date) FROM stdin;
60	1	Nivea Lotion Nourishing Cocoa 	3899.99	\N	Hot	9800009	nivealotion.png	NIV320	{iPhone}	\N	{nivealotion.png}	\N	Oral Care	Body cream	\N	\N	2025-12-10 23:05:27.184806	Personal Care	\N	\N
3	1	Dell	249000.00	229000.00	In Stock	934754358	/08/laptop-image.jpg	DELL001	{Dell}	{500g,1kg}	{/04/product-image-7-346x310.jpg}	devices	Electronics & Accessories	Laptops	High-performance business laptop.	Powerful specs, lightweight design, and long-lasting battery life make the Dell Latitude 4550 ideal for professionals.	2025-10-07 17:01:14.335171	Electronics	2025-11-10 00:00:00	2025-11-10 02:59:59
4	1	Beef	2500.00	\N	\N	935547922	/08/meat-image.jpg	BEEF122	{Kroger}	{5kg,8kg}	{/04/product-image-27-346x310.jpg}	produce	Meats & Seafood	Beef	Fresh beef cuts for everyday cooking.	High-quality, tender beef sourced from local farms. Perfect for soups, stews, and grilling.	2025-10-07 17:01:14.335171	Meat & Seafood	\N	\N
42	3	Canned Sardines 125g	1500.00	\N	In Stock	\N	/08/sardine-image.jpg	SARDINE001	{Titus}	{125g}	{/04/product-image-103-346x310.jpg}	sardines	Meats & Seafood	Canned Fish	\N	\N	2025-10-19 18:32:18.98735	Meat & Seafood	\N	\N
2	1	BlueBand 	1500.00	\N	New	934754357	/08/butter-image.jpg	SNACK002	{Unilever}	{100g,900g}	{/04/product-image-57-346x310.jpg}	flour	Breakfast & Dairy	Butter and Margarine	Creamy spread perfect for toast and baking.	Blueband butter adds flavor and richness to every meal, made from high-quality milk fats.	2025-10-07 17:01:14.335171	Grains & Staples	\N	\N
59	1	Nivea Lotion Nourishing Cocoa 	6000.00	4715.00	In Stock	\N	/products/nivealotion.png	NIV320	{Nivea}	{}	{/products/nivealotion.png}	lotion	Body Care	Body lotion	Know Your Product\n\nMost products come with directions for how to use them but if the product is not branded or doesn't have any label or packaging, you can check online or ask friends for directions for use. Consumer goods products made by manufacturers will typically come with instructions for use; if you don't find this enclosed, exercise caution before using or consuming any product you're unfamiliar with. 	Buy Nivea Lotion Nourishing Cocoa 400 ml on Supermart.ng. Nivea Lotion Nourishing Cocoa 400 ml allows your skin to experience proper hydration and moisture, it has this non-greasy formula that makes your skin soft and smooth. The Nivea Lotion Nourishing Cocoa 400 ml provides reliable UVA and UVB protection and supports a beautiful tan at the same time. Gift your skin the goodness of this product for all day long healthy looking skin. It is enriched with cocoa extracts that soothes your dry, itchy and irritated skin and leaves you with comfortable, soft and hydrated skin. It is suitable for usage on all types of skin from oily to dry. It can also be used as a moisturizer to treat or prevent dry, rough, scaly, itchy skin and minor skin irritations (e.g. rash and skin burns from radiation therapy). This product promises a visibly healthier complexion to whoever uses it on their skin. It can be bought online at supermart.ng Buy this on Supermart.ng. Your skin needs regular hydration. And because our skin can get dry and damaged as we go about our daily activities, it is important to use a good moisturiser to restore vitality to your skin. We also need protection from the sun and a good moisturiser will help to do this. Moisturisers restore as well as trap water in your skin which helps keep the skin healthy. When applying body lotion, it should be applied all over the body - from our face right down to our toes. After a shower, dry yourself and then apply your body cream of choice generously all over your body. 	2025-12-06 23:10:09.984764	Personal Care	2025-12-06 22:00:00	2025-12-10 22:00:00
12	1	Cooking Oil 5L	7500.00	6999.00	In Stock	\N	/08/oil-image.jpg	OIL005	{OliveGold}	{10litre}	{/04/product-image-70-346x310.jpg}	oil	Oils & Fats	Cooking Oil	Pure vegetable oil for everyday cooking.	Refined cooking oil 	2025-10-19 14:35:32.670018	Oils & Fats	\N	\N
5	1	Nivea body cream	4100.00	3750.00	Out Of Stock	934754359	/08/cream-image.jpg	SEAFOOD001	{"Great American"}	{2g,4g}	{/04/product-image-28-346x310.jpg}	cream	Home Appliances	Fans	Nourishing cream for smooth, radiant skin.	Nivea Body Cream provides long-lasting moisture and care for all skin types.	2025-10-07 17:01:14.335171	Personal Care	\N	\N
7	1	kings Butter	4900.00	\N	New	\N	/08/butter-image.jpg	SNACK002	{Unilever}	{100g,900g}	{/04/product-image-57-346x310.jpg}	flour	Breakfast & Dairy	Butter and Margarine	Creamy spread perfect for toast and baking.	Blueband butter adds flavor and richness to every meal, made from high-quality milk fats.	2025-10-19 14:35:32.670018	Grains & Staples	\N	\N
8	1	Nivea Body Cream	4100.00	3750.00	Out Of Stock	\N	/08/cream-image.jpg	SEAFOOD001	{Nivea}	{200ml}	{/04/product-image-28-346x310.jpg}	cream	Personal Care	Body Cream	Nourishing cream for smooth, radiant skin.	Nivea Body Cream provides long-lasting moisture and care for all skin types.	2025-10-19 14:35:32.670018	Personal Care	\N	\N
9	1	Beef Cuts 5kg	2500.00	\N	Hot	\N	/08/meat-image.jpg	BEEF122	{Kroger}	{5kg,8kg}	{/04/product-image-27-346x310.jpg}	produce	Meats & Seafood	Beef	\N	\N	2025-10-19 14:35:32.670018	Meat & Seafood	\N	\N
10	1	Rice Premium 10kg	15000.00	13900.00	In Stock	\N	https://picsum.photos/seed/rice/400/400	RICE010	{GoldenGrain}	{10kg}	{https://picsum.photos/seed/rice-bag/200/200}	rice	Grains & Cereals	Rice	Long-grain, aromatic rice for everyday meals.	Premium-quality rice that cooks fluffy and non-sticky, ideal for family dishes.	2025-10-19 14:35:32.670018	Grains & Staples	\N	\N
13	1	Fresh Apples 2kg	5400.00	\N	In Stock	\N	https://picsum.photos/seed/apples/400/400	APPLE002	{FreshFarm}	{2kg}	{https://picsum.photos/seed/apples-bag/200/200}	apples	Fruits	Apples	Crisp, juicy apples from local farms.	Packed with vitamins and freshness — perfect as a snack or in salads.	2025-10-19 14:35:32.670018	Fruits	\N	\N
14	1	Bananas 1 Dozen	1900.00	\N	In Stock	\N	/08/banana-image.jpg	BANANA01	{TropiFarm}	{"1 dozen"}	{/04/product-image-80-346x310.jpg}	banana	Fruits	Bananas	Fresh, ripe bananas full of natural sweetness.	Great for smoothies, snacks, or baking — rich in potassium and flavor.	2025-10-19 14:35:32.670018	Fruits	\N	\N
16	1	Eggs Large 12-pcs	2400.00	\N	In Stock	\N	/08/eggs-image.jpg	EGGS012	{FarmFresh}	{12pcs}	{/04/product-image-90-346x310.jpg}	eggs	Breakfast & Dairy	Eggs	Large, farm-fresh eggs packed with protein.	Perfect for breakfast or baking — delivered fresh and handled with care.	2025-10-19 14:35:32.670018	Breakfast & Dairy	\N	\N
17	1	Sugar White 5kg	6200.00	\N	In Stock	\N	https://picsum.photos/seed/sugar/400/400	SUGAR005	{SweetLife}	{5kg}	{https://picsum.photos/seed/sugar-bag/200/200}	flour	Baking & Sweets	Sugar	Fine white sugar for baking and sweetening.	Pure and granulated, ideal for coffee, desserts, and pastries.	2025-10-19 14:35:32.670018	Grains & Staples	\N	\N
19	1	Milk Powder 500g	4500.00	3999.00	In Stock	\N	https://picsum.photos/seed/milk/400/400	MILK500	{DairyBest}	{500g}	{https://picsum.photos/seed/milk-powder/200/200}	milk_powder	Breakfast & Dairy	Milk Powder	Nutritious milk powder rich in calcium.	Ideal for beverages, cereals, and cooking — dissolves easily with a creamy taste.	2025-10-19 14:35:32.670018	Breakfast & Dairy	\N	\N
20	1	Bread Whole Wheat 600g	1800.00	\N	In Stock	\N	/08/bread-image.jpg	BREAD600	{GoldenBakery}	{600g}	{/04/product-image-99-346x310.jpg}	flour	Bakery	Bread	Soft, whole-wheat bread for a hearty breakfast.	Baked fresh with natural grains — high in fiber and deliciously wholesome.	2025-10-19 14:35:32.670018	Grains & Staples	\N	\N
21	2	Golden Corn Flakes 500g	2800.00	2500.00	In Stock	\N	https://picsum.photos/seed/cornflakes/400/400	CEREAL001	{Kellogg’s}	{500g}	{https://picsum.photos/seed/cornflakes-box/200/200}	corn_flakes	Breakfast & Dairy	Cereal	\N	\N	2025-10-19 16:37:56.721961	Breakfast & Dairy	\N	\N
26	2	Indomie Noodles Chicken 70g x40	7800.00	7200.00	In Stock	\N	/08/noodles-image.jpg	INDOM40	{Dufil}	{"70g x40"}	{/04/product-image-120-346x310.jpg}	noodles	Pasta	Pasta	\N	\N	2025-10-19 16:37:56.721961	Grains & Staples	\N	\N
27	2	Golden Penny Semovita 5kg	6200.00	\N	In Stock	\N	https://picsum.photos/seed/semovita/400/400	SEMO05	{"Golden Penny"}	{5kg}	{https://picsum.photos/seed/semovita-bag/200/200}	flour	Grains & Staples	Semovita	\N	\N	2025-10-19 16:37:56.721961	Grains & Staples	\N	\N
28	2	Dangote Rice 10kg	15500.00	14500.00	In Stock	\N	/08/rice-dangote.jpg	RICE10D	{Dangote}	{10kg}	{/04/product-image-130-346x310.jpg}	flour	Grains	Rice	\N	\N	2025-10-19 16:37:56.721961	Grains & Staples	\N	\N
29	2	Power Oil 1L	1600.00	\N	In Stock	\N	https://picsum.photos/seed/poweroil/400/400	POWEROIL1L	{"PZ Cussons"}	{1L}	{https://picsum.photos/seed/poweroil-bottle/200/200}	flour	Oils & Fats	Cooking Oil	\N	\N	2025-10-19 16:37:56.721961	Grains & Staples	\N	\N
30	2	Gino Tomato Paste 210g x6	2700.00	\N	In Stock	\N	/08/gino-image.jpg	GINO210	{Gino}	{"210g x6"}	{/04/product-image-140-346x310.jpg}	flour	Cooking Essentials	Tomato Paste	\N	\N	2025-10-19 16:37:56.721961	Grains & Staples	\N	\N
31	2	Knorr Chicken Cubes 50pcs	1800.00	\N	In Stock	\N	https://picsum.photos/seed/knorr/400/400	KNORR50	{Knorr}	{50pcs}	{https://picsum.photos/seed/knorr-cubes/200/200}	knorr_cubes	Cooking Essentials	Seasoning Cubes	\N	\N	2025-10-19 16:37:56.721961	Cooking Essentials	\N	\N
32	2	Omo Detergent 1kg	2900.00	2500.00	In Stock	\N	/08/omo-image.jpg	OMO1K	{Unilever}	{1kg}	{/04/product-image-150-346x310.jpg}	detergent	Home Care	Laundry Detergent	\N	\N	2025-10-19 16:37:56.721961	Home Essentials	\N	\N
33	2	Morning Fresh Dishwash 900ml	2800.00	\N	In Stock	\N	https://picsum.photos/seed/morningfresh/400/400	MF900	{"PZ Cussons"}	{900ml}	{https://picsum.photos/seed/morningfresh-bottle/200/200}	soap	Home Care	Dishwashing Liquid	\N	\N	2025-10-19 16:37:56.721961	Personal Care	\N	\N
34	2	Close Up Toothpaste 140g	1200.00	\N	In Stock	\N	/08/closeup-image.jpg	CLOSEUP140	{Unilever}	{140g}	{/04/product-image-155-346x310.jpg}	paste	Personal Care	Toothpaste	\N	\N	2025-10-19 16:37:56.721961	Cooking Essentials	\N	\N
15	1	Tomatoes Fresh 1kg	3400.00	2999.00	In Stock	\N	https://picsum.photos/seed/tomatoes/400/400	TOMATO01	{GreenGrow}	{1kg}	{https://picsum.photos/seed/tomatoes-box/200/200}	tomatoes	Vegetables	Tomatoes	Farm-fresh tomatoes for everyday cooking.	Bright red and full of flavor, ideal for sauces, stews, and salads.	2025-10-19 14:35:32.670018	Vegetables	\N	\N
1	1	Sweet & Salty Latte	1800.00	1400.00	In Stock	934754356	/08/coffee-image.jpg	SNACK001	{Angie’s}	{100g,200g}	{/04/product-image-60-346x310.jpg,/04/product-image-61-346x310.jpg,/04/product-image-62-346x310.jpg}	snacks	Beverages	Coffee	Iodised salt for healthy cooking.	Essential kitchen staple enriched with iodine to support wellness.	2025-10-07 17:01:14.335171	Baking & Sweets	\N	\N
18	1	Salt Iodised 1kg	1200.00	\N	In Stock	\N	/08/salt-image.jpg	SALT001	{SpiceCorp}	{1kg}	{/04/product-image-95-346x310.jpg}	salt	Baking & Sweets	Salt	Iodised salt for healthy cooking.	Essential kitchen staple enriched with iodine to support wellness.	2025-10-19 14:35:32.670018	Baking & Sweets	\N	\N
22	2	Milo Chocolate Drink 400g	3200.00	\N	In Stock	\N	/08/milo-image.jpg	MILO400	{Nestle}	{400g}	{/04/product-image-101-346x310.jpg}	chocolate	Beverages	Tea	\N	\N	2025-10-19 16:37:56.721961	Snacks & Confectionery	\N	\N
23	2	Lipton Yellow Label Tea 100s	4500.00	4200.00	In Stock	\N	https://picsum.photos/seed/lipton/400/400	TEA100	{Lipton}	{"100 sachets"}	{https://picsum.photos/seed/lipton-tea/200/200}	lipton_tea	Beverages	Tea	\N	\N	2025-10-19 16:37:56.721961	Beverages	\N	\N
24	2	Coca-Cola 1.5L Bottle	900.00	\N	Hot	\N	/08/coke-image.jpg	COKE15L	{Coca-Cola}	{1.5L}	{/04/product-image-108-346x310.jpg}	drink	Beverages	Soft Drink	\N	\N	2025-10-19 16:37:56.721961	Soft Drinks	\N	\N
25	2	Pepsi 50cl Bottle	600.00	\N	In Stock	\N	https://picsum.photos/seed/pepsi/400/400	PEPSI05	{PepsiCo}	{50cl}	{https://picsum.photos/seed/pepsi-bottle/200/200}	drink	Beverages	Soft Drink	\N	\N	2025-10-19 16:37:56.721961	Soft Drinks	\N	\N
35	2	Dettol Antiseptic 500ml	3500.00	3200.00	Hot	\N	https://picsum.photos/seed/dettol/400/400	DETTOL500	{Reckitt}	{500ml}	{https://picsum.photos/seed/dettol-bottle/200/200}	dettol	Health & Hygiene	Antiseptic	\N	\N	2025-10-19 16:37:56.721961	Health & Beauty	\N	\N
36	2	Always Ultra Pads 8s	1900.00	\N	In Stock	\N	/08/always-image.jpg	ALWAYS8	{Always}	{8pcs}	{/04/product-image-160-346x310.jpg}	always_pads	Personal Care	Sanitary Pads	\N	\N	2025-10-19 16:37:56.721961	Personal Care	\N	\N
37	2	Peanut Butter 340g	4200.00	3900.00	New	\N	https://picsum.photos/seed/peanutbutter/400/400	PEANUT340	{Skippy}	{340g}	{https://picsum.photos/seed/peanut-jar/200/200}	peanut_butter	Butter and Margarine	Spreads	\N	\N	2025-10-19 16:37:56.721961	Breakfast & Dairy	\N	\N
38	3	Corn Flakes 500g	3200.00	\N	In Stock	\N	/08/cornflakes-image.jpg	CEREAL001	{Kellogg’s}	{500g}	{/04/product-image-101-346x310.jpg}	corn_flakes	Breakfast & Dairy	Cereal	\N	\N	2025-10-19 18:32:18.98735	Breakfast & Dairy	\N	\N
39	3	Yoghurt Drink Strawberry 1L	2800.00	2500.00	Hot	\N	https://picsum.photos/seed/strawberry-yogurt/400/400	YOGHURT001	{Hollandia}	{1L}	{https://picsum.photos/seed/strawberry-yogurt-thumb/200/200}	produce	Breakfast & Dairy	Yoghurt Drinks	\N	\N	2025-10-19 18:32:18.98735	Meat & Seafood	\N	\N
40	3	Toilet Paper 6 Rolls	2200.00	1800.00	In Stock	\N	/08/toilet-paper-image.jpg	TOILET001	{SoftTouch}	{"6 rolls"}	{/04/product-image-102-346x310.jpg}	toilet_paper	Household	Tissue & Wipes	\N	\N	2025-10-19 18:32:18.98735	Home Essentials	\N	\N
41	3	Bottled Water 75cl Pack	1800.00	\N	New	\N	https://picsum.photos/seed/water-pack/400/400	WATER001	{Eva}	{12x75cl}	{https://picsum.photos/seed/water-pack-thumb/200/200}	bottled_water	Beverages	Water	\N	\N	2025-10-19 18:32:18.98735	Beverages	\N	\N
43	3	Tomato Paste 400g	900.00	\N	New	\N	https://picsum.photos/seed/tomato-paste/400/400	TOMPASTE001	{Gino}	{400g}	{https://picsum.photos/seed/tomato-paste-thumb/200/200}	tomato_paste	Canned Goods	Tomato Paste	\N	\N	2025-10-19 18:32:18.98735	Cooking Essentials	\N	\N
44	3	Dishwashing Liquid 1L	2100.00	1900.00	Hot	\N	/08/dishwashing-liquid.jpg	DISH001	{MorningFresh}	{1L}	{/04/product-image-104-346x310.jpg}	dishwashing_liquid	Cleaning Supplies	Dishwashing	\N	\N	2025-10-19 18:32:18.98735	Home Essentials	\N	\N
45	3	Laundry Detergent 2kg	4800.00	\N	In Stock	\N	https://picsum.photos/seed/detergent/400/400	DETERGENT001	{Ariel}	{2kg}	{https://picsum.photos/seed/detergent-thumb/200/200}	detergent	Cleaning Supplies	Laundry	\N	\N	2025-10-19 18:32:18.98735	Home Essentials	\N	\N
46	3	Toothpaste 150ml	1500.00	\N	New	\N	/08/toothpaste-image.jpg	TOOTH001	{Colgate}	{150ml}	{/04/product-image-105-346x310.jpg}	toothpaste	Personal Care	Toothpaste	\N	\N	2025-10-19 18:32:18.98735	Health & Beauty	\N	\N
47	3	Bath Soap 200g	800.00	\N	In Stock	\N	https://picsum.photos/seed/bath-soap/400/400	SOAP001	{Dettol}	{200g}	{https://picsum.photos/seed/bath-soap-thumb/200/200}	soap	Personal Care	Bath Soap	\N	\N	2025-10-19 18:32:18.98735	Personal Care	\N	\N
48	3	Groundnut Oil 3L	5500.00	4999.00	In Stock	\N	/08/groundnut-oil-image.jpg	OIL003	{Kings}	{3L}	{/04/product-image-106-346x310.jpg}	groundnut_oil	Oils & Fats	Cooking Oil	\N	\N	2025-10-19 18:32:18.98735	Oils & Fats	\N	\N
49	3	Honey Natural 500ml	4200.00	\N	Hot	\N	https://picsum.photos/seed/honey/400/400	HONEY001	{BeePure}	{500ml}	{https://picsum.photos/seed/honey-thumb/200/200}	honey	Baking & Sweets	Honey	\N	\N	2025-10-19 18:32:18.98735	Baking & Sweets	\N	\N
50	3	Frozen Chicken 1kg	6800.00	6500.00	Out Of Stock	\N	/08/frozen-chicken-image.jpg	CHICK001	{ChiFarm}	{1kg}	{/04/product-image-107-346x310.jpg}	frozen_chicken	Meats & Seafood	Chicken	\N	\N	2025-10-19 18:32:18.98735	Meat & Seafood	\N	\N
51	3	Carrots 1kg	2300.00	\N	In Stock	\N	https://picsum.photos/seed/carrots/400/400	CARROT001	{VeggieFresh}	{1kg}	{https://picsum.photos/seed/carrots-thumb/200/200}	produce	Vegetables	Carrots	\N	\N	2025-10-19 18:32:18.98735	Meat & Seafood	\N	\N
52	3	Onions 2kg	2700.00	2000.00	Hot	\N	/08/onion-image.jpg	ONION001	{AgroFarm}	{2kg}	{/04/product-image-108-346x310.jpg}	onions	Vegetables	Onions	\N	\N	2025-10-19 18:32:18.98735	Vegetables	\N	\N
53	3	Pepper Mix 1kg	3100.00	\N	In Stock	\N	https://picsum.photos/seed/peppermix/400/400	PEPPER001	{SpiceBlend}	{1kg}	{https://picsum.photos/seed/peppermix-thumb/200/200}	flour	Vegetables	Peppers	\N	\N	2025-10-19 18:32:18.98735	Grains & Staples	\N	\N
54	3	Milo Refill 500g	4200.00	3800.00	In Stock	\N	/08/milo-image.jpg	MILO001	{Nestlé}	{500g}	{/04/product-image-109-346x310.jpg}	chocholate	Beverages	Chocolate Drinks	\N	\N	2025-10-19 18:32:18.98735	Groceries	\N	\N
55	3	Omo Detergent 1.5kg	3600.00	\N	In Stock	\N	https://picsum.photos/seed/omo-detergent/400/400	OMO001	{Unilever}	{1.5kg}	{https://picsum.photos/seed/omo-detergent-thumb/200/200}	detergent	Cleaning Supplies	Laundry	\N	\N	2025-10-19 18:32:18.98735	Home Essentials	\N	\N
56	3	Coconut Oil 1L	5900.00	5500.00	In Stock	\N	/08/coconut-oil-image.jpg	COCOIL001	{PureGlow}	{1L}	{/04/product-image-110-346x310.jpg}	oil	Oils & Fats	Oils	\N	\N	2025-10-19 18:32:18.98735	Oils & Fats	\N	\N
57	3	Suya Spice 100g	900.00	\N	New	\N	https://picsum.photos/seed/suya-spice/400/400	SUYASP001	{SpiceKing}	{100g}	{https://picsum.photos/seed/suya-spice-thumb/200/200}	suya_spice	Baking & Sweets	Spices	\N	\N	2025-10-19 18:32:18.98735	Cooking Essentials	\N	\N
\.


--
-- Data for Name: itemlist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.itemlist (id, name, language, icon) FROM stdin;
1	Apple	en	apple.png
2	Banana	en	bananas.png
3	Beef	en	bacon.png
4	Bread	en	bread.png
5	Butter	en	butter.png
6	Cheese	en	cheese.png
7	Chicken	en	chicken.png
8	Coke	en	pop.png
9	Cucumber	en	cucumber.png
10	Eggs	en	eggs.png
11	Flour	en	cereal.png
12	Milk	en	milk.png
13	Toiletpaper	en	toilet_paper.png
14	Tomato	en	tomato.png
20	Yogurt	en	yogurt.png
\.


--
-- Data for Name: product_ads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_ads (id, image, title, subtitle, price, offer, hotkey, created_at, updated_at, city) FROM stdin;
1	slider-image-1.jpg	Specialist in the grocery store	Only this week. Don’t miss...	₦599.99	-20% OFF	Exclusive offer	2025-11-07 12:25:41.033523	2025-11-07 12:25:41.033523	Ojo
2	slider-image-2.jpg	Fresh Produce Sale	Grab it before it's gone!	₦499.99	-15% OFF	Awoof promo	2025-11-07 12:25:41.033523	2025-11-07 12:25:41.033523	Ojo
3	slider-image-3.jpg	Organic Goodies	Healthy and Affordable	₦999.99	-10% OFF	Jollof offer	2025-11-07 12:25:41.033523	2025-11-07 12:25:41.033523	Ojo
4	slider-image-1.jpg	light your home	light your home dont wait for nepa !! 	₦899.99	-30% off	Christmas bonus	2025-12-10 00:08:34.436666	2025-12-10 00:08:34.436666	Ojo
\.


--
-- Data for Name: product_banner; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_banner (id, headline, title, subtitle, image, city, created_at, updated_at, product_id) FROM stdin;
1	WEEKEND DISCOUNT 40%	Legumes & Cereals	Feed your family the best	bacola-banner-02.jpg\n	Ojo	2025-11-07 19:36:09.867848	2025-11-07 19:36:09.867848	1
2	WEEKEND DISCOUNT 60%	Diary & Eggs	A differnt kind of grocery store	bacola-banner-01.jpg\n	Ojo	2025-11-07 19:39:35.71714	2025-11-07 19:39:35.71714	5
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: store_ads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_ads (id, src, alt, title, description, created_at, city) FROM stdin;
1	/assets/slide1.jpg	Professional delivery service	We ship the next day	For purchases over $20	2025-10-01 06:54:34.19724	Ojo
2	/assets/slide2.jpg	Modern logistics center	State-of-the-Art Facilities	Advanced warehousing and distribution technology	2025-10-01 06:54:34.19724	Ojo
3	/assets/slide3.jpg	Happy customers receiving packages	Customer Satisfaction	Bringing joy to your doorstep	2025-10-01 06:54:34.19724	Ojo
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stores (id, store_name, image_url, status, featured, logo, city, address, categories, location, created_at, opening_hours) FROM stdin;
1	Twin Faja	/flyers/2148155405.jpg	Until Tuesday	t	/flyers/73940907_9824633.jpg	Ojo	Ipaiye Bus/Stop 25 Km 4, Lasu-Isheri Express Road, Ojo, Lagos	{Groceries}	0101000020E61000003E8F52217598094028ED7D0BEEF71940	2025-09-26 07:35:57.073995	Mon–Sun: 8am – 9pm
2	Penafort	/flyers/2148155405.jpg	Until Tuesday	t	/flyers/2148155405.jpg	Ojo	Shop 28, Seamans Ventures, Lasu Rd, behind Mba Block, Ojo, Lagos 102101, Lagos	{Groceries}	0101000020E610000033CB49D131990940855FF6FE5FEF1940	2025-09-26 15:04:47.077614	Mon–Sun: 8am – 9pm
3	Twin Faja	/flyers/73940907_9824633.jpg	Until Sunday	t	/flyers/73940907_9824633.jpg	Ojo	Ojo, Lagos 102101, Lagos	{Groceries}	0101000020E61000007C7E18213C9A09401D7233DC80EF1940	2025-09-26 15:14:29.817622	Mon–Sun: 8am – 9pm
4	Best Price	/flyers/73940907_9824633.jpg	Until Tuesday	f	/flyers/73940907_9824633.jpg	Ikeja	Oba Akran Ave, ojo	{Electronics}	0101000020E61000001D5A643BDFCF0A4063EE5A423E681A40	2025-09-26 15:25:37.841085	Mon–Sun: 8am – 9pm
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, false);


--
-- Name: flyer_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flyer_products_id_seq', 60, true);


--
-- Name: itemlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.itemlist_id_seq', 20, true);


--
-- Name: product_ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_ads_id_seq', 4, true);


--
-- Name: product_banner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_banner_id_seq', 4, true);


--
-- Name: store_ads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_ads_id_seq', 9, true);


--
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stores_id_seq', 5, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: flyer_products flyer_products_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyer_products
    ADD CONSTRAINT flyer_products_item_id_key UNIQUE (item_id);


--
-- Name: flyer_products flyer_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyer_products
    ADD CONSTRAINT flyer_products_pkey PRIMARY KEY (id);


--
-- Name: itemlist itemlist_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itemlist
    ADD CONSTRAINT itemlist_name_key UNIQUE (name);


--
-- Name: itemlist itemlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.itemlist
    ADD CONSTRAINT itemlist_pkey PRIMARY KEY (id);


--
-- Name: product_ads product_ads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_ads
    ADD CONSTRAINT product_ads_pkey PRIMARY KEY (id);


--
-- Name: product_banner product_banner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_banner
    ADD CONSTRAINT product_banner_pkey PRIMARY KEY (id);


--
-- Name: store_ads store_ads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_ads
    ADD CONSTRAINT store_ads_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: flyer_products flyer_products_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.flyer_products
    ADD CONSTRAINT flyer_products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: product_banner product_banner_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_banner
    ADD CONSTRAINT product_banner_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.flyer_products(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict sjgJzlCQIqoL0OnpYFDCay87TZUpZfccyc8qR47yrlmVJwraIl2RgBgj5PzEV0E


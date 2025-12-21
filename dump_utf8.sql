--
-- PostgreSQL database dump
--

\restrict QbEzcZB3CjvUkha5ahcHytV4fa9PzBWu77gatsujXFWnu5J43oKAkqHanJu1hVk

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Admin" (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role text DEFAULT 'admin'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Admin_id_seq" OWNED BY public."Admin".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Admin" ALTER COLUMN id SET DEFAULT nextval('public."Admin_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Admin" (id, username, email, "passwordHash", role, "createdAt") FROM stdin;
1	kikhub	noruw19@gmail.com	$2b$10$b/SEUeEGjmKq1a1ITjU5FeoNzeDXAmYCMYm1ZpPhF8uGg2R1ytLuK	admin	2025-11-26 12:33:44.826
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b5fbda65-93da-49d5-94ec-7a5701f6a61a	21150e6baf3265dfda42e4f19048a27ac526192164696326ecb923be4cc5b26b	2025-11-25 13:32:20.436523+01	20251125123220_init	\N	\N	2025-11-25 13:32:20.049414+01	1
\.


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Admin_id_seq"', 1, true);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Admin_email_key" ON public."Admin" USING btree (email);


--
-- Name: Admin_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Admin_username_key" ON public."Admin" USING btree (username);


--
-- PostgreSQL database dump complete
--

\unrestrict QbEzcZB3CjvUkha5ahcHytV4fa9PzBWu77gatsujXFWnu5J43oKAkqHanJu1hVk



ALTER SCHEMA public OWNER TO pg_database_owner;

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'completed',
    'cancelled',
    'paid'
);


ALTER TYPE public.order_status OWNER TO postgres;

CREATE TYPE public.payment_provider AS ENUM (
    'mercadopago'
);


ALTER TYPE public.payment_provider OWNER TO postgres;

CREATE TYPE public.payment_status AS ENUM (
    'pending',
    'approved',
    'authorized',
    'in_process',
    'in_mediation',
    'rejected',
    'cancelled',
    'refunded',
    'charged_back'
);


ALTER TYPE public.payment_status OWNER TO postgres;

COMMENT ON TYPE public.payment_status IS 'Estados de pago de MercadoPago';

SET default_tablespace = '';

SET default_table_access_method = heap;

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

COMMENT ON TABLE public.orders IS 'Orden de compra de un producto';

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    status public.payment_status DEFAULT 'pending'::public.payment_status NOT NULL,
    provider public.payment_provider NOT NULL,
    provider_id text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    order_id uuid NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

COMMENT ON TABLE public.payments IS 'Pagos de ordenes';

CREATE TABLE public.product_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    resource_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

COMMENT ON TABLE public.product_images IS 'Imagenes de un producto';

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    image_url character varying NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    download_url text NOT NULL,
    pathname character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    thumbnail_url character varying DEFAULT 'https://lidpjayvyknoodjfylaw.supabase.co/storage/v1/object/public/public-assets/products/default_no_image.png'::character varying NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

COMMENT ON TABLE public.products IS 'Productos a la venta';

COMMENT ON COLUMN public.products.download_url IS 'Url de descarga del recurso';


--
-- TOC entry 312 (class 1259 OID 17698)
-- Name: resources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    folder character varying DEFAULT 'recipe-ebooks'::character varying NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resources OWNER TO postgres;

--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE resources; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.resources IS 'Recursos del bucket';


--
-- TOC entry 313 (class 1259 OID 17706)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Usuarios que hicieron o intentaron hacer una compra';


--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 313
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.name IS 'Nombre del usuario';

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3765 (class 2606 OID 17735)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3767 (class 2606 OID 17737)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 3769 (class 2606 OID 17739)
-- Name: products products_pathname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pathname_key UNIQUE (pathname);


--
-- TOC entry 3771 (class 2606 OID 17741)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3773 (class 2606 OID 17743)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3775 (class 2606 OID 17745)
-- Name: resources resources_url_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_url_key UNIQUE (url);


--
-- TOC entry 3777 (class 2606 OID 17747)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3779 (class 2606 OID 17749)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3786 (class 2620 OID 17756)
-- Name: payments Send email and update order when payment is approved; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "Send email and update order when payment is approved" AFTER UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://soybelumont.com/api/resend/send-email-product', 'POST', '{"Content-type":"application/json"}', '{}', '5000');


--
-- TOC entry 3780 (class 2606 OID 17757)
-- Name: orders orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3781 (class 2606 OID 17762)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3782 (class 2606 OID 17767)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3783 (class 2606 OID 17772)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;


--
-- TOC entry 3784 (class 2606 OID 17777)
-- Name: product_images product_images_resource_url_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_resource_url_fkey FOREIGN KEY (resource_url) REFERENCES public.resources(url) ON UPDATE CASCADE;


--
-- TOC entry 3785 (class 2606 OID 17782)
-- Name: products products_download_url_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_download_url_fkey FOREIGN KEY (download_url) REFERENCES public.resources(url) ON UPDATE CASCADE;


--
-- TOC entry 3945 (class 3256 OID 17787)
-- Name: orders Enable create order for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable create order for service role" ON public.orders FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 3946 (class 3256 OID 17788)
-- Name: users Enable create users for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable create users for service role" ON public.users FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 3947 (class 3256 OID 17789)
-- Name: payments Enable insert for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable insert for service role" ON public.payments FOR INSERT TO service_role WITH CHECK (true);


--
-- TOC entry 3948 (class 3256 OID 17790)
-- Name: orders Enable read access for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for service role" ON public.orders FOR SELECT TO service_role USING (true);


--
-- TOC entry 3949 (class 3256 OID 17791)
-- Name: payments Enable read access for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for service role" ON public.payments FOR SELECT TO service_role USING (true);


--
-- TOC entry 3950 (class 3256 OID 17792)
-- Name: products Enable read access for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for service role" ON public.products FOR SELECT TO service_role USING (true);


--
-- TOC entry 3951 (class 3256 OID 17793)
-- Name: resources Enable read access for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for service role" ON public.resources FOR SELECT TO service_role USING (true);


--
-- TOC entry 3952 (class 3256 OID 17794)
-- Name: users Enable read access for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read access for service role" ON public.users FOR SELECT TO service_role USING (true);


--
-- TOC entry 3953 (class 3256 OID 17795)
-- Name: orders Enable update for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for service role" ON public.orders FOR UPDATE TO service_role USING (true);


--
-- TOC entry 3954 (class 3256 OID 17796)
-- Name: payments Enable update for service role; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for service role" ON public.payments FOR UPDATE TO service_role USING (true);


--
-- TOC entry 3939 (class 0 OID 17668)
-- Dependencies: 308
-- Name: orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3940 (class 0 OID 17675)
-- Dependencies: 309
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3941 (class 0 OID 17684)
-- Dependencies: 310
-- Name: product_images; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3942 (class 0 OID 17691)
-- Dependencies: 311
-- Name: products; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3943 (class 0 OID 17698)
-- Dependencies: 312
-- Name: resources; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3944 (class 0 OID 17706)
-- Dependencies: 313
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 18
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;


--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;


--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE product_images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_images TO anon;
GRANT ALL ON TABLE public.product_images TO authenticated;
GRANT ALL ON TABLE public.product_images TO service_role;


--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 311
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;


--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE resources; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.resources TO anon;
GRANT ALL ON TABLE public.resources TO authenticated;
GRANT ALL ON TABLE public.resources TO service_role;


--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 313
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- TOC entry 2564 (class 826 OID 16488)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2540 (class 826 OID 16489)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2565 (class 826 OID 16487)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2542 (class 826 OID 16491)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2566 (class 826 OID 16486)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2541 (class 826 OID 16490)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


-- Completed on 2025-08-07 01:30:49 -03

--
-- PostgreSQL database dump complete
--


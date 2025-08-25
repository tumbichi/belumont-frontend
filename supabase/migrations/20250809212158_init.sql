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

COMMENT ON COLUMN public.products.download_url IS 'Url de descarga del recurso';CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    folder character varying DEFAULT 'recipe-ebooks'::character varying NOT NULL,
    url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.resources OWNER TO postgres;


COMMENT ON TABLE public.resources IS 'Recursos del bucket';CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;


COMMENT ON TABLE public.users IS 'Usuarios que hicieron o intentaron hacer una compra';COMMENT ON COLUMN public.users.name IS 'Nombre del usuario';

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pathname_key UNIQUE (pathname);ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_url_key UNIQUE (url);ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);CREATE TRIGGER "Send email and update order when payment is approved" AFTER UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://soybelumont.com/api/resend/send-email-product', 'POST', '{"Content-type":"application/json"}', '{}', '5000');ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE;ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_resource_url_fkey FOREIGN KEY (resource_url) REFERENCES public.resources(url) ON UPDATE CASCADE;ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_download_url_fkey FOREIGN KEY (download_url) REFERENCES public.resources(url) ON UPDATE CASCADE;CREATE POLICY "Enable create order for service role" ON public.orders FOR INSERT TO service_role WITH CHECK (true);CREATE POLICY "Enable create users for service role" ON public.users FOR INSERT TO service_role WITH CHECK (true);CREATE POLICY "Enable insert for service role" ON public.payments FOR INSERT TO service_role WITH CHECK (true);CREATE POLICY "Enable read access for service role" ON public.orders FOR SELECT TO service_role USING (true);CREATE POLICY "Enable read access for service role" ON public.payments FOR SELECT TO service_role USING (true);CREATE POLICY "Enable read access for service role" ON public.products FOR SELECT TO service_role USING (true);CREATE POLICY "Enable read access for service role" ON public.resources FOR SELECT TO service_role USING (true);CREATE POLICY "Enable read access for service role" ON public.users FOR SELECT TO service_role USING (true);CREATE POLICY "Enable update for service role" ON public.orders FOR UPDATE TO service_role USING (true);CREATE POLICY "Enable update for service role" ON public.payments FOR UPDATE TO service_role USING (true);ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;


ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;GRANT ALL ON TABLE public.orders TO anon;
GRANT ALL ON TABLE public.orders TO authenticated;
GRANT ALL ON TABLE public.orders TO service_role;GRANT ALL ON TABLE public.payments TO anon;
GRANT ALL ON TABLE public.payments TO authenticated;
GRANT ALL ON TABLE public.payments TO service_role;GRANT ALL ON TABLE public.product_images TO anon;
GRANT ALL ON TABLE public.product_images TO authenticated;
GRANT ALL ON TABLE public.product_images TO service_role;GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;GRANT ALL ON TABLE public.resources TO anon;
GRANT ALL ON TABLE public.resources TO authenticated;
GRANT ALL ON TABLE public.resources TO service_role;GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;
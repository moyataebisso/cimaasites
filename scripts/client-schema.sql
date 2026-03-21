SET search_path TO {{SCHEMA}};

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  value text,
  value_json jsonb,
  updated_by uuid,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT site_settings_key_unique UNIQUE (key)
);

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  source text DEFAULT 'contact_form',
  status text DEFAULT 'new',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text NOT NULL,
  business_name text,
  request_type text DEFAULT 'general',
  description text NOT NULL,
  status text DEFAULT 'pending',
  priority text DEFAULT 'normal',
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  mime_type text,
  size_bytes integer,
  uploaded_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  price integer DEFAULT 0,
  currency text DEFAULT 'usd',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS booking_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  bio text,
  avatar_url text,
  active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS booking_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid REFERENCES {{SCHEMA}}.booking_staff ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES {{SCHEMA}}.booking_services,
  staff_id uuid REFERENCES {{SCHEMA}}.booking_staff,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  stripe_payment_id text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_double_booking UNIQUE (staff_id, start_time)
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price integer NOT NULL DEFAULT 0,
  compare_price integer,
  images text[] DEFAULT '{}',
  category text,
  tags text[] DEFAULT '{}',
  inventory integer DEFAULT 0,
  track_inventory boolean DEFAULT true,
  is_active boolean DEFAULT true,
  is_digital boolean DEFAULT false,
  digital_file_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  items jsonb NOT NULL,
  subtotal integer NOT NULL,
  shipping integer DEFAULT 0,
  tax integer DEFAULT 0,
  total integer NOT NULL,
  status text DEFAULT 'pending',
  stripe_payment_id text UNIQUE,
  shipping_address jsonb,
  tracking_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  status text DEFAULT 'draft',
  category text,
  tags text[] DEFAULT '{}',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_email text NOT NULL,
  rating integer CHECK (rating BETWEEN 1 AND 5) NOT NULL,
  content text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_image text,
  location text,
  is_virtual boolean DEFAULT false,
  virtual_link text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  capacity integer,
  price integer DEFAULT 0,
  status text DEFAULT 'upcoming',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  status text DEFAULT 'subscribed',
  source text,
  subscribed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true
);

ALTER TABLE {{SCHEMA}}.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{SCHEMA}}.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{SCHEMA}}.appointments ENABLE ROW LEVEL SECURITY;

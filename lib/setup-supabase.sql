-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),

  -- Business info
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  alt_phone TEXT,

  -- Registered address
  registered_address TEXT NOT NULL,
  registered_city TEXT NOT NULL,
  registered_state TEXT NOT NULL,
  registered_pincode TEXT NOT NULL,

  -- Warehouse address
  warehouse_same_as_registered BOOLEAN DEFAULT false,
  warehouse_address TEXT,
  warehouse_city TEXT,
  warehouse_state TEXT,
  warehouse_pincode TEXT,

  -- Brand & products
  brand_name TEXT NOT NULL,
  product_categories TEXT[] DEFAULT '{}',
  estimated_products TEXT,
  preferred_tier TEXT,
  business_description TEXT,
  website TEXT,
  social_links TEXT,

  -- Compliance
  gstin TEXT,
  fssai_number TEXT,

  -- Consent
  consent_accepted BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,

  -- Admin
  admin_notes TEXT
);

-- Vendor documents table
CREATE TABLE IF NOT EXISTS vendor_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public form submission)
CREATE POLICY "Allow public insert" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert docs" ON vendor_documents FOR INSERT WITH CHECK (true);

-- Policy: Only service role can read/update/delete (admin dashboard uses service key)
-- No SELECT/UPDATE/DELETE policies for anon = admin must use service_role key

-- Create storage bucket for vendor documents
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-docs', 'vendor-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow public uploads to vendor-docs bucket
CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'vendor-docs');

-- Storage policy: Only service role can read (admin viewing docs)
-- No SELECT policy for anon = files are private

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://miydvjprpcygvcaxrlpu.supabase.co",
  "sb_secret_yLdZojoww8Qcnkj2L0tv_g_zgQaKBsy"
);

async function setup() {
  console.log("Setting up database...");

  // Create vendors table
  const { error: vendorsErr } = await supabase.rpc("exec_sql", {
    sql: `SELECT 1;`,
  });

  // Since we can't run raw SQL via REST, let's test by trying to insert and read
  // First, let's check if the table exists by trying to select from it
  const { data, error } = await supabase.from("vendors").select("id").limit(1);

  if (error && error.code === "42P01") {
    console.log("Table 'vendors' does not exist. Please run the SQL from lib/setup-supabase.sql in the Supabase Dashboard SQL Editor.");
    console.log("Go to: https://supabase.com/dashboard → Your project → SQL Editor → New Query → Paste the SQL → Run");
  } else if (error) {
    console.log("Error:", error.message);
  } else {
    console.log("✅ Table 'vendors' exists!");
  }

  // Check vendor_documents
  const { error: docsErr } = await supabase.from("vendor_documents").select("id").limit(1);
  if (docsErr && docsErr.code === "42P01") {
    console.log("Table 'vendor_documents' does not exist.");
  } else if (docsErr) {
    console.log("vendor_documents error:", docsErr.message);
  } else {
    console.log("✅ Table 'vendor_documents' exists!");
  }

  // Check storage bucket
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) {
    console.log("Storage error:", bucketsErr.message);
  } else {
    const vendorBucket = buckets?.find(b => b.name === "vendor-docs");
    if (vendorBucket) {
      console.log("✅ Storage bucket 'vendor-docs' exists!");
    } else {
      console.log("Creating 'vendor-docs' bucket...");
      const { error: createErr } = await supabase.storage.createBucket("vendor-docs", { public: false });
      if (createErr) {
        console.log("Bucket creation error:", createErr.message);
      } else {
        console.log("✅ Storage bucket 'vendor-docs' created!");
      }
    }
  }
}

setup();

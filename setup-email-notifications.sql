-- ============================================================
-- SUPABASE EMAIL NOTIFICATION SETUP
-- ============================================================
-- Run these SQL queries in Supabase SQL Editor
-- Copy each section and paste into the editor, then click Run
-- ============================================================

-- STEP 1: Enable the http extension (required for calling Edge Functions)
CREATE EXTENSION IF NOT EXISTS http;

-- STEP 2: Create the trigger function
CREATE OR REPLACE FUNCTION notify_subscribers_of_new_post()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  jwt_token TEXT;
BEGIN
  -- Replace with your actual Edge Function URL
  -- Find it in Supabase Dashboard → Edge Functions → send-post-notification
  function_url := 'https://tbgjqbwyvzvqnhoxjmid.supabase.co/functions/v1/send-post-notification';
  
  -- Call the Edge Function via HTTP POST
  PERFORM
    net.http_post(
      url := function_url,
      body := jsonb_build_object(
        'post_id', NEW.id,
        'title', NEW.title,
        'excerpt', NEW.excerpt,
        'author', NEW.author
      ),
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      timeout_milliseconds := 5000
    );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't prevent the post from being created
  RAISE WARNING 'Failed to notify subscribers: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Create the trigger on blog_posts table
-- This trigger will fire whenever a new blog post is inserted
DROP TRIGGER IF EXISTS trigger_notify_subscribers ON blog_posts;
CREATE TRIGGER trigger_notify_subscribers
  AFTER INSERT ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_subscribers_of_new_post();

-- STEP 4: Verify the setup
-- Run this to check if the trigger exists:
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_notify_subscribers';

-- ============================================================
-- OPTIONAL: Create email_logs table to track notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_email TEXT NOT NULL,
  post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL,
  post_title TEXT,
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_logs_post_id ON email_logs(post_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON email_logs(created_at DESC);

-- ============================================================
-- OPTIONAL: Create view to see email statistics
-- ============================================================

CREATE OR REPLACE VIEW email_stats AS
SELECT 
  COUNT(*) as total_emails,
  COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
FROM email_logs;

-- ============================================================
-- IMPORTANT REMINDERS:
-- ============================================================
-- 1. Replace 'YOUR_PROJECT_ID' with your actual Supabase project ID
--    Find it in: Supabase Dashboard → Edge Functions → send-post-notification (copy the URL)
-- 
-- 2. Make sure you've created the Edge Function 'send-post-notification'
--    (See SUPABASE_EMAIL_SETUP.md for instructions)
--
-- 3. Add RESEND_API_KEY to the Edge Function secrets
--    (Supabase Dashboard → Edge Functions → send-post-notification → Secrets)
--
-- 4. Test by creating a new blog post in the blog_posts table
--    Check the Edge Function logs to verify it's working
--
-- ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

console.log("🚀 Edge Function initializing...");
console.log("✅ BREVO_API_KEY present:", !!BREVO_API_KEY);

serve(async (req) => {
  try {
    console.log("📥 Received request");
    const { post_id, title, excerpt, author, post_url } = await req.json();
    console.log("📝 Post:", { title, excerpt, author, post_url });

    if (!title || !excerpt || !author) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: title, excerpt, author" }),
        { status: 400 }
      );
    }

    if (!BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY not found!");
      return new Response(
        JSON.stringify({ error: "BREVO_API_KEY not configured" }),
        { status: 500 }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ Supabase credentials missing");
      return new Response(
        JSON.stringify({ error: "Supabase credentials not configured" }),
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: subscribers, error: subError } = await supabase
      .from("subscribers")
      .select("email");

    if (subError) {
      console.error("❌ Error fetching subscribers:", subError);
      throw subError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("⚠️ No subscribers found");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No subscribers to notify",
          sent: 0 
        }),
        { status: 200 }
      );
    }

    console.log(`📧 Found ${subscribers.length} subscriber(s). Sending emails...`);

    const emailPromises = subscribers.map(async (subscriber) => {
      console.log(`\n📬 Sending to: ${subscriber.email}`);
      
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: {
            name: "offRoute Chronicles",
            email: "iamskr2002@gmail.com"
          },
          to: [
            {
              email: subscriber.email,
              name: "Subscriber"
            }
          ],
          subject: `📍 New Story: ${title}`,
          htmlContent: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f7f4;">
              <div style="background: linear-gradient(135deg, #c17f59 0%, #a66b48 100%); padding: 40px 20px; text-align: center; color: white;">
                <h2 style="margin: 0; font-size: 28px;">📍 New Story Published!</h2>
              </div>
              
              <div style="padding: 40px 20px;">
                <p style="margin-top: 0; font-size: 16px; color: #333;">
                  Hi Traveler,
                </p>
                
                <p style="color: #666; line-height: 1.6;">
                  A new travel story has been added to offRoute Chronicles. Check it out!
                </p>
                
                <div style="background-color: #fff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #c17f59;">
                  <h3 style="margin: 0 0 10px 0; color: #c17f59; font-size: 20px;">${title}</h3>
                  <p style="margin: 0 0 15px 0; color: #666; font-size: 14px; line-height: 1.6;">${excerpt}</p>
                  <p style="margin: 0; font-size: 12px; color: #999;">
                    <strong>By:</strong> ${author}
                  </p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${post_url || 'https://blog.subhamkumarraya.com.np/stories'}" 
                     style="background-color: #c17f59; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; transition: background-color 0.3s;">
                    Read the Full Story
                  </a>
                </div>
                
                <p style="color: #999; font-size: 13px; line-height: 1.6;">
                  Explore more stories and destinations at offRoute Chronicles. Every journey tells a story.
                </p>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
                  © 2024 offRoute Chronicles. All rights reserved.
                </p>
                <p style="margin: 0; font-size: 11px; color: #bbb;">
                  You're receiving this because you subscribed to our newsletter.
                </p>
              </div>
            </div>
          `,
        }),
      });

      const text = await response.text();
      console.log(`Response status: ${response.status}`);
      console.log(`Raw response: ${text}`);
      
      let responseData;
      try {
        responseData = JSON.parse(text);
      } catch (e) {
        console.error(`Failed to parse response: ${text}`);
        throw new Error(`Invalid response: ${text}`);
      }
      
      if (!response.ok) {
        console.error(`❌ Failed to send to ${subscriber.email}: ${response.status}`, responseData);
        throw new Error(`${response.status}: ${JSON.stringify(responseData)}`);
      }
      
      console.log(`✅ Sent to ${subscriber.email}`, responseData);
      return responseData;
    });

    const results = await Promise.allSettled(emailPromises);
    const successfulEmails = results.filter((r) => r.status === "fulfilled").length;
    const failedEmails = results.filter((r) => r.status === "rejected").length;

    console.log(`\n✅ Results: ${successfulEmails} sent, ${failedEmails} failed`);
    
    if (failedEmails > 0) {
      results.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(`  ❌ Subscriber ${i}: ${r.reason}`);
        }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification sent to ${successfulEmails} subscriber(s)`,
        sent: successfulEmails,
        failed: failedEmails,
        total: subscribers.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        success: false 
      }),
      { status: 500 }
    );
  }
});

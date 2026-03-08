import { NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabase-client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, organization, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Store submission in Supabase
    if (!supabaseServerClient) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseServerClient
      .from("contact_submissions")
      .insert({
        name,
        email,
        organization: organization || null,
        message,
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error storing contact submission:", error);
      return NextResponse.json(
        { error: "Failed to submit form. Please try again." },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      console.log("Attempting to send email with RESEND_API_KEY:", process.env.RESEND_API_KEY ? "Key exists" : "No key");
      if (process.env.RESEND_API_KEY) {
        const emailResult = await resend.emails.send({
          from: "PSHKRV <onboarding@resend.dev>",
          to: "iuliia.vorobiova@gmail.com",
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization || "Not provided"}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
            <hr>
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
          `,
        });
        console.log("Email sent successfully:", emailResult);
      } else {
        console.log("RESEND_API_KEY not found, skipping email");
      }
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the form submission if email fails
    }

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

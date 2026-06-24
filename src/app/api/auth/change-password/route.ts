import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  // Only authenticated admins can change the password
  const authenticated = checkAuth();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    // Verify current password
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const expectedEmail = process.env.ADMIN_EMAIL;

    if (!expectedPassword || !expectedEmail) {
      return NextResponse.json({ error: "Server credentials not configured" }, { status: 500 });
    }

    if (currentPassword !== expectedPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    // Update .env.local file
    const envPath = path.join(process.cwd(), ".env.local");

    let envContent = "";
    try {
      envContent = fs.readFileSync(envPath, "utf-8");
    } catch {
      // If .env.local doesn't exist, create it
      envContent = `ADMIN_EMAIL=${expectedEmail}\nADMIN_PASSWORD=${expectedPassword}\n`;
    }

    // Replace the ADMIN_PASSWORD line
    const lines = envContent.split("\n");
    const updatedLines = lines.map((line) => {
      if (line.startsWith("ADMIN_PASSWORD=")) {
        return `ADMIN_PASSWORD=${newPassword}`;
      }
      return line;
    });

    // If ADMIN_PASSWORD line didn't exist, add it
    if (!lines.some((l) => l.startsWith("ADMIN_PASSWORD="))) {
      updatedLines.push(`ADMIN_PASSWORD=${newPassword}`);
    }

    fs.writeFileSync(envPath, updatedLines.join("\n"), "utf-8");

    return NextResponse.json({ success: true, message: "Password changed successfully! Please log in again." });
  } catch {
    return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
  }
}

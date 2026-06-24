import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkAuth } from "@/lib/auth";

const dataFile = path.join(process.cwd(), "src", "data", "about.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFile, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load about data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.typingWords || !data.roles || !data.description) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "About data updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}

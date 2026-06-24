import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/designs.json");

function getDesigns() {
  try {
    if (!fs.existsSync(filePath)) {
      console.log("Designs file does not exist at path:", filePath);
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing designs.json:", error);
    return [];
  }
}

function saveDesigns(data: any) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const designs = getDesigns();
  console.log("API /api/designs request processed. Items found:", designs.length);
  return NextResponse.json(designs);
}

export async function POST(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { design, originalTitle } = await req.json();
    const designs = getDesigns();

    if (originalTitle) {
      // Update existing design
      const idx = designs.findIndex((d: any) => d.title.toLowerCase() === originalTitle.toLowerCase());
      if (idx !== -1) {
        designs[idx] = design;
      } else {
        designs.push(design);
      }
    } else {
      // Add new design
      const exists = designs.some((d: any) => d.title.toLowerCase() === design.title.toLowerCase());
      if (exists) {
        return NextResponse.json({ error: "Design with this title already exists" }, { status: 400 });
      }
      designs.push(design);
    }

    saveDesigns(designs);
    return NextResponse.json({ success: true, designs });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save design data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = req;
    const { searchParams } = new URL(url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json({ error: "Design title parameter is required" }, { status: 400 });
    }

    const designs = getDesigns();
    const filtered = designs.filter((d: any) => d.title.toLowerCase() !== title.toLowerCase());

    saveDesigns(filtered);
    return NextResponse.json({ success: true, designs: filtered });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete design data" }, { status: 500 });
  }
}

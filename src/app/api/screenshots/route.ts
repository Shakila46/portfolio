import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

const screenshotsBase = path.join(process.cwd(), "public/screenshots");

function sanitizeTitle(title: string) {
  // Replace spaces and special chars for safe folder names
  return title.replace(/[^a-zA-Z0-9\-_]/g, "_");
}

export async function POST(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const projectTitle = formData.get("projectTitle") as string;
    const file = formData.get("file") as File;

    if (!projectTitle || !file) {
      return NextResponse.json({ error: "projectTitle and file are required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only image files are allowed (JPG, PNG, WebP, GIF)" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 5MB" }, { status: 400 });
    }

    // Create project directory using the original title (folder already exists)
    const projectDir = path.join(screenshotsBase, projectTitle);
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const filename = `screenshot_${timestamp}.${ext}`;
    const filePath = path.join(projectDir, filename);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Update projects.json to add screenshot filename
    const projectsPath = path.join(process.cwd(), "src/data/projects.json");
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = projects.find((p: any) => p.title === projectTitle);
    if (project) {
      if (!project.screenshots) project.screenshots = [];
      project.screenshots.push(filename);
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf8");
    }

    return NextResponse.json({ success: true, filename });
  } catch (e) {
    console.error("Screenshot upload error:", e);
    return NextResponse.json({ error: "Failed to upload screenshot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const projectTitle = searchParams.get("project");
    const filename = searchParams.get("filename");

    if (!projectTitle || !filename) {
      return NextResponse.json({ error: "project and filename are required" }, { status: 400 });
    }

    // Security: prevent path traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    const filePath = path.join(screenshotsBase, projectTitle, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update projects.json to remove screenshot filename
    const projectsPath = path.join(process.cwd(), "src/data/projects.json");
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const project = projects.find((p: any) => p.title === projectTitle);
    if (project && project.screenshots) {
      project.screenshots = project.screenshots.filter((s: string) => s !== filename);
      fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), "utf8");
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Screenshot delete error:", e);
    return NextResponse.json({ error: "Failed to delete screenshot" }, { status: 500 });
  }
}

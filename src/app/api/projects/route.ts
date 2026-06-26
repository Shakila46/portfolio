import { NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/projects.json");

function getProjects() {
  try {
    if (!fs.existsSync(filePath)) {
      console.log("Projects file does not exist at path:", filePath);
      return [];
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing projects.json:", error);
    return [];
  }
}

function saveProjects(data: any) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  const projects = getProjects();
  console.log("API /api/projects request processed. Items found:", projects.length);
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!checkAuth()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { project, originalTitle } = await req.json();
    const projects = getProjects();

    if (originalTitle) {
      // Update existing project
      const idx = projects.findIndex((p: any) => p.title.toLowerCase() === originalTitle.toLowerCase());
      if (idx !== -1) {
        // Preserve existing screenshots when updating
        const existingScreenshots = projects[idx].screenshots || [];
        projects[idx] = { ...project, screenshots: existingScreenshots };
      } else {
        projects.push({ ...project, screenshots: [] });
      }
    } else {
      // Add new project
      const exists = projects.some((p: any) => p.title.toLowerCase() === project.title.toLowerCase());
      if (exists) {
        return NextResponse.json({ error: "Project with this title already exists" }, { status: 400 });
      }
      projects.push({ ...project, screenshots: [] });
    }

    saveProjects(projects);
    return NextResponse.json({ success: true, projects });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save project data" }, { status: 500 });
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
      return NextResponse.json({ error: "Project title parameter is required" }, { status: 400 });
    }

    const projects = getProjects();
    const filtered = projects.filter((p: any) => p.title.toLowerCase() !== title.toLowerCase());

    saveProjects(filtered);
    return NextResponse.json({ success: true, projects: filtered });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete project data" }, { status: 500 });
  }
}

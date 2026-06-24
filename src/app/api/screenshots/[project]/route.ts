import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const screenshotsBase = path.join(process.cwd(), "public/screenshots");

export async function GET(
  req: Request,
  { params }: { params: { project: string } }
) {
  try {
    const projectTitle = decodeURIComponent(params.project);
    const projectDir = path.join(screenshotsBase, projectTitle);

    if (!fs.existsSync(projectDir)) {
      return NextResponse.json({ screenshots: [] });
    }

    const files = fs.readdirSync(projectDir).filter((f) => {
      const ext = f.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
    });

    return NextResponse.json({ screenshots: files });
  } catch (e) {
    return NextResponse.json({ screenshots: [] });
  }
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminDashboard from "./AdminDashboard";

export default function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_session")?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) {
    redirect("/login");
  }

  return <AdminDashboard />;
}

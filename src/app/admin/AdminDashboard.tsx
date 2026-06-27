"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  icon: string;
  title: string;
  gh: string;
  figma: string | null;
  desc: string;
  stack: string[];
  screenshots: string[];
  demo?: string | null;
}

interface Design {
  title: string;
  figma: string;
  thumb?: string;
  desc: string;
  tags: string[];
  color: string;
}

interface AboutData {
  name: string;
  typingWords: string[];
  roles: { text: string; className: string }[];
  description: string;
  cvLink: string;
  avatar: string;
  floatingTags: { text: string; color: string; className: string }[];
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "designs" | "security" | "about">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Project form state
  const [projectForm, setProjectForm] = useState({
    icon: "🌱",
    title: "",
    gh: "",
    figma: "",
    demo: "",
    desc: "",
    stack: "",
  });
  const [editingProjectTitle, setEditingProjectTitle] = useState<string | null>(null);

  // Screenshot management state
  const [screenshotManagerProject, setScreenshotManagerProject] = useState<Project | null>(null);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [screenshotDeleting, setScreenshotDeleting] = useState<string | null>(null);

  // Design form state
  const [designForm, setDesignForm] = useState({
    title: "",
    figma: "",
    desc: "",
    tags: "",
    color: "#00e5a0",
  });
  const [editingDesignTitle, setEditingDesignTitle] = useState<string | null>(null);

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // About form state
  const [aboutForm, setAboutForm] = useState<AboutData>({
    name: "",
    typingWords: [],
    roles: [],
    description: "",
    cvLink: "",
    avatar: "",
    floatingTags: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, desRes, aboutRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/designs"),
        fetch("/api/about"),
      ]);
      if (projRes.ok && desRes.ok && aboutRes.ok) {
        const projData = await projRes.json();
        const desData = await desRes.json();
        const abData = await aboutRes.json();
        setProjects(projData);
        setDesigns(desData);
        setAboutData(abData);
        setAboutForm(abData);
      }
    } catch {
      setError("Failed to fetch dynamic data stores.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch {
      setError("Logout failed");
    }
  };

  const showNotification = (msg: string, type: "success" | "error") => {
    if (type === "success") {
      setSuccess(msg);
      setError("");
      setTimeout(() => setSuccess(""), 4000);
    } else {
      setError(msg);
      setSuccess("");
      setTimeout(() => setError(""), 4000);
    }
  };

  // Project CRUD operations
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      project: {
        icon: projectForm.icon || "💻",
        title: projectForm.title,
        gh: projectForm.gh,
        figma: projectForm.figma || null,
        demo: projectForm.demo || null,
        desc: projectForm.desc,
        stack: projectForm.stack.split(",").map(t => t.trim()).filter(Boolean),
      },
      originalTitle: editingProjectTitle,
    };

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
        showNotification(editingProjectTitle ? "Project updated successfully!" : "Project added successfully!", "success");
        resetProjectForm();
      } else {
        showNotification(data.error || "Failed to submit project", "error");
      }
    } catch {
      showNotification("A network error occurred", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProject = (p: Project) => {
    setProjectForm({
      icon: p.icon,
      title: p.title,
      gh: p.gh,
      figma: p.figma || "",
      demo: p.demo || "",
      desc: p.desc,
      stack: p.stack.join(", "),
    });
    setEditingProjectTitle(p.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/projects?title=${encodeURIComponent(title)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
        showNotification("Project deleted successfully", "success");
      } else {
        showNotification(data.error || "Failed to delete project", "error");
      }
    } catch {
      showNotification("A network error occurred", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({ icon: "🌱", title: "", gh: "", figma: "", demo: "", desc: "", stack: "" });
    setEditingProjectTitle(null);
  };

  // Design CRUD operations
  const handleDesignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    // Extract figma file key for dynamic preview generation
    let figmaId = "thumbnail";
    if (designForm.figma.includes("file/")) {
      figmaId = designForm.figma.split("file/")[1]?.split("/")[0] || "thumbnail";
    } else if (designForm.figma.includes("design/")) {
      figmaId = designForm.figma.split("design/")[1]?.split("/")[0] || "thumbnail";
    }

    const payload = {
      design: {
        title: designForm.title,
        figma: designForm.figma,
        thumb: `https://www.figma.com/file/${figmaId}/thumbnail?node-id=0-1&in-better-link-exp=true`,
        desc: designForm.desc,
        tags: designForm.tags.split(",").map(t => t.trim()).filter(Boolean),
        color: designForm.color || "#00e5a0",
      },
      originalTitle: editingDesignTitle,
    };

    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setDesigns(data.designs);
        showNotification(editingDesignTitle ? "Design updated successfully!" : "Design added successfully!", "success");
        resetDesignForm();
      } else {
        showNotification(data.error || "Failed to submit design", "error");
      }
    } catch {
      showNotification("A network error occurred", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditDesign = (d: Design) => {
    setDesignForm({
      title: d.title,
      figma: d.figma,
      desc: d.desc,
      tags: d.tags.join(", "),
      color: d.color,
    });
    setEditingDesignTitle(d.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteDesign = async (title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/designs?title=${encodeURIComponent(title)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        setDesigns(data.designs);
        showNotification("Design deleted successfully", "success");
      } else {
        showNotification(data.error || "Failed to delete design", "error");
      }
    } catch {
      showNotification("A network error occurred", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const resetDesignForm = () => {
    setDesignForm({ title: "", figma: "", desc: "", tags: "", color: "#00e5a0" });
    setEditingDesignTitle(null);
  };

  // Screenshot management handlers
  const handleScreenshotUpload = async (projectTitle: string, files: FileList) => {
    if (!files || files.length === 0) return;
    setScreenshotUploading(true);
    const uploadedFilenames: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("projectTitle", projectTitle);
        formData.append("file", file);
        const res = await fetch("/api/screenshots", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          uploadedFilenames.push(data.filename);
        } else {
          showNotification(data.error || "Upload failed", "error");
        }
      }
      if (uploadedFilenames.length > 0) {
        // Update local state
        setProjects((prev) =>
          prev.map((p) =>
            p.title === projectTitle
              ? { ...p, screenshots: [...(p.screenshots || []), ...uploadedFilenames] }
              : p
          )
        );
        setScreenshotManagerProject((prev) =>
          prev && prev.title === projectTitle
            ? { ...prev, screenshots: [...(prev.screenshots || []), ...uploadedFilenames] }
            : prev
        );
        showNotification(`${uploadedFilenames.length} screenshot(s) uploaded!`, "success");
      }
    } catch {
      showNotification("Upload error occurred", "error");
    } finally {
      setScreenshotUploading(false);
    }
  };

  const handleScreenshotDelete = async (projectTitle: string, filename: string) => {
    if (!confirm(`Delete screenshot "${filename}"?`)) return;
    setScreenshotDeleting(filename);
    try {
      const res = await fetch(
        `/api/screenshots?project=${encodeURIComponent(projectTitle)}&filename=${encodeURIComponent(filename)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.title === projectTitle
              ? { ...p, screenshots: (p.screenshots || []).filter((s) => s !== filename) }
              : p
          )
        );
        setScreenshotManagerProject((prev) =>
          prev && prev.title === projectTitle
            ? { ...prev, screenshots: (prev.screenshots || []).filter((s) => s !== filename) }
            : prev
        );
        showNotification("Screenshot deleted", "success");
      } else {
        showNotification(data.error || "Delete failed", "error");
      }
    } catch {
      showNotification("Delete error occurred", "error");
    } finally {
      setScreenshotDeleting(null);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("New passwords do not match", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Password changed successfully", "success");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showNotification(data.error || "Failed to change password", "error");
      }
    } catch {
      showNotification("An error occurred", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutForm),
      });
      if (res.ok) {
        setAboutData(aboutForm);
        showNotification("About section updated!", "success");
      } else {
        showNotification("Failed to save about section", "error");
      }
    } catch {
      showNotification("Error saving about section", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="show-cursor" style={{
      minHeight: "100vh", background: "#07070e", color: "#eeeef8",
      fontFamily: "var(--font-dm), sans-serif", padding: "2rem 3rem", position: "relative"
    }}>
      {/* Header */}
      <header style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderBottom: "1px solid #252538", paddingBottom: "1.5rem", marginBottom: "2.5rem"
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.8rem",
            color: "#eeeef8", display: "flex", alignItems: "center", gap: "0.5rem"
          }}>
            Portfolio Panel <span style={{ fontSize: "0.75rem", background: "rgba(123, 111, 255, 0.15)", color: "#7b6fff", padding: "0.25rem 0.6rem", borderRadius: "100px" }}>Admin</span>
          </h1>
          <p style={{ color: "#7a7a9a", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Add, update, or remove portfolio showcase items
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/" target="_blank" style={{
            padding: "0.6rem 1.2rem", border: "1px solid #252538", borderRadius: "8px",
            color: "#eeeef8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500,
            display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "border-color 0.25s"
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = "#7b6fff"}
          onMouseOut={(e) => e.currentTarget.style.borderColor = "#252538"}>
            View Website ↗
          </a>
          <button onClick={handleLogout} style={{
            padding: "0.6rem 1.2rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "8px", color: "#ef4444", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
            transition: "background 0.25s, transform 0.1s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"}
          onMouseOut={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}>
            Log Out
          </button>
        </div>
      </header>

      {/* Notifications */}
      {success && (
        <div style={{
          background: "rgba(0, 229, 160, 0.08)", border: "1px solid rgba(0, 229, 160, 0.2)",
          color: "#00e5a0", borderRadius: "10px", padding: "1rem", fontSize: "0.88rem",
          marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem"
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div style={{
          background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)",
          color: "#ef4444", borderRadius: "10px", padding: "1rem", fontSize: "0.88rem",
          marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem"
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Forms & Table display */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.9fr", gap: "3rem", alignItems: "start" }}>
        
        {/* Form panel */}
        <div style={{
          background: "rgba(15, 15, 26, 0.6)", border: "1px solid #252538",
          borderRadius: "16px", padding: "2rem", backdropFilter: "blur(10px)"
        }}>
          {/* Tab switches */}
          <div style={{ display: "flex", gap: "0.5rem", background: "#07070e", padding: "0.3rem", borderRadius: "10px", marginBottom: "2rem" }}>
            <button onClick={() => { setActiveTab("projects"); setError(""); setSuccess(""); }} style={{
              flex: 1, padding: "0.5rem", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600,
              background: activeTab === "projects" ? "#7b6fff" : "transparent",
              color: activeTab === "projects" ? "#fff" : "#7a7a9a", cursor: "pointer", transition: "all 0.2s"
            }}>
              Projects
            </button>
            <button onClick={() => { setActiveTab("designs"); setError(""); setSuccess(""); }} style={{
              flex: 1, padding: "0.5rem", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600,
              background: activeTab === "designs" ? "#7b6fff" : "transparent",
              color: activeTab === "designs" ? "#fff" : "#7a7a9a", cursor: "pointer", transition: "all 0.2s"
            }}>
              UI/UX Designs
            </button>
            <button onClick={() => { setActiveTab("about"); setError(""); setSuccess(""); }} style={{
              flex: 1, padding: "0.5rem", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600,
              background: activeTab === "about" ? "#00e5a0" : "transparent",
              color: activeTab === "about" ? "#fff" : "#7a7a9a", cursor: "pointer", transition: "all 0.2s"
            }}>
              About
            </button>
            <button onClick={() => { setActiveTab("security"); setError(""); setSuccess(""); }} style={{
              flex: 1, padding: "0.5rem", border: "none", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600,
              background: activeTab === "security" ? "#ef4444" : "transparent",
              color: activeTab === "security" ? "#fff" : "#7a7a9a", cursor: "pointer", transition: "all 0.2s"
            }}>
              🔐 Security
            </button>
          </div>

          <h2 style={{
            fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "1.2rem",
            color: "#eeeef8", marginBottom: "1.5rem"
          }}>
            {activeTab === "projects" 
              ? (editingProjectTitle ? `Edit: ${editingProjectTitle}` : "Add New Project") 
              : activeTab === "designs"
              ? (editingDesignTitle ? `Edit: ${editingDesignTitle}` : "Add Figma Design")
              : activeTab === "about"
              ? "Update About"
              : "Change Password"
            }
          </h2>

          {activeTab === "projects" ? (
            <form onSubmit={handleProjectSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Icon</label>
                  <input
                    type="text"
                    required
                    value={projectForm.icon}
                    onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}
                    placeholder="🌱"
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem", fontSize: "1rem", textAlign: "center", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="GoviMaga"
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>GitHub URL</label>
                <input
                  type="url"
                  required
                  value={projectForm.gh}
                  onChange={(e) => setProjectForm({ ...projectForm, gh: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Live Demo URL (Optional)</label>
                <input
                  type="url"
                  value={projectForm.demo}
                  onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                  placeholder="https://yourapp.com"
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Figma URL (Optional)</label>
                <input
                  type="url"
                  value={projectForm.figma}
                  onChange={(e) => setProjectForm({ ...projectForm, figma: e.target.value })}
                  placeholder="https://figma.com/design/..."
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Description</label>
                <textarea
                  required
                  rows={4}
                  value={projectForm.desc}
                  onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                  placeholder="Describe what the application does, features built, etc."
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: "1.5" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Tech Tags (Comma separated)</label>
                <input
                  type="text"
                  required
                  value={projectForm.stack}
                  onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
                  placeholder="Flutter, Firebase, BLoC, REST API"
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    flex: 1, padding: "0.75rem", background: "#7b6fff", color: "#fff",
                    border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {actionLoading ? "Saving..." : (editingProjectTitle ? "Update Project" : "Add Project")}
                </button>
                {editingProjectTitle && (
                  <button
                    type="button"
                    onClick={resetProjectForm}
                    style={{
                      padding: "0.75rem 1.2rem", background: "transparent", border: "1px solid #252538",
                      borderRadius: "8px", color: "#7a7a9a", fontSize: "0.85rem", cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : activeTab === "designs" ? (
            <form onSubmit={handleDesignSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Title</label>
                <input
                  type="text"
                  required
                  value={designForm.title}
                  onChange={(e) => setDesignForm({ ...designForm, title: e.target.value })}
                  placeholder="GoviMaga App UI"
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Figma URL</label>
                <input
                  type="url"
                  required
                  value={designForm.figma}
                  onChange={(e) => setDesignForm({ ...designForm, figma: e.target.value })}
                  placeholder="https://www.figma.com/design/..."
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Description</label>
                <textarea
                  required
                  rows={4}
                  value={designForm.desc}
                  onChange={(e) => setDesignForm({ ...designForm, desc: e.target.value })}
                  placeholder="Describe your design and prototyping details..."
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: "1.5" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Tags (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={designForm.tags}
                    onChange={(e) => setDesignForm({ ...designForm, tags: e.target.value })}
                    placeholder="Mobile UI, UX, Figma"
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Accent Color</label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="color"
                      required
                      value={designForm.color}
                      onChange={(e) => setDesignForm({ ...designForm, color: e.target.value })}
                      style={{ width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
                    />
                    <input
                      type="text"
                      value={designForm.color}
                      onChange={(e) => setDesignForm({ ...designForm, color: e.target.value })}
                      placeholder="#00e5a0"
                      style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", color: "#fff", outline: "none", textAlign: "center" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    flex: 1, padding: "0.75rem", background: "#7b6fff", color: "#fff",
                    border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {actionLoading ? "Saving..." : (editingDesignTitle ? "Update Design" : "Add Design")}
                </button>
                {editingDesignTitle && (
                  <button
                    type="button"
                    onClick={resetDesignForm}
                    style={{
                      padding: "0.75rem 1.2rem", background: "transparent", border: "1px solid #252538",
                      borderRadius: "8px", color: "#7a7a9a", fontSize: "0.85rem", cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : activeTab === "about" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              
              {/* Basic Info */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Name</label>
                  <input
                    type="text"
                    value={aboutForm.name}
                    onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Typing Words (comma separated)</label>
                  <input
                    type="text"
                    value={aboutForm.typingWords.join(", ")}
                    onChange={(e) => setAboutForm({ ...aboutForm, typingWords: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Description (HTML allowed)</label>
                <textarea
                  rows={4}
                  value={aboutForm.description}
                  onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                  style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: "1.5" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>CV Link / Path</label>
                  <input
                    type="text"
                    value={aboutForm.cvLink}
                    onChange={(e) => setAboutForm({ ...aboutForm, cvLink: e.target.value })}
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Avatar Path</label>
                  <input
                    type="text"
                    value={aboutForm.avatar}
                    onChange={(e) => setAboutForm({ ...aboutForm, avatar: e.target.value })}
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none" }}
                  />
                </div>
              </div>

              {/* Roles */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ color: "#7a7a9a", fontSize: "0.75rem" }}>Role Pills</label>
                  <button onClick={() => setAboutForm({ ...aboutForm, roles: [...aboutForm.roles, { text: "New Role", className: "roleFs" }] })} style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "none", borderRadius: "4px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", cursor: "pointer" }}>+ Add Role</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {aboutForm.roles.map((role, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input type="text" value={role.text} onChange={(e) => { const newRoles = [...aboutForm.roles]; newRoles[idx].text = e.target.value; setAboutForm({ ...aboutForm, roles: newRoles }); }} style={{ flex: 1, background: "#07070e", border: "1px solid #252538", borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.8rem", color: "#fff", outline: "none" }} />
                      <select value={role.className} onChange={(e) => { const newRoles = [...aboutForm.roles]; newRoles[idx].className = e.target.value; setAboutForm({ ...aboutForm, roles: newRoles }); }} style={{ width: "120px", background: "#07070e", border: "1px solid #252538", borderRadius: "6px", padding: "0.4rem", fontSize: "0.8rem", color: "#fff", outline: "none" }}>
                        <option value="roleFs">roleFs (Purple)</option>
                        <option value="roleFe">roleFe (Green)</option>
                        <option value="roleBe">roleBe (Pink)</option>
                        <option value="roleMob">roleMob (Blue)</option>
                        <option value="roleJava">roleJava (Orange)</option>
                      </select>
                      <button onClick={() => { const newRoles = aboutForm.roles.filter((_, i) => i !== idx); setAboutForm({ ...aboutForm, roles: newRoles }); }} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: "6px", width: "30px", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Tags */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label style={{ color: "#7a7a9a", fontSize: "0.75rem" }}>Floating Background Tags</label>
                  <button onClick={() => setAboutForm({ ...aboutForm, floatingTags: [...aboutForm.floatingTags, { text: "New Tag", color: "#ffffff", className: "ft1" }] })} style={{ background: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "none", borderRadius: "4px", padding: "0.2rem 0.5rem", fontSize: "0.7rem", cursor: "pointer" }}>+ Add Tag</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {aboutForm.floatingTags.map((tag, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "0.5rem" }}>
                      <input type="text" value={tag.text} onChange={(e) => { const newTags = [...aboutForm.floatingTags]; newTags[idx].text = e.target.value; setAboutForm({ ...aboutForm, floatingTags: newTags }); }} style={{ flex: 1, background: "#07070e", border: "1px solid #252538", borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.8rem", color: "#fff", outline: "none" }} />
                      <input type="color" value={tag.color} onChange={(e) => { const newTags = [...aboutForm.floatingTags]; newTags[idx].color = e.target.value; setAboutForm({ ...aboutForm, floatingTags: newTags }); }} style={{ width: "32px", height: "32px", background: "none", border: "none", cursor: "pointer", padding: 0 }} />
                      <button onClick={() => { const newTags = aboutForm.floatingTags.filter((_, i) => i !== idx); setAboutForm({ ...aboutForm, floatingTags: newTags }); }} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: "6px", width: "30px", cursor: "pointer" }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveAbout}
                disabled={actionLoading}
                style={{
                  width: "100%", padding: "0.85rem", background: "#00e5a0", color: "#000",
                  border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer", marginTop: "1rem"
                }}
              >
                {actionLoading ? "Saving..." : "Save About Section"}
              </button>
            </div>
          ) : (
            /* Security / Password Change Form */
            <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div style={{
                background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)",
                borderRadius: "10px", padding: "0.9rem 1rem", fontSize: "0.8rem", color: "#ef9444",
                display: "flex", alignItems: "flex-start", gap: "0.5rem"
              }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: "0.1rem" }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                After changing your password, you will be automatically logged out.
              </div>

              {/* Current Password */}
              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Current Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 2.5rem 0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                    style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a7a9a", padding: 0, display: "flex" }}>
                    {showCurrentPw
                      ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPw ? "text" : "password"}
                    required
                    minLength={8}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Min. 8 characters"
                    style={{ width: "100%", background: "#07070e", border: "1px solid #252538", borderRadius: "8px", padding: "0.6rem 2.5rem 0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a7a9a", padding: 0, display: "flex" }}>
                    {showNewPw
                      ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: "block", color: "#7a7a9a", fontSize: "0.75rem", marginBottom: "0.4rem" }}>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Re-enter new password"
                    style={{
                      width: "100%", background: "#07070e",
                      border: `1px solid ${passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword ? "rgba(239,68,68,0.5)" : "#252538"}`,
                      borderRadius: "8px", padding: "0.6rem 2.5rem 0.6rem 0.8rem", fontSize: "0.85rem", color: "#fff", outline: "none", boxSizing: "border-box"
                    }}
                  />
                  <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}
                    style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a7a9a", padding: 0, display: "flex" }}>
                    {showConfirmPw
                      ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                  <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.3rem" }}>Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passwordLoading || (!!passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword)}
                style={{
                  width: "100%", padding: "0.75rem",
                  background: passwordLoading ? "rgba(239, 68, 68, 0.5)" : "rgba(239, 68, 68, 0.8)",
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                  marginTop: "0.5rem", transition: "background 0.2s"
                }}
                onMouseOver={(e) => { if (!passwordLoading) e.currentTarget.style.background = "rgba(239, 68, 68, 1)"; }}
                onMouseOut={(e) => { if (!passwordLoading) e.currentTarget.style.background = "rgba(239, 68, 68, 0.8)"; }}
              >
                {passwordLoading ? (
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Change Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Existing items listing list */}
        <div style={{
          background: "rgba(15, 15, 26, 0.4)", border: "1px solid #252538",
          borderRadius: "16px", padding: "2rem", minHeight: "500px"
        }}>
          <h2 style={{
            fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "1.2rem",
            color: "#eeeef8", marginBottom: "1.5rem"
          }}>
            Showcase List ({activeTab === "projects" ? "Projects" : activeTab === "designs" ? "Designs" : activeTab === "about" ? "About Data" : "Security"})
          </h2>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "1rem" }}>
              <span style={{
                display: "inline-block", width: "32px", height: "32px",
                border: "3px solid rgba(123, 111, 255, 0.15)", borderTopColor: "#7b6fff",
                borderRadius: "50%", animation: "spin 0.8s linear infinite"
              }} />
              <p style={{ color: "#7a7a9a", fontSize: "0.85rem" }}>Loading showcase items...</p>
            </div>
          ) : activeTab === "projects" ? (
            projects.length === 0 ? (
              <p style={{ color: "#7a7a9a", fontSize: "0.9rem", textAlign: "center", marginTop: "4rem" }}>No projects configured yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {projects.map((p) => (
                  <div key={p.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div style={{
                      background: "rgba(7, 7, 14, 0.4)", border: "1px solid #252538",
                      borderRadius: "12px", padding: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0, paddingRight: "1rem" }}>
                        <div style={{ fontSize: "1.5rem", background: "rgba(123, 111, 255, 0.1)", width: "42px", height: "42px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {p.icon}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#eeeef8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</h3>
                          <p style={{ fontSize: "0.78rem", color: "#7a7a9a", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.4" }}>
                            {p.desc}
                          </p>
                          <span style={{ fontSize: "0.7rem", color: "#7b6fff", marginTop: "0.3rem", display: "inline-block" }}>
                            🖼 {(p.screenshots || []).length} screenshot{(p.screenshots || []).length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                        <button
                          onClick={() => setScreenshotManagerProject(screenshotManagerProject?.title === p.title ? null : p)}
                          style={{
                            padding: "0.4rem 0.8rem", background: screenshotManagerProject?.title === p.title ? "rgba(123,111,255,0.25)" : "rgba(123, 111, 255, 0.07)", border: "1px solid rgba(123, 111, 255, 0.25)",
                            borderRadius: "6px", color: "#7b6fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          🖼 Screenshots
                        </button>
                        <button
                          onClick={() => handleEditProject(p)}
                          style={{
                            padding: "0.4rem 0.8rem", background: "rgba(123, 111, 255, 0.1)", border: "1px solid rgba(123, 111, 255, 0.2)",
                            borderRadius: "6px", color: "#a99fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.title)}
                          style={{
                            padding: "0.4rem 0.8rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                            borderRadius: "6px", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Inline screenshot manager */}
                    {screenshotManagerProject?.title === p.title && (
                      <div style={{
                        background: "rgba(123,111,255,0.04)", border: "1px solid rgba(123,111,255,0.18)",
                        borderRadius: "12px", padding: "1.2rem", marginTop: "0.2rem"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a99fff" }}>
                            🖼 Screenshots — {p.title}
                          </p>
                          <label style={{
                            display: "inline-flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.45rem 0.9rem", background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)",
                            borderRadius: "7px", color: "#00e5a0", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                          }}>
                            {screenshotUploading ? "Uploading..." : (
                              <>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Screenshots
                              </>
                            )}
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              style={{ display: "none" }}
                              disabled={screenshotUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleScreenshotUpload(p.title, e.target.files);
                                  e.target.value = "";
                                }
                              }}
                            />
                          </label>
                        </div>

                        {(p.screenshots || []).length === 0 ? (
                          <div style={{
                            padding: "1.5rem", textAlign: "center", border: "1px dashed rgba(123,111,255,0.2)",
                            borderRadius: "8px", color: "#7a7a9a", fontSize: "0.82rem"
                          }}>
                            No screenshots yet. Click &quot;Add Screenshots&quot; to upload.
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.7rem" }}>
                            {(p.screenshots || []).map((filename) => (
                              <div key={filename} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(123,111,255,0.15)", aspectRatio: "16/10" }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={`/screenshots/${encodeURIComponent(p.title)}/${encodeURIComponent(filename)}`}
                                  alt={filename}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                                <button
                                  onClick={() => handleScreenshotDelete(p.title, filename)}
                                  disabled={screenshotDeleting === filename}
                                  style={{
                                    position: "absolute", top: "4px", right: "4px",
                                    width: "22px", height: "22px", borderRadius: "50%",
                                    background: "rgba(239,68,68,0.85)", border: "none",
                                    color: "#fff", fontSize: "0.65rem", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontWeight: 700, lineHeight: 1
                                  }}
                                  title="Delete screenshot"
                                >
                                  {screenshotDeleting === filename ? "…" : "✕"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            designs.length === 0 ? (
              <p style={{ color: "#7a7a9a", fontSize: "0.9rem", textAlign: "center", marginTop: "4rem" }}>No designs configured yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {designs.map((d) => (
                  <div key={d.title} style={{
                    background: "rgba(7, 7, 14, 0.4)", border: "1px solid #252538",
                    borderRadius: "12px", padding: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0, paddingRight: "1rem" }}>
                      <div style={{
                        width: "8px", height: "36px", borderRadius: "4px", background: d.color || "#00e5a0", flexShrink: 0
                      }} />
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#eeeef8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.title}</h3>
                        <p style={{ fontSize: "0.78rem", color: "#7a7a9a", marginTop: "0.2rem", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.4" }}>
                          {d.desc}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <button
                        onClick={() => handleEditDesign(d)}
                        style={{
                          padding: "0.4rem 0.8rem", background: "rgba(123, 111, 255, 0.1)", border: "1px solid rgba(123, 111, 255, 0.2)",
                          borderRadius: "6px", color: "#a99fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDesign(d.title)}
                        style={{
                          padding: "0.4rem 0.8rem", background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.15)",
                          borderRadius: "6px", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}

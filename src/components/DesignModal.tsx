"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ProjectModal.module.css";

interface Design {
  title: string;
  figma: string;
  thumb?: string;
  desc: string;
  tags: string[];
  color: string;
  screenshots?: string[];
}

interface DesignModalProps {
  design: Design;
  onClose: () => void;
}

export default function DesignModal({ design, onClose }: DesignModalProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [localScreenshots, setLocalScreenshots] = useState<string[]>(design.screenshots || []);
  const screenshots = localScreenshots;

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if admin is logged in
  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => setIsAdmin(d.authenticated === true))
      .catch(() => setIsAdmin(false));
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxSrc) {
          setLightboxSrc(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, lightboxSrc]);

  // Track scroll for dot indicator
  const handleGalleryScroll = useCallback(() => {
    if (!galleryRef.current || screenshots.length === 0) return;
    const { scrollLeft, scrollWidth } = galleryRef.current;
    const itemWidth = scrollWidth / screenshots.length;
    const idx = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(idx, screenshots.length - 1));
  }, [screenshots.length]);

  const scrollTo = (idx: number) => {
    if (!galleryRef.current || screenshots.length === 0) return;
    const itemWidth = galleryRef.current.scrollWidth / screenshots.length;
    galleryRef.current.scrollTo({ left: itemWidth * idx, behavior: "smooth" });
    setActiveIndex(idx);
  };

  const prev = () => scrollTo(Math.max(activeIndex - 1, 0));
  const next = () => scrollTo(Math.min(activeIndex + 1, screenshots.length - 1));

  const getScreenshotUrl = (filename: string) =>
    `/screenshots/${encodeURIComponent(design.title)}/${encodeURIComponent(filename)}`;

  // Show notification
  const showMsg = (text: string, type: "success" | "error") => {
    setUploadMsg({ text, type });
    setTimeout(() => setUploadMsg(null), 3500);
  };

  // Upload screenshots
  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("projectTitle", design.title);
      formData.append("type", "design");
      formData.append("file", file);
      try {
        const res = await fetch("/api/screenshots", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          uploaded.push(data.filename);
        } else {
          showMsg(data.error || "Upload failed", "error");
        }
      } catch {
        showMsg("Network error during upload", "error");
      }
    }
    if (uploaded.length > 0) {
      setLocalScreenshots((prev) => [...prev, ...uploaded]);
      showMsg(`${uploaded.length} screenshot${uploaded.length > 1 ? "s" : ""} uploaded!`, "success");
    }
    setUploading(false);
  };

  // Delete screenshot
  const handleDelete = async (filename: string) => {
    setDeleting(filename);
    try {
      const res = await fetch(
        `/api/screenshots?project=${encodeURIComponent(design.title)}&type=design&filename=${encodeURIComponent(filename)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        setLocalScreenshots((prev) => prev.filter((s) => s !== filename));
        if (activeIndex >= screenshots.length - 1) setActiveIndex(Math.max(0, screenshots.length - 2));
        showMsg("Screenshot deleted", "success");
      } else {
        showMsg(data.error || "Delete failed", "error");
      }
    } catch {
      showMsg("Network error", "error");
    }
    setDeleting(null);
    setConfirmDelete(null);
  };

  // Drag-and-drop
  const [dragging, setDragging] = useState(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={styles.overlay}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        aria-modal="true"
        role="dialog"
        aria-label={`${design.title} details`}
      >
        <div className={styles.modal}>
          {/* Sticky close button */}
          <div className={styles.closeBtn}>
            <button className={styles.closeBtnInner} onClick={onClose} aria-label="Close modal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.iconWrap}>🎨</div>
              <div className={styles.headerInfo}>
                <h2 className={styles.projectTitle}>{design.title}</h2>
                <div className={styles.stack}>
                  {design.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* Screenshot Gallery */}
            <div className={styles.gallerySection}>
              <div className={styles.gallerySectionHeader}>
                <p className={styles.gallerySectionLabel}>Screenshots</p>
                {/* Admin: Upload button */}
                {isAdmin && (
                  <label
                    className={`${styles.uploadBtn} ${uploading ? styles.uploadBtnLoading : ""}`}
                    title="Upload screenshots"
                  >
                    {uploading ? (
                      <><span className={styles.spinner} /> Uploading…</>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add Screenshots
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={uploading}
                      onChange={(e) => { if (e.target.files) { handleUpload(e.target.files); e.target.value = ""; } }}
                    />
                  </label>
                )}
              </div>

              {/* Upload notification */}
              {uploadMsg && (
                <div className={`${styles.uploadMsg} ${uploadMsg.type === "success" ? styles.uploadMsgSuccess : styles.uploadMsgError}`}>
                  {uploadMsg.type === "success"
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  }
                  {uploadMsg.text}
                </div>
              )}

              {screenshots.length === 0 ? (
                /* Empty state — with drag-drop if admin */
                isAdmin ? (
                  <div
                    className={`${styles.emptyGallery} ${styles.emptyGalleryAdmin} ${dragging ? styles.dragging : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={{ fontWeight: 600, color: "#a99fff" }}>Click or drag images here to upload</span>
                    <span style={{ fontSize: "0.75rem" }}>JPG, PNG, WebP or GIF · Max 5MB each</span>
                  </div>
                ) : (
                  <div className={styles.emptyGallery}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>No screenshots added yet</span>
                  </div>
                )
              ) : (
                <div
                  className={styles.galleryWrap}
                  onDragOver={isAdmin ? (e) => { e.preventDefault(); setDragging(true); } : undefined}
                  onDragLeave={isAdmin ? () => setDragging(false) : undefined}
                  onDrop={isAdmin ? handleDrop : undefined}
                >
                  {/* Drag overlay */}
                  {isAdmin && dragging && (
                    <div className={styles.dragOverlay}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Drop to upload
                    </div>
                  )}

                  {/* Prev arrow */}
                  {screenshots.length > 1 && activeIndex > 0 && (
                    <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={prev} aria-label="Previous">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                  )}

                  {/* Gallery */}
                  <div className={styles.gallery} ref={galleryRef} onScroll={handleGalleryScroll}>
                    {screenshots.map((filename, i) => (
                      <div key={filename} className={styles.galleryImgWrap}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getScreenshotUrl(filename)}
                          alt={`${design.title} screenshot ${i + 1}`}
                          className={styles.galleryImg}
                          onClick={() => setLightboxSrc(getScreenshotUrl(filename))}
                          loading="lazy"
                        />
                        {/* Admin: inline confirm delete */}
                        {isAdmin && (
                          confirmDelete === filename ? (
                            <div className={styles.imgConfirmBar}>
                              <span>Delete?</span>
                              <button
                                className={styles.imgConfirmYes}
                                onClick={(e) => { e.stopPropagation(); handleDelete(filename); }}
                                disabled={deleting === filename}
                              >
                                {deleting === filename ? "…" : "Yes"}
                              </button>
                              <button
                                className={styles.imgConfirmNo}
                                onClick={(e) => { e.stopPropagation(); setConfirmDelete(null); }}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className={styles.imgDeleteBtn}
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(filename); }}
                              disabled={deleting === filename}
                              title="Delete screenshot"
                              aria-label="Delete screenshot"
                            >
                              ✕
                            </button>
                          )
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Next arrow */}
                  {screenshots.length > 1 && activeIndex < screenshots.length - 1 && (
                    <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={next} aria-label="Next">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}

                  {/* Dot indicators */}
                  {screenshots.length > 1 && (
                    <div className={styles.dots}>
                      {screenshots.map((_, i) => (
                        <button
                          key={i}
                          className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                          onClick={() => scrollTo(i)}
                          aria-label={`Screenshot ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <hr className={styles.divider} />

            {/* Description */}
            <div className={styles.descSection}>
              <p className={styles.sectionLabel}>About</p>
              <p className={styles.desc}>{design.desc}</p>
            </div>

            <hr className={styles.divider} />

            {/* Action buttons */}
            <div className={styles.actions}>
              {design.figma && (
                <a href={design.figma} target="_blank" rel="noreferrer" className={styles.btnFigma}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 24c2.2 0 4-1.8 4-4v-4H8c-2.2 0-4 1.8-4 4s1.8 4 4 4z" />
                    <path d="M4 12c0-2.2 1.8-4 4-4h4v8H8c-2.2 0-4-1.8-4-4z" />
                    <path d="M4 4c0-2.2 1.8-4 4-4h4v8H8C5.8 8 4 6.2 4 4z" />
                    <path d="M12 0h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4V0z" />
                    <path d="M20 12c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z" />
                  </svg>
                  View in Figma
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className={styles.lightbox}
          onClick={() => setLightboxSrc(null)}
          aria-modal="true"
          role="dialog"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt="Screenshot fullscreen"
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

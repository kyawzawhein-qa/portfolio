"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertCircle } from "lucide-react";

interface MediaFile {
  name: string;
  path: string;
  url: string;
}

export function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/media");
      const data = await response.json();

      if (data.success) {
        setMediaFiles(data.data);
        setError(null);
      } else {
        setError("Failed to load media files");
      }
    } catch (err) {
      setError("Error fetching media files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;

    try {
      setDeleting(filename);
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });

      const data = await response.json();

      if (data.success) {
        setMediaFiles(prev => prev.filter(f => f.name !== filename));
        showToast("File deleted successfully", "success");
        // Revalidate page data
        await fetch("/api/revalidate?path=/admin/media");
      } else {
        if (data.inUse) {
          showToast(data.error, "error");
        } else {
          showToast(data.error || "Failed to delete file", "error");
        }
      }
    } catch (err) {
      showToast("Error deleting file", "error");
    } finally {
      setDeleting(null);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading media files...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      {toast && (
        <div className={`rounded-lg p-4 ${
          toast.type === "success"
            ? "bg-emerald-500/20 text-emerald-300"
            : "bg-rose-500/20 text-rose-300"
        }`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-500/20 p-4 text-rose-300">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {mediaFiles.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 py-12 text-center">
          <p className="text-slate-400">No media files uploaded yet.</p>
          <p className="text-sm text-slate-500">Upload files through the profile image or project image fields.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Media Gallery</h3>
              <p className="text-sm text-slate-400">{mediaFiles.length} files</p>
            </div>
            <button
              onClick={fetchMediaFiles}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mediaFiles.map((file) => (
              <div
                key={file.name}
                className="group relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700"
              >
                {/* Image Preview */}
                <div className="relative aspect-square bg-slate-900">
                  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-800">
                      <div className="text-center">
                        <div className="text-2xl">📄</div>
                        <div className="mt-2 max-w-full truncate px-2 text-xs text-slate-400">
                          {file.name}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(file.name)}
                      disabled={deleting === file.name}
                      className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                    >
                      {deleting === file.name ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="border-t border-slate-800 p-3">
                  <p className="max-w-full truncate text-xs font-medium text-slate-300 hover:text-white" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{file.url}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string | null;
  technologies: string;
  url: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
}

interface ProjectsTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export function ProjectsTable({ projects, onEdit, onDelete }: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/50">
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Title</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Technologies</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Featured</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                No projects yet. Create one to get started.
              </td>
            </tr>
          ) : (
            projects.map((project) => {
              const techs = JSON.parse(project.technologies);
              return (
                <tr key={project.id} className="border-b border-slate-800/50 hover:bg-slate-950/30">
                  <td className="px-4 py-3 font-medium text-white">{project.title}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {Array.isArray(techs) ? techs.join(", ") : techs}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${
                      project.featured
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {project.featured ? "✓ Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(project)}
                        className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProjectForm({ project, onSubmit, onCancel, isLoading = false }: ProjectFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  const technologies = project
    ? JSON.parse(project.technologies).join(", ")
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Project Title *
        </label>
        <input
          name="title"
          defaultValue={project?.title || ""}
          required
          placeholder="e.g., QA Automation Dashboard"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Brief description of the project..."
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Technologies (comma-separated)
        </label>
        <input
          name="technologies"
          defaultValue={technologies}
          placeholder="React, TypeScript, Playwright, Jest"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Project URL
          </label>
          <input
            name="url"
            type="url"
            defaultValue={project?.url || ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            GitHub URL
          </label>
          <input
            name="githubUrl"
            type="url"
            defaultValue={project?.githubUrl || ""}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Image URL
        </label>
        <input
          name="imageUrl"
          defaultValue={project?.imageUrl || ""}
          placeholder="/uploads/project-image.jpg"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={project?.featured || false}
              className="rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
            />
            Featured Project
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Order
          </label>
          <input
            name="order"
            type="number"
            defaultValue={project?.order || 99}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {project ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

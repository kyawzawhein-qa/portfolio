"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl: string | null;
  order: number;
}

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: number) => void;
}

export function TestimonialsTable({ testimonials, onEdit, onDelete }: TestimonialsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/50">
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Company</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Rating</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                No testimonials yet. Add one to showcase client feedback.
              </td>
            </tr>
          ) : (
            testimonials.map((testimonial) => (
              <tr key={testimonial.id} className="border-b border-slate-800/50 hover:bg-slate-950/30">
                <td className="px-4 py-3 font-medium text-white">{testimonial.name}</td>
                <td className="px-4 py-3 text-slate-400">{testimonial.company || "—"}</td>
                <td className="px-4 py-3">
                  <span className="text-amber-400">
                    {"⭐".repeat(testimonial.rating || 5)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(testimonial)}
                      className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-500/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(testimonial.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TestimonialForm({ testimonial, onSubmit, onCancel, isLoading = false }: TestimonialFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Name *
        </label>
        <input
          name="name"
          defaultValue={testimonial?.name || ""}
          required
          placeholder="e.g., John Doe"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Role
          </label>
          <input
            name="role"
            defaultValue={testimonial?.role || ""}
            placeholder="e.g., Product Manager"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Company
          </label>
          <input
            name="company"
            defaultValue={testimonial?.company || ""}
            placeholder="e.g., Acme Corp"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Testimonial Content *
        </label>
        <textarea
          name="content"
          defaultValue={testimonial?.content || ""}
          required
          placeholder="What did they say about you?"
          rows={4}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Rating (1-5)
          </label>
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            defaultValue={testimonial?.rating || 5}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Image URL
          </label>
          <input
            name="imageUrl"
            defaultValue={testimonial?.imageUrl || ""}
            placeholder="/uploads/testimonial.jpg"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Order
        </label>
        <input
          name="order"
          type="number"
          defaultValue={testimonial?.order || 99}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
        >
          {testimonial ? "Update Testimonial" : "Create Testimonial"}
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

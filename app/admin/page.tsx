import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createEducation,
  createExperience,
  createSkill,
  deleteEducation,
  deleteExperience,
  deleteSkill,
  updateEducation,
  updateExperience,
  updateProfile,
  updateSkill
} from "@/app/api/actions/portfolio/actions";
import { SignOutButton } from "@/components/admin/SignOutButton";
import {
  BriefcaseBusiness,
  GraduationCap,
  ImagePlus,
  Layers3,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";

function formatDateInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const profile = await prisma.profile.findFirst({
    include: {
      experiences: { orderBy: { order: "asc" }, include: { highlights: { orderBy: { order: "asc" } } } },
      educations: { orderBy: { endYear: "desc" } },
      skills: { orderBy: { name: "asc" } },
      projects: true,
      certifications: true
    }
  });

  if (!profile) {
    return <p className="text-slate-300">Profile not found. Run seed first.</p>;
  }

  const dashboardStats = [
    { label: "Experience", value: "5+ yrs", icon: BriefcaseBusiness },
    { label: "Skills", value: String(profile.skills.length), icon: Layers3 },
    { label: "Projects", value: String(profile.projects.length), icon: Sparkles },
    { label: "Certifications", value: String(profile.certifications.length), icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6">
      <header className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Portfolio control room
          </p>
          <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Shape your resume into a sharper market-facing QA engineering story.
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <Icon className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
            </article>
          );
        })}
      </section>

      <section className="glass-card p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Profile Story</h2>
            <p className="text-sm text-slate-400">
              Keep the headline, summary, and profile image aligned with your QA resume.
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
            Resume-driven positioning
          </span>
        </div>

        <form action={updateProfile} encType="multipart/form-data" className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center text-slate-500">
                  <ImagePlus className="h-10 w-10" />
                </div>
              )}
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Upload profile image</span>
              <input name="profileImageFile" type="file" accept="image/*" className="cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-950" />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input name="name" defaultValue={profile.name} required placeholder="Name" />
            <input name="title" defaultValue={profile.title} required placeholder="Title" />
            <input name="email" defaultValue={profile.email} required placeholder="Email" className="md:col-span-2" />
            <input name="phone" defaultValue={profile.phone ?? ""} placeholder="Phone" />
            <input name="location" defaultValue={profile.location ?? ""} placeholder="Location" />
            <textarea name="intro" defaultValue={profile.intro} rows={4} required className="md:col-span-2" />
            <textarea name="summary" defaultValue={profile.summary} rows={6} required className="md:col-span-2" />
            <button className="rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 md:col-span-2">
              Save Profile
            </button>
          </div>
        </form>
      </section>

      <section className="glass-card p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
              Work Experience
            </h2>
            <p className="mt-1 text-sm text-slate-400">Add new roles or edit the resume roles already shown on the homepage.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.experiences.length} roles</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new experience</summary>
          <form action={createExperience} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="role" placeholder="Role" required />
            <input name="company" placeholder="Company" required />
            <textarea name="description" placeholder="Short role summary" rows={2} className="md:col-span-2" />
            <input name="startDate" type="date" required />
            <input name="endDate" type="date" />
            <input name="order" type="number" placeholder="Order (1,2,3...)" />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="isCurrent" type="checkbox" /> Current role
            </label>
            <textarea name="highlights" placeholder="Bullet points, one per line" rows={5} className="md:col-span-2" />
            <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 md:col-span-2">Add Experience</button>
          </form>
        </details>

        <div className="mt-5 space-y-4">
          {profile.experiences.map((exp) => (
            <article key={exp.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{exp.role}</p>
                  <p className="text-sm text-cyan-300">{exp.company}</p>
                </div>
                <form action={deleteExperience}>
                  <input type="hidden" name="id" value={exp.id} />
                  <button className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </form>
              </div>
              <form action={updateExperience} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={exp.id} />
                <input name="role" defaultValue={exp.role} required />
                <input name="company" defaultValue={exp.company} required />
                <textarea name="description" defaultValue={exp.description ?? ""} rows={2} className="md:col-span-2" />
                <input name="startDate" type="date" defaultValue={formatDateInput(exp.startDate)} required />
                <input name="endDate" type="date" defaultValue={formatDateInput(exp.endDate)} />
                <input name="order" type="number" defaultValue={exp.order} />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input name="isCurrent" type="checkbox" defaultChecked={exp.isCurrent} /> Current role
                </label>
                <textarea
                  name="highlights"
                  defaultValue={exp.highlights.map((highlight) => highlight.text).join("\n")}
                  rows={8}
                  className="md:col-span-2"
                />
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 md:col-span-2">
                  <Save className="h-4 w-4" />
                  Save Experience
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <GraduationCap className="h-5 w-5 text-cyan-300" />
              Education
            </h2>
            <p className="mt-1 text-sm text-slate-400">Correct existing education or add new credentials later.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.educations.length} records</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new education</summary>
          <form action={createEducation} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="degree" placeholder="Degree" required />
            <input name="institution" placeholder="Institution" required />
            <input name="startYear" type="number" placeholder="Start year" />
            <input name="endYear" type="number" placeholder="End year" />
            <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 md:col-span-2">Add Education</button>
          </form>
        </details>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {profile.educations.map((edu) => (
            <article key={edu.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <form action={updateEducation} className="grid gap-3">
                <input type="hidden" name="id" value={edu.id} />
                <input name="degree" defaultValue={edu.degree} required />
                <input name="institution" defaultValue={edu.institution} required />
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="startYear" type="number" defaultValue={edu.startYear ?? ""} placeholder="Start year" />
                  <input name="endYear" type="number" defaultValue={edu.endYear ?? ""} placeholder="End year" />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950">
                  <Save className="h-4 w-4" />
                  Save Education
                </button>
              </form>
              <form action={deleteEducation} className="mt-3">
                <input type="hidden" name="id" value={edu.id} />
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10">
                  <Trash2 className="h-4 w-4" />
                  Delete Education
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <Pencil className="h-5 w-5 text-cyan-300" />
              Skills
            </h2>
            <p className="mt-1 text-sm text-slate-400">Tune categories and names as your toolkit grows.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.skills.length} skills</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new skill</summary>
          <form action={createSkill} className="mt-4 grid gap-3 md:grid-cols-3">
            <input name="name" placeholder="Skill" required />
            <input name="category" placeholder="Category" />
            <input name="level" placeholder="Level" />
            <button className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 md:col-span-3">Add Skill</button>
          </form>
        </details>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {profile.skills.map((skill) => (
            <article key={skill.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateSkill} className="grid gap-2">
                <input type="hidden" name="id" value={skill.id} />
                <input name="name" defaultValue={skill.name} required />
                <input name="category" defaultValue={skill.category ?? ""} placeholder="Category" />
                <input name="level" defaultValue={skill.level ?? ""} placeholder="Level" />
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-950">
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </form>
              <form action={deleteSkill} className="mt-2">
                <input type="hidden" name="id" value={skill.id} />
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

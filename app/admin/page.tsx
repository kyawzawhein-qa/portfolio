import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseJsonStringArray } from "@/lib/parse";
import {
  createCertification,
  createDeliveryItem,
  createEducation,
  createExperience,
  createMarketSignal,
  createMetric,
  createProject,
  createSkill,
  createTestimonial,
  deleteCertification,
  deleteContactMessage,
  deleteDeliveryItem,
  deleteEducation,
  deleteExperience,
  deleteMarketSignal,
  deleteMetric,
  deleteProject,
  deleteSkill,
  deleteTestimonial,
  markContactRead,
  updateCertification,
  updateDeliveryItem,
  updateEducation,
  updateExperience,
  updateMarketSignal,
  updateMetric,
  updateProfile,
  updateProject,
  updateSkill,
  updateTestimonial
} from "@/app/api/actions/portfolio/actions";
import { SignOutButton } from "@/components/admin/SignOutButton";
import {
  BriefcaseBusiness,
  FolderGit2,
  GraduationCap,
  ImagePlus,
  Inbox,
  Layers3,
  MessageSquareQuote,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";

export const dynamic = "force-dynamic";

function formatDateInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

const fieldClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 focus:ring";
const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400";
const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/40 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const profile = await prisma.profile.findFirst({
    include: {
      experiences: { orderBy: { order: "asc" }, include: { highlights: { orderBy: { order: "asc" } } } },
      educations: { orderBy: { endYear: "desc" } },
      skills: { orderBy: { name: "asc" } },
      projects: { orderBy: { order: "asc" } },
      testimonials: { orderBy: { order: "asc" } },
      certifications: { orderBy: { date: "desc" } },
      metrics: { orderBy: { order: "asc" } },
      marketSignals: { orderBy: { order: "asc" } },
      deliveryItems: { orderBy: { order: "asc" } }
    }
  });

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  if (!profile) {
    return <p className="text-slate-300">Profile not found. Run seed first.</p>;
  }

  const heroTags = parseJsonStringArray(profile.heroTags).join(", ");
  const unreadCount = messages.filter((m) => !m.read).length;

  const dashboardStats = [
    { label: "Experience", value: String(profile.experiences.length), icon: BriefcaseBusiness },
    { label: "Skills", value: String(profile.skills.length), icon: Layers3 },
    { label: "Projects", value: String(profile.projects.length), icon: FolderGit2 },
    { label: "Messages", value: String(unreadCount), icon: Inbox }
  ];

  return (
    <div className="space-y-6">
      <header className="glass-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Portfolio CMS
          </p>
          <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Add, update, or delete every public section — including Playwright demo GitHub links.
          </p>
        </div>
        <SignOutButton />
      </header>

      <nav className="flex flex-wrap gap-2 text-xs">
        {[
          ["profile", "Profile"],
          ["projects", "Projects"],
          ["experience", "Experience"],
          ["education", "Education"],
          ["skills", "Skills"],
          ["metrics", "Metrics"],
          ["signals", "Signals"],
          ["delivery", "Delivery"],
          ["testimonials", "Testimonials"],
          ["certs", "Certifications"],
          ["messages", "Messages"]
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
          >
            {label}
          </a>
        ))}
      </nav>

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

      <section id="profile" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Profile Story</h2>
          <p className="text-sm text-slate-400">Headline, social links, resume, and hero tags shown on the homepage.</p>
        </div>

        <form action={updateProfile} encType="multipart/form-data" className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              {profile.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
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
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Or image URL</span>
              <input name="profileImage" defaultValue={profile.profileImage ?? ""} placeholder="https://..." className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Upload resume (PDF/DOCX)</span>
              <input name="resumeFile" type="file" accept=".pdf,.docx,application/pdf" className="cursor-pointer text-sm file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-950" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Or resume URL/path</span>
              <input name="resumeUrl" defaultValue={profile.resumeUrl ?? "/KYAWZAWHEIN_QA_ENGINEER.docx"} placeholder="/resume.pdf" className={fieldClass} />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <input name="name" defaultValue={profile.name} required placeholder="Name" className={fieldClass} />
            <input name="title" defaultValue={profile.title} required placeholder="Title" className={fieldClass} />
            <input name="email" defaultValue={profile.email} required placeholder="Email" className={`${fieldClass} md:col-span-2`} />
            <input name="phone" defaultValue={profile.phone ?? ""} placeholder="Phone" className={fieldClass} />
            <input name="location" defaultValue={profile.location ?? ""} placeholder="Location" className={fieldClass} />
            <input name="linkedinUrl" defaultValue={profile.linkedinUrl ?? ""} placeholder="LinkedIn URL" className={fieldClass} />
            <input name="githubUrl" defaultValue={profile.githubUrl ?? ""} placeholder="GitHub profile URL" className={fieldClass} />
            <input name="heroTags" defaultValue={heroTags} placeholder="Hero tags (comma separated)" className={`${fieldClass} md:col-span-2`} />
            <textarea name="intro" defaultValue={profile.intro} rows={4} required className={`${fieldClass} md:col-span-2`} />
            <textarea name="summary" defaultValue={profile.summary} rows={6} required className={`${fieldClass} md:col-span-2`} />
            <button className={`${primaryBtn} md:col-span-2`}>
              <Save className="h-4 w-4" />
              Save Profile
            </button>
          </div>
        </form>
      </section>

      <section id="projects" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <FolderGit2 className="h-5 w-5 text-cyan-300" />
              Projects & Playwright Demos
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Manage every demo project, GitHub repo link, case-study fields, and tech stack from here.
            </p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.projects.length} projects</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4" open>
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new project / Playwright demo</summary>
          <form action={createProject} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className={fieldClass} />
            <input name="category" placeholder='Category (e.g. "Playwright Demo")' className={fieldClass} />
            <input name="githubUrl" placeholder="GitHub project URL" className={`${fieldClass} md:col-span-2`} />
            <input name="url" placeholder="Live demo URL (optional)" className={fieldClass} />
            <input name="imageUrl" placeholder="Image URL (optional)" className={fieldClass} />
            <input name="technologies" placeholder="Technologies (comma or newline separated)" className={`${fieldClass} md:col-span-2`} />
            <textarea name="description" placeholder="Short description" rows={3} className={`${fieldClass} md:col-span-2`} />
            <textarea name="problem" placeholder="Problem" rows={2} className={`${fieldClass} md:col-span-2`} />
            <textarea name="approach" placeholder="Approach" rows={2} className={`${fieldClass} md:col-span-2`} />
            <textarea name="outcome" placeholder="Outcome / metrics" rows={2} className={`${fieldClass} md:col-span-2`} />
            <input name="order" type="number" placeholder="Order (1,2,3...)" className={fieldClass} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="featured" type="checkbox" /> Featured
            </label>
            <button className={`${primaryBtn} md:col-span-2`}>Add Project</button>
          </form>
        </details>

        <div className="mt-5 space-y-4">
          {profile.projects.map((project) => (
            <article key={project.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{project.title}</p>
                  <p className="text-sm text-cyan-300">{project.category || "Project"} · {project.githubUrl || "No GitHub link"}</p>
                </div>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button className={dangerBtn}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </form>
              </div>
              <form action={updateProject} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={project.id} />
                <input name="title" defaultValue={project.title} required className={fieldClass} />
                <input name="category" defaultValue={project.category ?? ""} placeholder='Category (e.g. "Playwright Demo")' className={fieldClass} />
                <input name="githubUrl" defaultValue={project.githubUrl ?? ""} placeholder="GitHub project URL" className={`${fieldClass} md:col-span-2`} />
                <input name="url" defaultValue={project.url ?? ""} placeholder="Live demo URL" className={fieldClass} />
                <input name="imageUrl" defaultValue={project.imageUrl ?? ""} placeholder="Image URL" className={fieldClass} />
                <input
                  name="technologies"
                  defaultValue={parseJsonStringArray(project.technologies).join(", ")}
                  placeholder="Technologies"
                  className={`${fieldClass} md:col-span-2`}
                />
                <textarea name="description" defaultValue={project.description ?? ""} rows={3} className={`${fieldClass} md:col-span-2`} />
                <textarea name="problem" defaultValue={project.problem ?? ""} rows={2} placeholder="Problem" className={`${fieldClass} md:col-span-2`} />
                <textarea name="approach" defaultValue={project.approach ?? ""} rows={2} placeholder="Approach" className={`${fieldClass} md:col-span-2`} />
                <textarea name="outcome" defaultValue={project.outcome ?? ""} rows={2} placeholder="Outcome" className={`${fieldClass} md:col-span-2`} />
                <input name="order" type="number" defaultValue={project.order} className={fieldClass} />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input name="featured" type="checkbox" defaultChecked={project.featured} /> Featured
                </label>
                <button className={`${primaryBtn} md:col-span-2`}>
                  <Save className="h-4 w-4" />
                  Save Project
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <BriefcaseBusiness className="h-5 w-5 text-cyan-300" />
              Work Experience
            </h2>
            <p className="mt-1 text-sm text-slate-400">Add roles and bullet points shown on flip cards.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.experiences.length} roles</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new experience</summary>
          <form action={createExperience} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="role" placeholder="Role" required className={fieldClass} />
            <input name="company" placeholder="Company" required className={fieldClass} />
            <textarea name="description" placeholder="Short role summary" rows={2} className={`${fieldClass} md:col-span-2`} />
            <input name="startDate" type="date" required className={fieldClass} />
            <input name="endDate" type="date" className={fieldClass} />
            <input name="order" type="number" placeholder="Order (1,2,3...)" className={fieldClass} />
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input name="isCurrent" type="checkbox" /> Current role
            </label>
            <textarea name="highlights" placeholder="Bullet points, one per line" rows={5} className={`${fieldClass} md:col-span-2`} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Experience</button>
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
                  <button className={dangerBtn}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </form>
              </div>
              <form action={updateExperience} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={exp.id} />
                <input name="role" defaultValue={exp.role} required className={fieldClass} />
                <input name="company" defaultValue={exp.company} required className={fieldClass} />
                <textarea name="description" defaultValue={exp.description ?? ""} rows={2} className={`${fieldClass} md:col-span-2`} />
                <input name="startDate" type="date" defaultValue={formatDateInput(exp.startDate)} required className={fieldClass} />
                <input name="endDate" type="date" defaultValue={formatDateInput(exp.endDate)} className={fieldClass} />
                <input name="order" type="number" defaultValue={exp.order} className={fieldClass} />
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input name="isCurrent" type="checkbox" defaultChecked={exp.isCurrent} /> Current role
                </label>
                <textarea
                  name="highlights"
                  defaultValue={exp.highlights.map((highlight) => highlight.text).join("\n")}
                  rows={8}
                  className={`${fieldClass} md:col-span-2`}
                />
                <button className={`${primaryBtn} md:col-span-2`}>
                  <Save className="h-4 w-4" />
                  Save Experience
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="education" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <GraduationCap className="h-5 w-5 text-cyan-300" />
              Education
            </h2>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.educations.length} records</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new education</summary>
          <form action={createEducation} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="degree" placeholder="Degree" required className={fieldClass} />
            <input name="institution" placeholder="Institution" required className={fieldClass} />
            <input name="startYear" type="number" placeholder="Start year" className={fieldClass} />
            <input name="endYear" type="number" placeholder="End year" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Education</button>
          </form>
        </details>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {profile.educations.map((edu) => (
            <article key={edu.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <form action={updateEducation} className="grid gap-3">
                <input type="hidden" name="id" value={edu.id} />
                <input name="degree" defaultValue={edu.degree} required className={fieldClass} />
                <input name="institution" defaultValue={edu.institution} required className={fieldClass} />
                <div className="grid gap-3 md:grid-cols-2">
                  <input name="startYear" type="number" defaultValue={edu.startYear ?? ""} placeholder="Start year" className={fieldClass} />
                  <input name="endYear" type="number" defaultValue={edu.endYear ?? ""} placeholder="End year" className={fieldClass} />
                </div>
                <button className={primaryBtn}>
                  <Save className="h-4 w-4" />
                  Save Education
                </button>
              </form>
              <form action={deleteEducation} className="mt-3">
                <input type="hidden" name="id" value={edu.id} />
                <button className={`${dangerBtn} w-full`}>
                  <Trash2 className="h-4 w-4" />
                  Delete Education
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
              <Pencil className="h-5 w-5 text-cyan-300" />
              Skills
            </h2>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.skills.length} skills</span>
        </div>

        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add new skill</summary>
          <form action={createSkill} className="mt-4 grid gap-3 md:grid-cols-3">
            <input name="name" placeholder="Skill" required className={fieldClass} />
            <input name="category" placeholder="Category" className={fieldClass} />
            <input name="level" placeholder="Level" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-3`}>Add Skill</button>
          </form>
        </details>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {profile.skills.map((skill) => (
            <article key={skill.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateSkill} className="grid gap-2">
                <input type="hidden" name="id" value={skill.id} />
                <input name="name" defaultValue={skill.name} required className={fieldClass} />
                <input name="category" defaultValue={skill.category ?? ""} placeholder="Category" className={fieldClass} />
                <input name="level" defaultValue={skill.level ?? ""} placeholder="Level" className={fieldClass} />
                <button className={primaryBtn}>
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </form>
              <form action={deleteSkill} className="mt-2">
                <input type="hidden" name="id" value={skill.id} />
                <button className={`${dangerBtn} w-full`}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="metrics" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Quality Snapshot Metrics</h2>
          <p className="text-sm text-slate-400">Hero metric cards (years, defects, domains, etc.).</p>
        </div>
        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add metric</summary>
          <form action={createMetric} className="mt-4 grid gap-3 md:grid-cols-3">
            <input name="label" placeholder="Label" required className={fieldClass} />
            <input name="value" placeholder="Value" required className={fieldClass} />
            <input name="order" type="number" placeholder="Order" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-3`}>Add Metric</button>
          </form>
        </details>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {profile.metrics.map((metric) => (
            <article key={metric.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateMetric} className="grid gap-2 md:grid-cols-3">
                <input type="hidden" name="id" value={metric.id} />
                <input name="label" defaultValue={metric.label} required className={fieldClass} />
                <input name="value" defaultValue={metric.value} required className={fieldClass} />
                <input name="order" type="number" defaultValue={metric.order} className={fieldClass} />
                <button className={`${primaryBtn} md:col-span-3`}>Save</button>
              </form>
              <form action={deleteMetric} className="mt-2">
                <input type="hidden" name="id" value={metric.id} />
                <button className={`${dangerBtn} w-full`}>Delete</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="signals" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Market Signals</h2>
          <p className="text-sm text-slate-400">Three capability cards under the hero. Tone: cyan, emerald, or amber.</p>
        </div>
        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add signal</summary>
          <form action={createMarketSignal} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="title" placeholder="Title" required className={fieldClass} />
            <select name="tone" className={fieldClass} defaultValue="cyan">
              <option value="cyan">cyan</option>
              <option value="emerald">emerald</option>
              <option value="amber">amber</option>
            </select>
            <textarea name="detail" placeholder="Detail" rows={3} required className={`${fieldClass} md:col-span-2`} />
            <input name="order" type="number" placeholder="Order" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Signal</button>
          </form>
        </details>
        <div className="mt-5 space-y-3">
          {profile.marketSignals.map((signal) => (
            <article key={signal.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateMarketSignal} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={signal.id} />
                <input name="title" defaultValue={signal.title} required className={fieldClass} />
                <select name="tone" defaultValue={signal.tone} className={fieldClass}>
                  <option value="cyan">cyan</option>
                  <option value="emerald">emerald</option>
                  <option value="amber">amber</option>
                </select>
                <textarea name="detail" defaultValue={signal.detail} rows={3} required className={`${fieldClass} md:col-span-2`} />
                <input name="order" type="number" defaultValue={signal.order} className={fieldClass} />
                <button className={primaryBtn}>Save</button>
              </form>
              <form action={deleteMarketSignal} className="mt-2">
                <input type="hidden" name="id" value={signal.id} />
                <button className={`${dangerBtn} w-full`}>Delete</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="delivery" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">QA Capability Map</h2>
          <p className="text-sm text-slate-400">Delivery stack rows (Manual QA, Automation, Backend, Workflow).</p>
        </div>
        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add delivery item</summary>
          <form action={createDeliveryItem} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="label" placeholder="Label" required className={fieldClass} />
            <input name="order" type="number" placeholder="Order" className={fieldClass} />
            <textarea name="value" placeholder="Value / details" rows={3} required className={`${fieldClass} md:col-span-2`} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Item</button>
          </form>
        </details>
        <div className="mt-5 space-y-3">
          {profile.deliveryItems.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateDeliveryItem} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={item.id} />
                <input name="label" defaultValue={item.label} required className={fieldClass} />
                <input name="order" type="number" defaultValue={item.order} className={fieldClass} />
                <textarea name="value" defaultValue={item.value} rows={3} required className={`${fieldClass} md:col-span-2`} />
                <button className={`${primaryBtn} md:col-span-2`}>Save</button>
              </form>
              <form action={deleteDeliveryItem} className="mt-2">
                <input type="hidden" name="id" value={item.id} />
                <button className={`${dangerBtn} w-full`}>Delete</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <MessageSquareQuote className="h-5 w-5 text-cyan-300" />
            Testimonials
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.testimonials.length}</span>
        </div>
        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add testimonial</summary>
          <form action={createTestimonial} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="role" placeholder="Role" className={fieldClass} />
            <input name="company" placeholder="Company" className={fieldClass} />
            <input name="rating" type="number" min={1} max={5} defaultValue={5} className={fieldClass} />
            <input name="imageUrl" placeholder="Image URL" className={`${fieldClass} md:col-span-2`} />
            <textarea name="content" placeholder="Quote" rows={4} required className={`${fieldClass} md:col-span-2`} />
            <input name="order" type="number" placeholder="Order" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Testimonial</button>
          </form>
        </details>
        <div className="mt-5 space-y-3">
          {profile.testimonials.map((t) => (
            <article key={t.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateTestimonial} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={t.id} />
                <input name="name" defaultValue={t.name} required className={fieldClass} />
                <input name="role" defaultValue={t.role ?? ""} className={fieldClass} />
                <input name="company" defaultValue={t.company ?? ""} className={fieldClass} />
                <input name="rating" type="number" min={1} max={5} defaultValue={t.rating ?? 5} className={fieldClass} />
                <input name="imageUrl" defaultValue={t.imageUrl ?? ""} className={`${fieldClass} md:col-span-2`} />
                <textarea name="content" defaultValue={t.content} rows={4} required className={`${fieldClass} md:col-span-2`} />
                <input name="order" type="number" defaultValue={t.order} className={fieldClass} />
                <button className={primaryBtn}>Save</button>
              </form>
              <form action={deleteTestimonial} className="mt-2">
                <input type="hidden" name="id" value={t.id} />
                <button className={`${dangerBtn} w-full`}>Delete</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="certs" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            Certifications
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{profile.certifications.length}</span>
        </div>
        <details className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-cyan-300">Add certification</summary>
          <form action={createCertification} className="mt-4 grid gap-3 md:grid-cols-2">
            <input name="name" placeholder="Name" required className={fieldClass} />
            <input name="issuer" placeholder="Issuer" className={fieldClass} />
            <input name="date" type="date" className={fieldClass} />
            <input name="expiryDate" type="date" className={fieldClass} />
            <input name="credentialId" placeholder="Credential ID" className={fieldClass} />
            <input name="credentialUrl" placeholder="Credential URL" className={fieldClass} />
            <button className={`${primaryBtn} md:col-span-2`}>Add Certification</button>
          </form>
        </details>
        <div className="mt-5 space-y-3">
          {profile.certifications.map((cert) => (
            <article key={cert.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <form action={updateCertification} className="grid gap-2 md:grid-cols-2">
                <input type="hidden" name="id" value={cert.id} />
                <input name="name" defaultValue={cert.name} required className={fieldClass} />
                <input name="issuer" defaultValue={cert.issuer ?? ""} className={fieldClass} />
                <input name="date" type="date" defaultValue={formatDateInput(cert.date)} className={fieldClass} />
                <input name="expiryDate" type="date" defaultValue={formatDateInput(cert.expiryDate)} className={fieldClass} />
                <input name="credentialId" defaultValue={cert.credentialId ?? ""} className={fieldClass} />
                <input name="credentialUrl" defaultValue={cert.credentialUrl ?? ""} className={fieldClass} />
                <button className={`${primaryBtn} md:col-span-2`}>Save</button>
              </form>
              <form action={deleteCertification} className="mt-2">
                <input type="hidden" name="id" value={cert.id} />
                <button className={`${dangerBtn} w-full`}>Delete</button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section id="messages" className="glass-card scroll-mt-6 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <Inbox className="h-5 w-5 text-cyan-300" />
            Contact Messages
          </h2>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{unreadCount} unread</span>
        </div>
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className={`rounded-xl border p-4 ${msg.read ? "border-slate-800 bg-slate-950/50" : "border-cyan-500/30 bg-slate-950/80"}`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-white">
                    {msg.name}{" "}
                    <span className="font-normal text-cyan-300">&lt;{msg.email}&gt;</span>
                  </p>
                  <p className="text-xs text-slate-500">{msg.createdAt.toLocaleString()}</p>
                </div>
                <p className="mb-3 whitespace-pre-wrap text-sm text-slate-300">{msg.message}</p>
                <div className="flex flex-wrap gap-2">
                  {!msg.read ? (
                    <form action={markContactRead}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button className={primaryBtn}>Mark read</button>
                    </form>
                  ) : null}
                  <form action={deleteContactMessage}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button className={dangerBtn}>Delete</button>
                  </form>
                  <a href={`mailto:${msg.email}`} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-500/40">
                    Reply by email
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

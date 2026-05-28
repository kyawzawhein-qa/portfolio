import {
  Activity,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Code2,
  Database,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";
import Testimonial from "@/components/Testimonial";
import CertificationBadge from "@/components/CertificationBadge";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

type SkillView = { id: number; name: string; category: string | null };
type ExperienceHighlightView = { id: number; text: string; order: number };
type ExperienceView = {
  id: number;
  role: string;
  company: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  highlights: ExperienceHighlightView[];
};
type EducationView = {
  id: number;
  institution: string;
  degree: string;
  startYear: number | null;
  endYear: number | null;
};
type ProjectView = {
  id: number;
  title: string;
  description: string | null;
  technologies: string;
  url: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
};
type TestimonialView = {
  id: number;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number | null;
  imageUrl: string | null;
};
type CertificationView = {
  id: number;
  name: string;
  issuer: string | null;
  date: Date | null;
  expiryDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
};
type ProfileView = {
  name: string;
  title: string;
  email: string;
  phone: string | null;
  location: string | null;
  intro: string;
  summary: string;
  profileImage: string | null;
  skills: SkillView[];
  experiences: ExperienceView[];
  educations: EducationView[];
  projects: ProjectView[];
  testimonials: TestimonialView[];
  certifications: CertificationView[];
};

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "2-digit", year: "numeric" });

function formatRange(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const start = dateFmt.format(startDate);
  if (isCurrent) return `${start} - present`;
  if (!endDate) return `${start}`;
  return `${start} - ${dateFmt.format(endDate)}`;
}

function parseTechnologies(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

function formatEducationYears(startYear: number | null, endYear: number | null) {
  if (!startYear && !endYear) return null;
  if (startYear && endYear) return `${startYear} - ${endYear}`;
  if (startYear) return `${startYear} - Present`;
  return String(endYear);
}

export default async function HomePage() {
  const profile = (await prisma.profile.findFirst({
    include: {
      experiences: { orderBy: { order: "asc" }, include: { highlights: { orderBy: { order: "asc" } } } },
      educations: true,
      skills: { orderBy: { name: "asc" } },
      projects: { orderBy: [{ featured: "desc" }, { order: "asc" }] },
      testimonials: { orderBy: { order: "asc" } },
      certifications: { orderBy: { date: "desc" } }
    }
  })) as ProfileView | null;

  if (!profile) {
    return (
      <div className="glass-card p-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">No profile data found</h1>
        <p className="text-slate-400">Run seed script to populate initial portfolio data.</p>
      </div>
    );
  }

  const groupedSkills = profile.skills.reduce<Record<string, string[]>>((acc: Record<string, string[]>, skill: SkillView) => {
    const key = skill.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill.name);
    return acc;
  }, {});

  const experienceYears = new Date().getFullYear() - 2021;
  const metricCards = [
    { label: "Years in QA", value: `${experienceYears}+` },
    { label: "FinTech domains", value: "Trading, Payments" },
    { label: "Defects tracked", value: "50+" },
    { label: "Test cases executed", value: "300+" }
  ];
  const marketSignals = [
    {
      title: "Trading Platform QA",
      detail: "Order workflows, trade lifecycle, FIX logs, equities, ETFs, and backend validation.",
      icon: Activity,
      tone: "cyan"
    },
    {
      title: "Automation Engineering",
      detail: "Playwright, TypeScript, Page Object Model, regression coverage, and CI execution.",
      icon: Code2,
      tone: "emerald"
    },
    {
      title: "Data & API Confidence",
      detail: "SQL validation, Postman API testing, RTM coverage, and defect lifecycle discipline.",
      icon: Database,
      tone: "amber"
    }
  ];
  const deliveryStack = [
    { label: "Manual QA", value: "Smoke, sanity, GUI, E2E, exploratory, boundary, regression" },
    { label: "Automation", value: "Playwright, TypeScript, POM, cross-browser execution" },
    { label: "Backend", value: "SQL, API validation, FIX protocol log analysis" },
    { label: "Workflow", value: "Agile ceremonies, JIRA, Zephyr, GitHub, CI/CD" }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="hero-grid glass-card animate-fade-in-up overflow-hidden p-8">
        <div className="flex justify-between items-center mb-4">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-wider text-cyan-300">
            <Sparkles className="h-4 w-4" />
            QA Engineer Portfolio
          </p>
          <ThemeToggle />
        </div>
        <div className="grid items-start gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="animate-slide-in-left">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">{profile.name}</h1>
            <h2 className="mt-2 text-xl text-cyan-300">{profile.title}</h2>
            <p className="mt-4 max-w-3xl text-slate-300">{profile.intro}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {["FinTech QA", "Trading Systems", "Playwright Automation"].map((item) => (
                <span key={item} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-300" />{profile.email}</p>
              {profile.phone ? <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-300" />{profile.phone}</p> : null}
              {profile.location ? <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-300" />{profile.location}</p> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/KYAWZAWHEIN_QA_ENGINEER.docx"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Download Resume
              </Link>
              <a
                href="https://linkedin.com/in/kyawzawhein"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-cyan-500 bg-cyan-500/20 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30 flex items-center gap-2"
              >
                LinkedIn
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a
                href="https://github.com/kyawzawhein"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-cyan-500 bg-cyan-500/20 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="animate-slide-in-right space-y-4">
            {profile.profileImage && (
              <div className="profile-image-wrapper animate-float h-64 w-full">
                <img src={profile.profileImage} alt={profile.name} />
              </div>
            )}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
              <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                <ChartNoAxesCombined className="h-4 w-4 text-cyan-300" />
                Quality Snapshot
              </p>
              <div className="grid grid-cols-2 gap-3">
                {metricCards.map((item: { label: string; value: string }) => (
                  <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all hover:border-cyan-500/50 hover:bg-slate-800">
                    <p className="text-lg font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {marketSignals.map((signal) => {
          const Icon = signal.icon;
          const toneClass =
            signal.tone === "emerald"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : signal.tone === "amber"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
          return (
            <article key={signal.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-600">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${toneClass}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold normal-case tracking-normal text-white">{signal.title}</h3>
              <p className="text-sm leading-6 text-slate-400">{signal.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.15s"}}>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">QA Capability Map</h3>
            <p className="max-w-3xl text-sm leading-6 text-slate-400">
              A resume-backed view of where manual testing, automation, backend validation, and delivery process meet.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <ShieldCheck className="h-4 w-4" />
            Release quality focus
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {deliveryStack.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="mb-2 text-sm font-semibold text-white">{item.label}</p>
              <p className="text-sm leading-6 text-slate-400">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Professional Summary */}
      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.2s"}}>
        <h3 className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-400">Professional Summary</h3>
        <p className="leading-7 text-slate-300">{profile.summary}</p>
      </section>

      {/* Skills */}
      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.3s"}}>
        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Skills</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(groupedSkills).map(([category, names]: [string, string[]]) => (
            <article key={category} className="animate-stagger rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-950">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{category}</p>
              <div className="flex flex-wrap gap-2">
                {names.map((name: string) => (
                  <span key={`${category}-${name}`} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-200 transition-all hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                    {name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Projects */}
      {profile.projects.length > 0 && (
        <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.4s"}}>
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <Sparkles className="h-4 w-4" />
            Projects
          </h3>
          <div className="space-y-4 animate-stagger">
            {profile.projects.map((project: ProjectView) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description ?? ""}
                technologies={parseTechnologies(project.technologies)}
                url={project.url ?? undefined}
                githubUrl={project.githubUrl ?? undefined}
                imageUrl={project.imageUrl ?? undefined}
                featured={project.featured}
              />
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.5s"}}>
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
              <BriefcaseBusiness className="h-4 w-4" />
              Work Experience
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Click a card to flip from role snapshot to resume-backed delivery details.
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {profile.experiences.length} roles
          </span>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {profile.experiences.map((exp: ExperienceView) => (
            <div key={exp.id} className="experience-flip-card">
              <input id={`experience-${exp.id}`} type="checkbox" className="experience-flip-toggle" />
              <label htmlFor={`experience-${exp.id}`} className="experience-flip-label">
                <span className="experience-flip-inner">
                  <span className="experience-flip-face experience-flip-front">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                      <BriefcaseBusiness className="h-5 w-5" />
                    </span>
                    <span className="block">
                      <span className="mt-5 block text-2xl font-semibold leading-tight text-white">{exp.role}</span>
                      <span className="mt-2 block text-base font-medium text-cyan-300">{exp.company}</span>
                      <span className="mt-4 block rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-300">
                        {formatRange(exp.startDate, exp.endDate, exp.isCurrent)}
                      </span>
                    </span>
                    {exp.description ? (
                      <span className="mt-5 block text-sm leading-6 text-slate-400">{exp.description}</span>
                    ) : null}
                    <span className="mt-auto inline-flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      View details
                      <Sparkles className="h-4 w-4 text-cyan-300" />
                    </span>
                  </span>

                  <span className="experience-flip-face experience-flip-back">
                    <span className="mb-3 flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-sm uppercase tracking-[0.18em] text-cyan-300">Key impact</span>
                        <span className="mt-1 block text-lg font-semibold text-white">{exp.company}</span>
                      </span>
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Flip back</span>
                    </span>
                    {exp.highlights.length > 0 ? (
                      <span className="experience-flip-scroll">
                        {exp.highlights.map((highlight: ExperienceHighlightView) => (
                          <span key={highlight.id} className="experience-flip-bullet">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                            <span>{highlight.text}</span>
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">No bullet points yet.</span>
                    )}
                  </span>
                </span>
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.6s"}}>
        <h3 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
          <GraduationCap className="h-4 w-4" />
          Education
        </h3>
        <div className="space-y-3 animate-stagger">
          {profile.educations.map((edu: EducationView) => (
            <article key={edu.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-950">
              <p className="font-medium text-white">{edu.degree}</p>
              <p className="text-sm text-slate-300">{edu.institution}</p>
              {formatEducationYears(edu.startYear, edu.endYear) ? (
                <p className="text-sm text-slate-500">
                  {formatEducationYears(edu.startYear, edu.endYear)}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {profile.testimonials.length > 0 && (
        <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.7s"}}>
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <Mail className="h-4 w-4" />
            Testimonials
          </h3>
          <div className="space-y-4 animate-stagger">
            {profile.testimonials.map((testimonial: TestimonialView) => (
              <Testimonial
                key={testimonial.id}
                name={testimonial.name}
                role={testimonial.role ?? undefined}
                company={testimonial.company ?? undefined}
                content={testimonial.content}
                rating={testimonial.rating ?? 5}
                imageUrl={testimonial.imageUrl ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {profile.certifications.length > 0 && (
        <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.8s"}}>
          <h3 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <ChartNoAxesCombined className="h-4 w-4" />
            Certifications
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-stagger">
            {profile.certifications.map((cert: CertificationView) => (
              <CertificationBadge
                key={cert.id}
                name={cert.name}
                issuer={cert.issuer ?? undefined}
                date={cert.date ?? undefined}
                expiryDate={cert.expiryDate ?? undefined}
                credentialId={cert.credentialId ?? undefined}
                credentialUrl={cert.credentialUrl ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="glass-card animate-fade-in-up p-6" style={{animationDelay: "0.9s"}}>
        <h3 className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Get In Touch</h3>
          <p className="mb-4 text-slate-300">
            I&apos;m always open to discussing QA opportunities, testing challenges, or just connecting with fellow professionals. Feel free to reach out!
          </p>
        <div className="space-y-4">
          <form action="#" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input type="text" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input type="email" required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring" />
              </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
               <textarea rows={4} required className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"></textarea>
            </div>
            <button type="submit" className="w-full rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

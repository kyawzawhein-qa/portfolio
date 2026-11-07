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
import { parseJsonStringArray } from "@/lib/parse";
import ProjectCard from "@/components/ProjectCard";
import Testimonial from "@/components/Testimonial";
import CertificationBadge from "@/components/CertificationBadge";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "2-digit", year: "numeric" });

function formatRange(startDate: Date, endDate: Date | null, isCurrent: boolean) {
  const start = dateFmt.format(startDate);
  if (isCurrent) return `${start} - present`;
  if (!endDate) return `${start}`;
  return `${start} - ${dateFmt.format(endDate)}`;
}

function formatEducationYears(startYear: number | null, endYear: number | null) {
  if (!startYear && !endYear) return null;
  if (startYear && endYear) return `${startYear} - ${endYear}`;
  if (startYear) return `${startYear} - Present`;
  return String(endYear);
}

const signalIcons = [Activity, Code2, Database] as const;

export default async function HomePage() {
  const profile = await prisma.profile.findFirst({
    include: {
      experiences: { orderBy: { order: "asc" }, include: { highlights: { orderBy: { order: "asc" } } } },
      educations: true,
      skills: { orderBy: { name: "asc" } },
      projects: { orderBy: [{ featured: "desc" }, { order: "asc" }] },
      testimonials: { orderBy: { order: "asc" } },
      certifications: { orderBy: { date: "desc" } },
      metrics: { orderBy: { order: "asc" } },
      marketSignals: { orderBy: { order: "asc" } },
      deliveryItems: { orderBy: { order: "asc" } }
    }
  });

  if (!profile) {
    return (
      <div className="glass-card p-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">No profile data found</h1>
        <p className="text-slate-400">Run seed script to populate initial portfolio data.</p>
      </div>
    );
  }

  const groupedSkills = profile.skills.reduce<Record<string, string[]>>((acc, skill) => {
    const key = skill.category || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill.name);
    return acc;
  }, {});

  const heroTags = parseJsonStringArray(profile.heroTags);
  const resumeHref = profile.resumeUrl || "/KYAWZAWHEIN_QA_ENGINEER.docx";
  const linkedinUrl = profile.linkedinUrl || "https://linkedin.com/in/kyawzawhein";
  const githubUrl = profile.githubUrl || "https://github.com/kyawzawhein";

  return (
    <div className="space-y-6">
      <section className="hero-grid glass-card animate-fade-in-up overflow-hidden p-8">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-wider text-cyan-300">
          <Sparkles className="h-4 w-4" />
          QA Engineer Portfolio
        </p>
        <div className="grid items-start gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="animate-slide-in-left">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">{profile.name}</h1>
            <p className="mt-2 text-xl text-cyan-300">{profile.title}</p>
            <p className="mt-4 max-w-3xl text-slate-300">{profile.intro}</p>
            {heroTags.length > 0 ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {heroTags.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                <a href={`mailto:${profile.email}`} className="hover:text-cyan-300">
                  {profile.email}
                </a>
              </p>
              {profile.phone ? (
                <p className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-cyan-300" />
                  {profile.phone}
                </p>
              ) : null}
              {profile.location ? (
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-300" />
                  {profile.location}
                </p>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Download Resume
              </Link>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-cyan-500 bg-cyan-500/20 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30"
              >
                LinkedIn
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-cyan-500 bg-cyan-500/20 px-5 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/30"
              >
                GitHub
              </a>
            </div>
          </div>
          <div className="animate-slide-in-right space-y-4">
            {profile.profileImage ? (
              <div className="profile-image-wrapper animate-float h-64 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.profileImage} alt={profile.name} loading="eager" />
              </div>
            ) : null}
            {profile.metrics.length > 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <p className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                  <ChartNoAxesCombined className="h-4 w-4 text-cyan-300" />
                  Quality Snapshot
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {profile.metrics.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-3 transition-all hover:border-cyan-500/50 hover:bg-slate-800"
                    >
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                      <p className="text-xs text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {profile.marketSignals.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-3">
          {profile.marketSignals.map((signal, index) => {
            const Icon = signalIcons[index % signalIcons.length];
            const toneClass =
              signal.tone === "emerald"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : signal.tone === "amber"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
            return (
              <article key={signal.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 transition hover:border-slate-600">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border ${toneClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mb-2 text-base font-semibold normal-case tracking-normal text-white">{signal.title}</h2>
                <p className="text-sm leading-6 text-slate-400">{signal.detail}</p>
              </article>
            );
          })}
        </section>
      ) : null}

      {profile.deliveryItems.length > 0 ? (
        <section className="glass-card animate-fade-in-up p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-400">QA Capability Map</h2>
              <p className="max-w-3xl text-sm leading-6 text-slate-400">
                Where manual testing, automation, backend validation, and delivery process meet.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Release quality focus
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {profile.deliveryItems.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="mb-2 text-sm font-semibold text-white">{item.label}</p>
                <p className="text-sm leading-6 text-slate-400">{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="glass-card animate-fade-in-up p-6">
        <h2 className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-400">Professional Summary</h2>
        <p className="leading-7 text-slate-300">{profile.summary}</p>
      </section>

      <section className="glass-card animate-fade-in-up p-6">
        <h2 className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Skills</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(groupedSkills).map(([category, names]) => (
            <article
              key={category}
              className="animate-stagger rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-950"
            >
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300">{category}</p>
              <div className="flex flex-wrap gap-2">
                {names.map((name) => (
                  <span
                    key={`${category}-${name}`}
                    className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-200 transition-all hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {profile.projects.length > 0 ? (
        <section className="glass-card animate-fade-in-up p-6">
          <h2 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <Sparkles className="h-4 w-4" />
            Projects & Playwright Demos
          </h2>
          <div className="animate-stagger space-y-4">
            {profile.projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description ?? ""}
                technologies={parseJsonStringArray(project.technologies)}
                url={project.url ?? undefined}
                githubUrl={project.githubUrl ?? undefined}
                imageUrl={project.imageUrl ?? undefined}
                category={project.category ?? undefined}
                problem={project.problem ?? undefined}
                approach={project.approach ?? undefined}
                outcome={project.outcome ?? undefined}
                featured={project.featured}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="glass-card animate-fade-in-up p-6">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
              <BriefcaseBusiness className="h-4 w-4" />
              Work Experience
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Select a card to flip from role snapshot to delivery details.
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {profile.experiences.length} roles
          </span>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {profile.experiences.map((exp) => (
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
                    {exp.description ? <span className="mt-5 block text-sm leading-6 text-slate-400">{exp.description}</span> : null}
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
                        {exp.highlights.map((highlight) => (
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

      <section className="glass-card animate-fade-in-up p-6">
        <h2 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
          <GraduationCap className="h-4 w-4" />
          Education
        </h2>
        <div className="animate-stagger space-y-3">
          {profile.educations.map((edu) => (
            <article
              key={edu.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-950"
            >
              <p className="font-medium text-white">{edu.degree}</p>
              <p className="text-sm text-slate-300">{edu.institution}</p>
              {formatEducationYears(edu.startYear, edu.endYear) ? (
                <p className="text-sm text-slate-500">{formatEducationYears(edu.startYear, edu.endYear)}</p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {profile.testimonials.length > 0 ? (
        <section className="glass-card animate-fade-in-up p-6">
          <h2 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <Mail className="h-4 w-4" />
            Testimonials
          </h2>
          <div className="animate-stagger space-y-4">
            {profile.testimonials.map((testimonial) => (
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
      ) : null}

      {profile.certifications.length > 0 ? (
        <section className="glass-card animate-fade-in-up p-6">
          <h2 className="mb-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-slate-400">
            <ChartNoAxesCombined className="h-4 w-4" />
            Certifications
          </h2>
          <div className="grid animate-stagger gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profile.certifications.map((cert) => (
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
      ) : null}

      <section className="glass-card animate-fade-in-up p-6">
        <h2 className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Get In Touch</h2>
        <p className="mb-4 text-slate-300">
          Open to QA opportunities, testing challenges, or connecting with fellow professionals.
        </p>
        <ContactForm />
      </section>
    </div>
  );
}

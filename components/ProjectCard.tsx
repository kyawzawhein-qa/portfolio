import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
  category?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  url,
  githubUrl,
  imageUrl,
  category,
  problem,
  approach,
  outcome,
  featured = false
}: ProjectCardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-950 ${
        featured ? "border-cyan-500/30 bg-slate-900/40" : ""
      }`}
    >
      {imageUrl ? (
        <div className="mb-4 overflow-hidden rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={`${title} screenshot`}
            loading="lazy"
            className="h-48 w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      ) : null}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-semibold normal-case tracking-normal text-white">{title}</h3>
        {category ? (
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-200">
            {category}
          </span>
        ) : null}
        {featured ? (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-200">
            Featured
          </span>
        ) : null}
      </div>
      <p className="mb-4 text-slate-300">{description}</p>
      {(problem || approach || outcome) && (
        <dl className="mb-4 space-y-2 text-sm">
          {problem ? (
            <div>
              <dt className="font-semibold text-slate-200">Problem</dt>
              <dd className="text-slate-400">{problem}</dd>
            </div>
          ) : null}
          {approach ? (
            <div>
              <dt className="font-semibold text-slate-200">Approach</dt>
              <dd className="text-slate-400">{approach}</dd>
            </div>
          ) : null}
          {outcome ? (
            <div>
              <dt className="font-semibold text-slate-200">Outcome</dt>
              <dd className="text-slate-400">{outcome}</dd>
            </div>
          ) : null}
        </dl>
      )}
      {technologies.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200 transition-all hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {githubUrl ? (
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-900 sm:w-auto"
          >
            GitHub
          </Link>
        ) : null}
        {url ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400 sm:w-auto"
          >
            Live Demo
          </Link>
        ) : null}
      </div>
    </article>
  );
}

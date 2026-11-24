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
      className={`rounded-xl border border-border bg-card/90 p-6 transition-all hover:border-accent/50 hover:bg-card ${
        featured ? "border-accent/30 bg-muted/60" : ""
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
        <h3 className="text-lg font-semibold normal-case tracking-normal text-foreground">{title}</h3>
        {category ? (
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {category}
          </span>
        ) : null}
        {featured ? (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-200">
            Featured
          </span>
        ) : null}
      </div>
      <p className="mb-4 text-foreground/90">{description}</p>
      {(problem || approach || outcome) && (
        <dl className="mb-4 space-y-2 text-sm">
          {problem ? (
            <div>
              <dt className="font-semibold text-foreground">Problem</dt>
              <dd className="text-muted-foreground">{problem}</dd>
            </div>
          ) : null}
          {approach ? (
            <div>
              <dt className="font-semibold text-foreground">Approach</dt>
              <dd className="text-muted-foreground">{approach}</dd>
            </div>
          ) : null}
          {outcome ? (
            <div>
              <dt className="font-semibold text-foreground">Outcome</dt>
              <dd className="text-muted-foreground">{outcome}</dd>
            </div>
          ) : null}
        </dl>
      )}
      {technologies.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="skill-tag text-xs">
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
            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-muted sm:w-auto"
          >
            GitHub
          </Link>
        ) : null}
        {url ? (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:text-slate-950 sm:w-auto"
          >
            Live Demo
          </Link>
        ) : null}
      </div>
    </article>
  );
}
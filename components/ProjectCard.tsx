import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  technologies,
  url,
  githubUrl,
  imageUrl,
  featured = false,
}: ProjectCardProps) {
  return (
    <article
      className={`rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-950 ${
        featured
          ? "border-cyan-500/30 bg-slate-900/40"
          : ""
      }`}
    >
      {imageUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={`${title} screenshot`}
            className="w-full h-48 object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <h3 className="mb-3 text-lg font-semibold text-white">
        {title}
      </h3>
      <p className="mb-4 text-slate-300 line-clamp-3">{description}</p>
      {technologies.length > 0 && (
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
      )}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {url && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Live Demo
          </Link>
        )}
        {githubUrl && (
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:bg-cyan-900"
          >
            GitHub
          </Link>
        )}
      </div>
    </article>
  );
}
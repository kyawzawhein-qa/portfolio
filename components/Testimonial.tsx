interface TestimonialProps {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  imageUrl?: string;
}

export default function Testimonial({
  name,
  role,
  company,
  content,
  rating = 5,
  imageUrl,
}: TestimonialProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-950">
      {imageUrl && (
        <div className="mb-4 flex items-center gap-3">
          <img
            src={imageUrl}
            alt={`${name}'s photo`}
            className="h-12 w-12 rounded-full border-2 border-cyan-500/30 object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">{name}</h3>
            {role && (
              <p className="text-sm text-slate-400">
                {role}{company ? " at " : ""}{company}
              </p>
            )}
          </div>
        </div>
      )}
      <p className="mb-4 text-slate-300 line-clamp-4 italic">
        &ldquo;{content}&rdquo;
      </p>
      {rating > 0 && (
        <div className="flex items-center gap-1 text-cyan-400" aria-label={`${rating} out of 5 rating`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="h-4 w-4" aria-hidden="true">
              {i < rating ? "*" : "-"}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

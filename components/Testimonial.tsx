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
  imageUrl
}: TestimonialProps) {
  return (
    <article className="rounded-xl border border-border bg-card/90 p-6 transition-all hover:border-accent/50 hover:bg-card">
      <div className="mb-4 flex items-center gap-3">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${name}'s photo`}
            className="h-12 w-12 rounded-full border-2 border-accent/30 object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/30 bg-muted text-sm font-semibold text-accent"
            aria-hidden="true"
          >
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="font-semibold normal-case tracking-normal text-foreground">{name}</h3>
          {(role || company) && (
            <p className="text-sm text-muted-foreground">
              {role}
              {role && company ? " at " : ""}
              {company}
            </p>
          )}
        </div>
      </div>
      <p className="mb-4 italic text-foreground/90">&ldquo;{content}&rdquo;</p>
      {rating > 0 ? (
        <div className="flex items-center gap-1 text-accent" aria-label={`${rating} out of 5 rating`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} aria-hidden="true">
              {i < rating ? "★" : "☆"}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
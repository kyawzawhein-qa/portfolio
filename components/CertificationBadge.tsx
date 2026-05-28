interface CertificationBadgeProps {
  name: string;
  issuer?: string;
  date?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export default function CertificationBadge({
  name,
  issuer,
  date,
  expiryDate,
  credentialId,
  credentialUrl,
}: CertificationBadgeProps) {
  const formatDate = (d: Date | undefined) => {
    if (!d) return "";
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(d);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-cyan-500/50 hover:bg-slate-950">
      <h3 className="mb-2 font-semibold text-white">{name}</h3>
      {issuer && (
        <p className="mb-1 text-sm text-slate-400">
          Issued by {issuer}
        </p>
      )}
      {date && (
        <p className="mb-1 text-sm text-slate-400">
          Issued {formatDate(date)}
        </p>
      )}
      {expiryDate && (
        <p className="mb-1 text-sm text-slate-400">
          Expires {formatDate(expiryDate)}
        </p>
      )}
      {credentialId && (
        <p className="mb-1 text-sm text-slate-400">
          Credential ID: {credentialId}
        </p>
      )}
      {credentialUrl && (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
        >
          Verify Credential
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}
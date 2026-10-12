import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogMarkdownProps = {
  content: string;
};

export default function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-prose">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <a href={href} className="text-cyan-300 underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        )
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
};

export function HelpContentMarkdown({ content }: Props) {
  return (
    <div className="help-content">
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => <h2 className="help-content-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="help-content-h3" {...props} />,
          p: ({ node, ...props }) => <p className="help-content-p" {...props} />,
          ul: ({ node, ...props }) => <ul className="help-content-ul" {...props} />,
          ol: ({ node, ...props }) => <ol className="help-content-ol" {...props} />,
          li: ({ node, ...props }) => <li className="help-content-li" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-vivant-navy" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

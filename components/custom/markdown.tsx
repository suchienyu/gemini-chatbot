import React, { memo } from "react";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import remarkGfm from "remark-gfm";


const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    // 添加圖片處理
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      console.log("Rendering image with src:", src);
      if (!src) return null;
      
      return (
        <img
          src={src}
          alt={alt || ''}
          className="max-w-full h-auto my-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          loading="lazy"
          onClick={(e) => {
            console.error("Image loading error:", e)
            const target = e.target as HTMLImageElement;
            if (!target.classList.contains('expanded')) {
              const overlay = document.createElement('div');
              overlay.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center';
              const img = document.createElement('img');
              img.src = src;
              img.className = 'max-w-[90vw] max-h-[90vh] object-contain expanded';
              overlay.appendChild(img);
              overlay.onclick = () => overlay.remove();
              document.body.appendChild(overlay);
            }
          }}
        />
      );
    },
  };

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]} 
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icons from "../../components/Icons";
import { use } from "react";

interface BlogPost {
  id: string;
  title: string;
  date: string | null;
  tags: string[];
  cover: string | null;
  author: string | null;
  content: any[];
}

export default function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blog/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPost(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load blog post");
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const renderBlock = (block: any) => {
    const type = block.type;
    const content = block[type];

    switch (type) {
      case "paragraph":
        return (
          <p className="blog-paragraph">
            {content.rich_text.map((text: any, i: number) => {
              let element = text.plain_text;
              if (text.annotations.bold) element = <strong key={i}>{element}</strong>;
              if (text.annotations.italic) element = <em key={i}>{element}</em>;
              if (text.annotations.code) element = <code key={i}>{element}</code>;
              if (text.href) element = <a key={i} href={text.href} target="_blank" rel="noopener noreferrer">{element}</a>;
              return element;
            })}
          </p>
        );
      case "heading_1":
        return <h1 className="blog-h1">{content.rich_text[0]?.plain_text}</h1>;
      case "heading_2":
        return <h2 className="blog-h2">{content.rich_text[0]?.plain_text}</h2>;
      case "heading_3":
        return <h3 className="blog-h3">{content.rich_text[0]?.plain_text}</h3>;
      case "bulleted_list_item":
        return <li className="blog-li">{content.rich_text[0]?.plain_text}</li>;
      case "numbered_list_item":
        return <li className="blog-li">{content.rich_text[0]?.plain_text}</li>;
      case "code":
        return (
          <pre className="blog-code">
            <code>{content.rich_text[0]?.plain_text}</code>
          </pre>
        );
      case "quote":
        return <blockquote className="blog-quote">{content.rich_text[0]?.plain_text}</blockquote>;
      case "divider":
        return <hr className="blog-divider" />;
      case "image":
        const imageUrl = content.external?.url || content.file?.url;
        return imageUrl ? <img src={imageUrl} alt="Blog image" className="blog-image" /> : null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-loading">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-error">
          {error || "Post not found"}
          <Link href="/blog" className="back-to-blog">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <Link href="/blog" className="back-link">
        <Icons name="ArrowLeft" />
        <span>Back to Blog</span>
      </Link>

      <article className="blog-post">
        {post.cover && (
          <div className="blog-post-cover">
            <img src={post.cover} alt={post.title} />
          </div>
        )}

        <header className="blog-post-header">
          <h1 className="blog-post-title">{post.title}</h1>
          
          <div className="blog-post-meta">
            {post.author && (
              <span className="blog-post-author">
                <Icons name="User" />
                {post.author}
              </span>
            )}
            {post.date && (
              <span className="blog-post-date">
                <Icons name="Calendar" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-post-content">
          {post.content.map((block: any, index: number) => (
            <div key={block.id || index}>{renderBlock(block)}</div>
          ))}
        </div>
      </article>
    </div>
  );
}

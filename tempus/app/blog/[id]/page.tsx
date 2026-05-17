"use client";

import { useEffect, useState, type ReactNode } from "react";
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

interface NotionRichText {
  plain_text?: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    color?: string;
  };
  text?: {
    link?: {
      url?: string;
    } | null;
  };
}

interface NotionBlock {
  id?: string;
  type?: string;
  [key: string]: any;
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

  const renderRichText = (richText: NotionRichText[] = []) => {
    if (richText.length === 0) {
      return null;
    }

    return richText.map((text, index) => {
      let element: ReactNode = text.plain_text || "";

      if (text.annotations?.code) {
        element = <code key={`code-${index}`}>{element}</code>;
      }
      if (text.annotations?.bold) {
        element = <strong key={`bold-${index}`}>{element}</strong>;
      }
      if (text.annotations?.italic) {
        element = <em key={`italic-${index}`}>{element}</em>;
      }
      if (text.annotations?.strikethrough) {
        element = <s key={`strike-${index}`}>{element}</s>;
      }
      if (text.annotations?.underline) {
        element = <u key={`underline-${index}`}>{element}</u>;
      }

      const href = text.href || text.text?.link?.url;
      if (href) {
        element = (
          <a key={`link-${index}`} href={href} target="_blank" rel="noopener noreferrer">
            {element}
          </a>
        );
      }

      return <span key={`span-${index}`}>{element}</span>;
    });
  };

  const renderBlock = (block: NotionBlock) => {
    const type = block.type;
    const content = type ? block[type] : null;

    switch (type) {
      case "paragraph":
        return <p className="blog-paragraph">{renderRichText(content?.rich_text)}</p>;
      case "heading_1":
        return <h1 className="blog-h1">{renderRichText(content?.rich_text)}</h1>;
      case "heading_2":
        return <h2 className="blog-h2">{renderRichText(content?.rich_text)}</h2>;
      case "heading_3":
        return <h3 className="blog-h3">{renderRichText(content?.rich_text)}</h3>;
      case "code":
        return (
          <pre className="blog-code">
            <code>{renderRichText(content?.rich_text)}</code>
          </pre>
        );
      case "quote":
        return <blockquote className="blog-quote">{renderRichText(content?.rich_text)}</blockquote>;
      case "divider":
        return <hr className="blog-divider" />;
      case "callout":
        return <div className="blog-callout">{renderRichText(content?.rich_text)}</div>;
      case "image": {
        const imageUrl = content?.external?.url || content?.file?.url;
        const captionText = content?.caption?.[0]?.plain_text || "Blog image";
        return imageUrl ? (
          <figure className="blog-image-wrap">
            <img src={imageUrl} alt={captionText} className="blog-image" />
            {content?.caption?.length ? (
              <figcaption className="blog-image-caption">{renderRichText(content.caption)}</figcaption>
            ) : null}
          </figure>
        ) : null;
      }
      case "table": {
        const rows = (block.children || []).filter((child: NotionBlock) => child.type === "table_row");
        if (rows.length === 0) {
          return null;
        }

        return (
          <div className="blog-table-wrap">
            <table className="blog-table">
              <tbody>
                {rows.map((row: NotionBlock, rowIndex: number) => {
                  const cells = row.table_row?.cells || [];
                  return (
                    <tr key={row.id || rowIndex}>
                      {cells.map((cell: NotionRichText[], cellIndex: number) => (
                        <td key={`${row.id || rowIndex}-${cellIndex}`}>{renderRichText(cell)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderContent = (blocks: NotionBlock[]) => {
    const elements: React.ReactNode[] = [];
    let index = 0;

    while (index < blocks.length) {
      const block = blocks[index];
      const type = block?.type;

      if (type === "bulleted_list_item" || type === "numbered_list_item") {
        const items: NotionBlock[] = [];
        const listType = type;

        while (index < blocks.length && blocks[index]?.type === listType) {
          items.push(blocks[index]);
          index += 1;
        }

        const ListTag = listType === "bulleted_list_item" ? "ul" : "ol";

        elements.push(
          <ListTag className="blog-list" key={`${listType}-${items[0]?.id || index}`}>
            {items.map((item, itemIndex) => (
              <li className="blog-li" key={item.id || itemIndex}>
                {renderRichText(item[listType]?.rich_text)}
              </li>
            ))}
          </ListTag>
        );

        continue;
      }

      elements.push(
        <div key={block.id || index} className="blog-block">
          {renderBlock(block)}
        </div>
      );

      index += 1;
    }

    return elements;
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

        <div className="blog-post-content">{renderContent(post.content as NotionBlock[])}</div>
      </article>
    </div>
  );
}

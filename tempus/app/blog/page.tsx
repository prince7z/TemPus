'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icons } from '../components/Icons';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  tags: string[];
  cover: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <header className="blog-header">
        <Link href="/" className="back-link">
          <Icons.Mail />
          <span>TempusMail</span>
        </Link>
        <h1>Blog</h1>
        <p>Insights, guides, and updates about temporary email services</p>
      </header>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className="blog-card">
            {post.cover && (
              <div className="blog-card-image">
                <img src={post.cover} alt={post.title} />
              </div>
            )}
            <div className="blog-card-content">
              <div className="blog-card-tags">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <h2>{post.title}</h2>
              <div className="blog-card-meta">
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

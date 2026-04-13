import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Clock, User } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading posts...</div>;

  return (
    <div className="home-page animate-fade-in">
      <div className="hero-section text-center mb-8">
        <h1 className="hero-title">Discover thoughts, <br/><span className="gradient-text">ideas, and stories.</span></h1>
        <p className="hero-subtitle text-secondary">A space for creative minds to articulate and share their vision with the world.</p>
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="text-center col-span-full">No posts found. Be the first to write one!</p>
        ) : (
          posts.map(post => (
            <Link to={`/post/${post._id}`} key={post._id} className="post-card glass">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">{post.content.substring(0, 120)}...</p>
              <div className="post-meta">
                <span className="post-author"><User size={14} /> {post.author?.username}</span>
                <span className="post-date"><Clock size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

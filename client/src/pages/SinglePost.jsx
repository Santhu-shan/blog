import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { User, Clock, Trash2, MessageSquare } from 'lucide-react';
import './SinglePost.css';

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data.post);
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await api.post(`/posts/${id}/comments`, { text: commentText });
      setComments([data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading post...</div>;
  if (!post) return <div className="text-center mt-8">Post not found.</div>;

  return (
    <div className="single-post-container animate-fade-in">
      <article className="glass post-article">
        <header className="post-header">
          <h1 className="post-title-lg">{post.title}</h1>
          <div className="post-meta-lg">
            <div className="meta-left">
              <span><User size={16} /> {post.author?.username}</span>
              <span><Clock size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            {user && user._id === post.author?._id && (
              <button onClick={handleDelete} className="btn-icon btn-danger-icon" title="Delete Post">
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </header>
        <div className="post-body">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-section mt-8">
        <h3 className="comments-title">
          <MessageSquare size={20} /> Comments ({comments.length})
        </h3>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form glass mb-6">
            <textarea
              placeholder="Add to the discussion..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="3"
            ></textarea>
            <div className="form-actions mt-2">
              <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
            </div>
          </form>
        ) : (
          <div className="glass p-4 mb-6 text-center text-secondary rounded">
            Please log in to leave a comment.
          </div>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment-item glass">
              <div className="comment-header">
                <strong>{comment.author?.username}</strong>
                <span className="text-xs text-secondary">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="comment-text mt-2">{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SinglePost;

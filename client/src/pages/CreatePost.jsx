import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import './CreatePost.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Title and content are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/posts', { title, content });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container animate-fade-in">
      <div className="glass create-post-box">
        <h2 className="mb-6">Write a new story</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group mb-4">
            <input
              type="text"
              className="post-title-input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group mb-6">
            <textarea
              className="post-content-input"
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="12"
            ></textarea>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn text-secondary" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import BlogForm from './components/BlogForm';  // Import the BlogForm component

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);  // State to toggle form visibility
  const [notification, setNotification] = useState(null);  // State for notifications

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/blogs');
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const createBlog = async (newBlogData) => {
    try {
      const response = await axios.post('http://localhost:5000/blogs', newBlogData);
      setBlogs([...blogs, response.data]);
      setNewBlog({ title: '', content: '', author: '' });
      setNotification({ message: 'Blog created successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
    } catch (err) {
      console.error('Error creating blog:', err);
      setNotification({ message: 'Error creating blog.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/blogs/${id}`);
      setBlogs(blogs.filter(blog => blog._id !== id));
      setNotification({ message: 'Blog deleted successfully!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error deleting blog:', err);
      setNotification({ message: 'Error deleting blog.', type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div>
      <h1>
        <img src="/icon.ico" alt="Blog Icon" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
        Simple Blog
      </h1>


      {/* Floating Toast Notification */}
      {notification && (
        <div className={`toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="create-blog-container">
        <button className="toggle-button" onClick={toggleFormVisibility}>
          {isFormVisible ? 'Minimize Form' : 'Create New Blog'}
        </button>

        {isFormVisible && (
          <BlogForm onCreate={createBlog} />
        )}
      </div>

      <div>
    <h2>All Blogs</h2>
    {blogs
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))  // Sort blogs in descending order
      .map(blog => (
        <div key={blog._id}>
          <div className="blog-post">
            <div className="blog-header">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-author">
                <strong>Author:</strong> {blog.author} 
                <span className="blog-date">| {new Date(blog.createdAt).toLocaleString()}</span>
              </p>
            </div>

            <div className="blog-content">
              <p>{blog.content}</p>
            </div>

            <div className="blog-footer">
              <button className="delete-btn" onClick={() => deleteBlog(blog._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
</div>

    </div>
  );
};

export default App;

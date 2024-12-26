import React from 'react';
import './BlogList.css'; // Add custom styles for the LinkedIn-like design

const BlogList = ({ blogs, onDelete }) => (
  <div className="blog-list">
    {blogs.map((blog) => (
      <div className="blog-card" key={blog._id}>
        <div className="blog-header">
          <h3 className="blog-title">{blog.title}</h3>
          <div className="blog-meta">
            <span className="author-name">By {blog.author}</span>
            <span className="post-date">{new Date(blog.date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="blog-content">
          <p>{blog.content}</p>
        </div>
        <div className="blog-footer">
          <button className="delete-btn" onClick={() => onDelete(blog._id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
);

export default BlogList;

import React, { useState } from 'react';

const BlogForm = ({ onCreate }) => {
  const [newBlog, setNewBlog] = useState({ title: '', content: '', author: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newBlog); // Pass the new blog data to the parent component
    setNewBlog({ title: '', content: '', author: '' }); // Reset form fields
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Blog</h2>
      <input
        type="text"
        placeholder="Title"
        value={newBlog.title}
        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        value={newBlog.content}
        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={newBlog.author}
        onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
      />
      <button type="submit">Create Blog</button>
    </form>
  );
};

export default BlogForm;

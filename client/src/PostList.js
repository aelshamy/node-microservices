import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const response = await axios.get('http://localhost:4002/posts');
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {Object.values(posts).map((post) => {
        return (
          <div
            key={post.id}
            className="card"
            style={{ width: '30%', marginBottom: '20px' }}
          >
            <div className="card-body">
              <h3>{post.title}</h3>
              <CommentList comments={post.comments} />
              <CommentCreate postId={post.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

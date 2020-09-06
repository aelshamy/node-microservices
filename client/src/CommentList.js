import React from 'react';

export default ({ comments }) => {
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      <ul>
        {comments.map((comment) => {
          let content;
          if (comment.status === 'approved') {
            content = comment.content;
          }
          if (comment.status === 'pending') {
            content = 'This comments is awaiting moderation';
          }
          if (comment.status === 'rejected') {
            content = 'This comments has been rejected';
          }
          return <li key={comment.id}>{content}</li>;
        })}
      </ul>
    </div>
  );
};

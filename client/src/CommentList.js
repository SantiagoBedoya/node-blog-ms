const CommentList = ({ comments }) => {
  const rendererComments = comments.map((comment) => {
    let content;
    if (comment.status === "approved") {
      content = comment.content;
    }
    if (comment.status === "pending") {
      content = "This comment is awaiting moderation";
    }
    if (comment.status === "rejected") {
      content = "This comment is has been rejected";
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{rendererComments}</ul>;
};

export default CommentList;

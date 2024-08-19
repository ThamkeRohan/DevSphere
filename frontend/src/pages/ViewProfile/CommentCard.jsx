import { Link } from "react-router-dom"
export default function CommentCard({comment}) {
    return (
      <Link to={`/comments/${comment._id}`}>
        <div className="comment-card card">
          <h4 className="text-md-bold">{comment.post.title}</h4>
          <div>
            <p>{comment.content}</p>
            <span className="text-sm">{comment.createdAt}</span>
          </div>
        </div>
      </Link>
    );
}
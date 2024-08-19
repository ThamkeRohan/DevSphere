import Comment from "./index"
export function CommentsStack({comments}) {
    return (
        <div className="comments-stack">
            {comments.map(comment => <Comment key={comment._id} {...comment}/>)}
        </div>
    )
}
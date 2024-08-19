import { useParams } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination";
import { getUserComments } from "../../services/user";
import CommentCard from "./CommentCard";
import ActionLoading from "../../components/ActionLoading";
import Toast from "../../components/Toast";

const COMMENTS_PAGE_SIZE = 2;

export default function UserCommentsList() {
    const {userId} = useParams()
    const {
      loading,
      error,
      pages: comments,
      hasMore,
      next,
    } = usePagination((page, limit, search) => getUserComments({page, limit, userId: search}), COMMENTS_PAGE_SIZE, userId )
    
    return (
      <>
        {comments?.length > 0 && (
          <section className="comments">
            <h3>Comments made</h3>
            <div>
              {comments.map((comment) => (
                <CommentCard comment={comment} key={comment._id} />
              ))}
            </div>
            {loading && <ActionLoading />}
            {error && <Toast type="error" message={error} />}
            {hasMore && <button className="btn btn-regular btn-load" onClick={() => next()}>Load more...</button>}
          </section>
        )}
      </>
    );
}

import { usePagination } from "../../hooks/usePagination";
import { getUserPosts } from "../../services/user";
import PostCard from "../../components/PostCard";
import { useParams } from "react-router-dom";
import ActionLoading from "../../components/ActionLoading";
import Toast from "../../components/Toast"

const POSTS_PAGE_SIZE = 2;

export default function UserPostsList() {
  const {userId} = useParams();
  const {
    loading,
    error,
    pages: posts,
    hasMore,
    next,
  } = usePagination(
    (page, limit, search) => getUserPosts({ page, limit, userId: search }), POSTS_PAGE_SIZE, userId
    ); 
  return (
    <>
      {posts?.length > 0 && (
        <section className="posts">
          <h3>Posts made</h3>
          <div>
            {posts.map((post) => (
              <PostCard post={post} key={post._id} />
            ))}
          </div>
          {loading && <ActionLoading />}
          {error && <Toast type="error" message={error} />}
          {hasMore && (
            <button className="btn btn-regular btn-load" type="button" onClick={() => next()}>
              Load more...
            </button>
          )}
        </section>
      )}
    </>
  );
}

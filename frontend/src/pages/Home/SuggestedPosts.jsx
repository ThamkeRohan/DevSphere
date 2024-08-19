import { useCallback, useRef } from "react";
import { usePagination } from "../../hooks/usePagination";
import { getRecommendedPosts } from "../../services/user";
import PostCard from "../../components/PostCard";
import ActionLoading from "../../components/ActionLoading";
import Toast from "../../components/Toast";
import { useAuth } from "../../contexts/AuthContext";

const PAGE_SIZE = 10;

export default function SuggestedPosts() {
  const loggedInUser = useAuth();
  const {
    loading,
    error,
    pages: posts,
    hasMore,
    next,
  } = usePagination(
    (page, limit, search) =>
      getRecommendedPosts({ page, limit, userId: search }),
    PAGE_SIZE,
    loggedInUser._id
  );
  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          next();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <section>
      <ul className="posts-list">
        {posts?.length > 0 &&
          posts.map((post, index) => {
            if (index + 1 === posts.length) {
              return (
                <PostCard key={post._id} post={post} ref={lastPostElementRef} />
              );
            } else {
              return <PostCard key={post._id} post={post} />;
            }
          })}
      </ul>
      <div>
        {loading && <ActionLoading />}
        {error && <Toast type="error" message={error} />}
      </div>
    </section>
  );
}

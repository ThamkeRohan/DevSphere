import { useRef, useState, useCallback } from "react"
import MultiSelect from "../../components/MultiSelect"
import { getPosts } from "../../services/post"
import PostCard from "../../components/PostCard"
import { usePagination } from "../../hooks/usePagination"
import ActionLoading from "../../components/ActionLoading"
import Toast from "../../components/Toast"
import { useLocation } from "react-router-dom"

const PAGE_SIZE = 10
function SearchPosts() {
    const {state} = useLocation()
    const [selectedTags, setSelectedTags] = useState(state?.selectedTag != null ? [state.selectedTag] : [] )
    const selectedTagsStr = selectedTags.map((selectedTag) => selectedTag.name).join(",")
    const {
      loading,
      error,
      pages: posts,
      hasMore,
      next,
      reset
    } = usePagination(
      (page, limit, search) => getPosts({ page, limit, selectedTags: search }),
      PAGE_SIZE,
      selectedTagsStr
    );
    
    const observer = useRef();
    const lastPostElementRef = useCallback(
      (node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasMore) {
            next()
          }
        });
        if (node) observer.current.observe(node);
      },
      [loading, hasMore]
    );
    
    return (
      <div className="search container-md">
        <h1 className="page-heading">Search</h1>
        <MultiSelect
          selectedOptions={selectedTags}
          placeholder="Select tags..."
          setSelectedOptions={(o) => {
            setSelectedTags(o);
            reset();
          }}
        />
        <div>
          {posts.length > 0 && (
            <section className="posts-list">
              {posts.map((post, index) => {
                if (index + 1 === posts.length) {
                  return (
                    <PostCard
                      key={post._id}
                      post={post}
                      ref={lastPostElementRef}
                    />
                  );
                } else {
                  return <PostCard key={post._id} post={post} />;
                }
              })}
            </section>
          )}
          {!loading && posts.length === 0 && (
            <div>
              It seems there are no posts available for your search
            </div>
          )}
          <div>
            {loading && <ActionLoading />}
            {error && <Toast type="error" message={error} />}
          </div>
        </div>
      </div>
    );
}

export default SearchPosts
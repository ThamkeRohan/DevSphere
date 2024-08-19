import { useNavigate, useParams } from "react-router-dom"
import {useAsync, useAsyncFn} from "../../hooks/useAsync"
import {editPost, getPost} from "../../services/post"
import PostForm from "../../components/PostForm"
import { useAuth } from "../../contexts/AuthContext"
import PageLoading from "../../components/PageLoading"

export default function EditPost() {
    const {postId} = useParams()
    const loggedInUser = useAuth()
    const {loading, error, value: post} = useAsync(() => getPost({postId}), [postId])
    const editPostFn = useAsyncFn(editPost)
    const navigate = useNavigate()
    
    function onEdit({title, coverImageUrl, tags, content, description}) {
        return editPostFn
          .execute({
            _id: postId,
            title,
            coverImageUrl,
            tags,
            content,
            description,
            author: { _id: loggedInUser._id, name: loggedInUser.name, profileImageUrl: loggedInUser.profileImageUrl},
          })
          .then((res) =>
            navigate(`/posts/${res._id}`, {
              replace: true,
            })
          );
    }
    console.log(post);
    
    if (loading) {
      return <PageLoading/>;
    }
    if (error) {
      return error;
    }

    return (
        <div className="container-md">
            <h1 className="page-heading">Edit Post</h1>
            <PostForm
                initialCoverImageUrl={post.coverImageUrl}
                initialTitle={post.title}
                initialDescription={post.description}
                initialSelectedTags={post.tags}
                initialMarkdown={post.content}
                createdAt={post.createdAt}
                onSubmit={onEdit}
                loading={editPostFn.loading}
                error={editPostFn.error}
                closeError={editPostFn.clearError}
            />
        </div>
    )
}
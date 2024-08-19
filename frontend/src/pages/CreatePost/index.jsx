import PostForm from "../../components/PostForm"
import { useAsyncFn } from "../../hooks/useAsync"
import { createPost } from "../../services/post"
import {useAuth} from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function CreatePost() {
    const createPostFn = useAsyncFn(createPost)
    const loggedInUser = useAuth()
    const navigate = useNavigate()
    function onCreate({title, coverImageUrl, tags, content, description}) {
        return createPostFn
          .execute({
            title,
            coverImageUrl,
            tags,
            content,
            description,
            author: {
              _id: loggedInUser._id,
              name: loggedInUser.name,
              profileImageUrl: loggedInUser.profileImageUrl,
            },
          })
          .then((res) =>
            navigate(`/posts/${res._id}`, {
              replace: true,
            })
          );
    }
    return (
      <>
        <div className="container-md">
          <h1 className="page-heading">New Post</h1>

          <PostForm
            onSubmit={onCreate}
            loading={createPostFn.loading}
            error={createPostFn.error}
            closeError={createPostFn.clearError}
          />
        </div>
      </>
    );
}

export default CreatePost
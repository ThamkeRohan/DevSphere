import { useState } from "react"
import {useNavigate} from "react-router-dom"
import {useAuth, useAuthUpdate} from "../../contexts/AuthContext"
import { useAsync, useAsyncFn } from "../../hooks/useAsync"
import { setFollowedTags } from "../../services/user"
import { getPopularTags } from "../../services/tag"
import Toast from "../../components/Toast"
import PageLoading from "../../components/PageLoading"

const MIN_SELECTED_TAGS = 5;

export default function SetupProfile() {
    const loggedInUser = useAuth()
    const { updateLoggedInUser } = useAuthUpdate();
    const { loading, error, value: tags } = useAsync(getPopularTags, []);
    const [selectedTags, setSelectedTags] = useState([])
   
    const setFollowedTagsFn = useAsyncFn(setFollowedTags)
    const navigate = useNavigate()
    function toggleTagSelect(tag) {
        if(selectedTags.find(selectedTag => selectedTag._id === tag._id)) {
            // unselect tag
            setSelectedTags(prevSelectedTags => prevSelectedTags.filter(prevSelectedTag => prevSelectedTag._id !== tag._id))
        }
        else{
            // select tag
            setSelectedTags(prevSelectedTags => [...prevSelectedTags, tag])
        }
    }
    function handleSubmit(e) {
        e.preventDefault()      
        setFollowedTagsFn
          .execute({
            userId: loggedInUser._id,
            followedTags: selectedTags.map((selectedTag) => selectedTag._id),
          })
          .then(({areTagsFollowed}) => {
            updateLoggedInUser({ areTagsFollowed });
            navigate("/", { replace: true });
          });
    }

    if (loading) {
      return <PageLoading/>;
    }
    if (error) {
      return error;
    }
    
    return (
      <div className="follow-tags container-md">
        <div>
          <h1 className="page-heading">What are you interested in?</h1>
          <p className="text-md">Follow tags to customize your feed. Select atleast 5 tags.</p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="text-lg-bold">{selectedTags.length} tags selected</div>
            <div className="tags-container">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTagSelect(tag)}
                  className={`tag-badge ${
                    selectedTags.some(
                      (selectedTag) => selectedTag._id === tag._id
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  <>
                    <div className="name">{tag.name}</div>
                    <div className="post-count">{tag.postCount}</div>
                  </>
                  <div></div>
                </button>
              ))}
            </div>

            <button className="btn btn-submit" disabled={selectedTags.length < MIN_SELECTED_TAGS}>Submit</button>
            {setFollowedTagsFn.error && <Toast type="error" message={setFollowedTagsFn.error}/>}
          </form>
        </div>
      </div>
    );
}
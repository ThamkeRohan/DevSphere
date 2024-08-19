import { MIN_SELECTED_FOLLOWS, MIN_SELECTED_TAGS } from "../../constants/misc";
import { useAsync } from "../../hooks/useAsync";
import { getSuggestedFollows } from "../../services/user";
import FormWrapper from "./FormWrapper";

export default function FollowForm({selectedTags, selectedFollows, toggleSelectedFollows}) {
    const {
      loading,
      error,
      value: suggestedFollows,
    } = useAsync(
      () =>
        getSuggestedFollows({
          selectedTags: selectedTags
            .map((selectedTag) => selectedTag._id)
            .join(),
        }),
      []
    );
    if(loading) {
        return "Loading";
    }
    if(error) {
        return error
    }
    return (
      <FormWrapper
        title="Suggested follows"
        descriptioin="Kickstart your community"
      >
        {selectedFollows.length < MIN_SELECTED_FOLLOWS && <div>Select atleast {MIN_SELECTED_TAGS} people.</div>}
        <div>You're following {selectedFollows.length} people</div>
        <div>
          {suggestedFollows.map((user) => (
            <div key={user._id}>
              <div>
                <img src={user.profileImageUrl} alt="profile-image" />
              </div>
              <div>
                <div>
                  <strong>{user.username}</strong>
                </div>
                <p>{user.bio}</p>
              </div>
              <button type="button" onClick={() => toggleSelectedFollows(user)}>
                {selectedFollows.some(
                  (selectedFollow) => selectedFollow._id === user._id
                )
                  ? "Following"
                  : "Follow"}
              </button>
            </div>
          ))}
        </div>
      </FormWrapper>
    );
}
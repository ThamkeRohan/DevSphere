import { MIN_SELECTED_TAGS } from "../../constants/misc";
import { useAsync } from "../../hooks/useAsync";
import { getPopularTags } from "../../services/tag";
import FormWrapper from "./FormWrapper";

export default function TagForm({selectedTags, toggleTagSelect}) {
    const {loading, error, value: tags} = useAsync(getPopularTags, [])
    if(loading) {
        return "Loading"
    }
    if(error) {
        return error
    }
    return (
      <FormWrapper
        title="What are you interested in?"
        description="Follow tags to customize your feed"
      >
        
      </FormWrapper>
    );
}
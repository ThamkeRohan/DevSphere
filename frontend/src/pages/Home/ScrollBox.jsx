import {getUserFollowedTags} from '../../services/user'
import {useAsync} from "../../hooks/useAsync"
import ActionLoading from "../../components/ActionLoading"
import Toast from "../../components/Toast"
import Slider from './Slider'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'


export default function ScrollBox() {
    const loggedInUser = useAuth()
    const {loading, error, value: followedTags} = useAsync(() => getUserFollowedTags({userId: loggedInUser._id}))
    const navigate = useNavigate()
    if(loading) {
        return <ActionLoading/>
    }
    if(error) {
        return <Toast type="error" message={error}/>
    }
    
    return (
      <>
        <Slider
          breakPoints={[
            { width: 700, itemsToShow: 5, step: 5 },
            { width: 200, itemsToShow: 2, step: 2 },
          ]}
        >
          {followedTags.map((followedTag) => (
            <button
              className='slider-tag text-sm-bold'
              type="button"
              key={followedTag._id}
              onClick={() => navigate("/search",  {state: {selectedTag: followedTag}})}
            >
              {followedTag.name}
            </button>
          ))}
        </Slider>
      </>
    );
}
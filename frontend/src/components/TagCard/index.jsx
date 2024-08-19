import React, { useEffect, useState } from 'react'
import { useAsyncFn } from '../../hooks/useAsync';
import { toggleTagFollow } from '../../services/user';
import {useAuth} from "../../contexts/AuthContext"
import Toast from "../../components/Toast"

export default function TagCard({_id, name, postCount, followedByMe}) {
    const [isFollowedByMe, setIsFollowedByMe] = useState(false)
    const loggedInUser = useAuth()
    const toggleTagFollowFn = useAsyncFn(toggleTagFollow)

    useEffect(() => {
        setIsFollowedByMe(followedByMe)
    }, [followedByMe])

    function handleToggleTagFollow() {
        toggleTagFollowFn.execute({
            userId: loggedInUser._id,
            tagId: _id
        })
        .then(({followedByMe}) => setIsFollowedByMe(followedByMe))
    }
  return (
    <div className="tag-card card">
      <div>
        <p className='tag-name text-normal-bold'>{name}</p>
        <p className='tag-post-count text-sm'>{postCount} posts</p>
      </div>
      <button className={`btn ${isFollowedByMe ? "btn-regular" : "btn-filled"}`} type='button' onClick={handleToggleTagFollow}>{isFollowedByMe ? "Unfollow" : "Follow"}</button>
      {toggleTagFollowFn.error && <Toast type="error" message={toggleTagFollowFn.error}/>}
    </div>
  );
}

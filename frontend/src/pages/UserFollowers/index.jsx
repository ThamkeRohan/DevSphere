import React from 'react'
import {useParams, Link} from "react-router-dom"
import { getUserFollowers } from '../../services/user'
import {useAsync} from "../../hooks/useAsync"
import PageLoading from "../../components/PageLoading"
import Error from '../../components/Error'

export default function UserFollowers() {
    const {userId} = useParams()
    const {loading, error, value: followers} = useAsync(() => getUserFollowers({userId}), [userId])

    if(loading) {
        return <PageLoading/>
    }
    if(error) {
        return <Error message={error}/>
    }
  return (
    <div className="container-md">
      <h1 className="page-heading">Followers</h1>
      <div className="user-connections">
        {followers?.length > 0 &&
          followers.map((follower) => (
            <Link to={`/users/${follower._id}/profile`} key={follower._id}>
              <div className="user-card card">
                <div className="profile-image">
                  <img src={follower.profileImageUrl} alt="profile-image" />
                </div>
                <div>
                  <p>
                    <strong className='text-md-bold'>{follower.email}</strong>
                  </p>
                  <p className='text-sm'>{follower.name}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

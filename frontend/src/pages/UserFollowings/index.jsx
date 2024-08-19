import React from "react";
import { useParams, Link } from "react-router-dom";
import { getUserFollowings } from "../../services/user";
import { useAsync } from "../../hooks/useAsync";
import PageLoading from "../../components/PageLoading";
import Error from "../../components/Error";

export default function UserFollowings() {
  const { userId } = useParams();
  const {
    loading,
    error,
    value: followings,
  } = useAsync(() => getUserFollowings({ userId }), [userId]);

  if (loading) {
    return <PageLoading />;
  }
  if (error) {
    return <Error message={error} />;
  }
  return (
    <div className="container-md">
      <h1 className="page-heading">Following</h1>
      <div className="user-connections">
        {followings?.length > 0 &&
          followings.map((following) => (
            <Link to={`/users/${following._id}/profile`} key={following._id}>
              <div className="user-card card">
                <div className="profile-image">
                  <img src={following.profileImageUrl} alt="profile-image" />
                </div>
                <div>
                  <p className="text-md-bold">
                    <strong>{following.email}</strong>
                  </p>
                  <p className="text-sm">{following.name}</p>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

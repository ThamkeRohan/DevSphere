import ProfileLink from "./ProfileLink";
import { useAsync, useAsyncFn } from "../../hooks/useAsync";
import { getUserProfile, toggleUserFollow } from "../../services/user";
import { useAuth } from "../../contexts/AuthContext";
import GITHUB_ICON from "../../assets/icons/github.svg";
import STACKOVERFLOW_ICON from "../../assets/icons/stackoverflow.svg";
import TWITTER_ICON from "../../assets/icons/twitter.svg";
import LINKEDIN_ICON from "../../assets/icons/linkedin.svg";
import BIRTHDAY_ICON from "../../assets/icons/birthday.svg";
import LINK_ICON from "../../assets/icons/link.svg";
import ContributionStats from "./ContributionStats";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import Error from "../../components/Error";
import PageLoading from "../../components/PageLoading";
import Toast from "../../components/Toast";

export default function UserDetail() {
  const [followedByMe, setFollowedByMe] = useState();
  const loggedInUser = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { userId } = useParams();
  const {
    loading,
    error,
    value: user,
    clearError,
    refresh,
  } = useAsync(() => getUserProfile({ userId }, []));
  const toggleUserFollowFn = useAsyncFn(toggleUserFollow);
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null) return;
    setFollowedByMe(user.followedByMe);
  }, [user]);

  function onFollow() {
    if (loggedInUser == null) {
      setIsOpen(true);
      return;
    }
    toggleUserFollowFn
      .execute({ userId })
      .then((res) => setFollowedByMe(res.followedByMe));
  }
  if (loading) {
    return <PageLoading />;
  }
  if (error) {
    return <Error message={error} onRefresh={refresh} />;
  }
  return (
    <div className="user-detail">
      <div className="head">
        {loggedInUser != null && loggedInUser._id === user._id ? (
          <button
            className="btn btn-filled text-normal-bold"
            onClick={() => navigate(`/users/${loggedInUser._id}/editProfile`)}
          >
            Edit
          </button>
        ) : (
          <div>
            <button
              className="btn btn-filled text-normal-bold"
              onClick={onFollow}
              disabled={toggleUserFollowFn.loading}
            >
              {followedByMe ? "Unfollow" : "Follow"}
            </button>
            {toggleUserFollowFn.error && (
              <Toast
                type="error"
                message={toggleUserFollowFn.error}
                isClosable
                onClose={toggleUserFollowFn.clearError}
              />
            )}
          </div>
        )}
      </div>

      <div className="basic">
        <div className="profile-image">
          <img src={user.profileImageUrl} alt="user-image" />
        </div>

        <h3 className="username text-xl-bold">{user.name}</h3>
        <p className="email text-sm-bold">{user.email}</p>
        <p className="bio">{user.bio}</p>
        <div className="connections">
          <Link to={`/users/${user._id}/followers`}>
            <span className="followers">
              <span className="connections-count text-md-bold">{user.followerCount}</span>
              <label>Followers</label>
            </span>
          </Link>
          <Link to={`/users/${user._id}/followings`}>
            <span className="followings">
              <span className="connections-count text-md-bold">{user.followingCount}</span>
              <label>Following</label>
            </span>
          </Link>
        </div>
      </div>

      <div className="meta">
        <span className="profile-link">
          <div className="icon">
            <img src={BIRTHDAY_ICON} alt="birthday-icon" />
          </div>
          <p className="text-sm">Joined on {user.createdAt}</p>
        </span>
        {user.website && (
          <ProfileLink icon={LINK_ICON} redirectionUrl={user.website}>
            {user.website}
          </ProfileLink>
        )}
        {user.socialMedia?.twitter && (
          <ProfileLink
            icon={TWITTER_ICON}
            redirectionUrl={user.socialMedia.twitter}
          />
        )}
        {user.socialMedia?.linkedIn && (
          <ProfileLink
            icon={LINKEDIN_ICON}
            redirectionUrl={user.socialMedia.linkedIn}
          />
        )}
        {user.socialMedia?.stackOverflow && (
          <ProfileLink
            icon={STACKOVERFLOW_ICON}
            redirectionUrl={user.socialMedia.stackOverflow}
          />
        )}
        {user.socialMedia?.gitHub && (
          <ProfileLink
            icon={GITHUB_ICON}
            redirectionUrl={user.socialMedia.gitHub}
          />
        )}
      </div>
      <ContributionStats {...user.contributions} />
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  );
}

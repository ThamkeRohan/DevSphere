import {Link} from "react-router-dom"
import {IconButton} from "../../components/IconButton"
import { togglePostLike } from "../../services/post"
import {useAsyncFn} from "../../hooks/useAsync"
import NotificationHead from "./NotificationHead"
import {useNotificationUpdate} from "../../contexts/NotificationContext"
import NotificationWrapper from "./NotificationWrapper"
import { togglePostBookmark } from "../../services/user"
import { useAuth } from "../../contexts/AuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faBookmark,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFilled, faBookmark as faBookmarkFilled } from '@fortawesome/free-solid-svg-icons'


export default function NewPostNotification({notificationId, body, isRead}) {
    const loggedInUser = useAuth()
    const togglePostLikeFn = useAsyncFn(togglePostLike)
    const {toggleLocalPostLike, toggleLocalPostBookmark} = useNotificationUpdate()
    const togglePostBookmarkFn = useAsyncFn(togglePostBookmark)

    function onTogglePostLike() {
        togglePostLikeFn.execute({postId: body._id})
        .then((res) => toggleLocalPostLike(notificationId, res.likedByMe))
    }
    function onTogglePostBookmark() {
      togglePostBookmarkFn
        .execute({ userId: loggedInUser._id, postId: body._id })
        .then((res) => toggleLocalPostBookmark(notificationId, res.bookmarkedByMe));
    }
    
    return (
      <NotificationWrapper notificationId={notificationId}>
        <NotificationHead
          initiator={body.author}
          action="made a new post"
          createdAt={body.createdAt}
        />
        <div className="body">
          <div>
            <h3>
              <Link to={`/posts/${body._id}`}>{body.title}</Link>
            </h3>
            {/* <div>
              {body.tags.map((tag) => (
                <div className="tag" key={tag._id}>
                  {tag.name}
                </div>
              ))}
            </div> */}
          </div>

          <div className="footer">
            <IconButton
              styles="notification-btn"
              icon={
                body.likedByMe ? (
                  <FontAwesomeIcon icon={faHeartFilled} />
                ) : (
                  <FontAwesomeIcon icon={faHeart} />
                )
              }
              onClick={onTogglePostLike}
              isDisabled={togglePostLikeFn.loading}
              error={togglePostLikeFn.error}
              closeError={togglePostLikeFn.clearError}
            />
            <IconButton
              styles="notification-btn"
              icon={
                body.bookmarkedByMe ? (
                  <FontAwesomeIcon icon={faBookmarkFilled} />
                ) : (
                  <FontAwesomeIcon icon={faBookmark} />
                )
              }
              onClick={onTogglePostBookmark}
              isDisabled={togglePostBookmarkFn.loading}
              error={togglePostBookmarkFn.error}
              closeError={togglePostBookmarkFn.clearError}
            />
          </div>
        </div>
      </NotificationWrapper>
    );
}
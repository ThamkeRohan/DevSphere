import NotificationHead from "./NotificationHead";
import { useAsyncFn } from "../../hooks/useAsync";
import {toggleUserFollow} from "../../services/user"
import { useNotificationUpdate } from "../../contexts/NotificationContext";
import NotificationWrapper from "./NotificationWrapper";
import Toast from "../../components/Toast";

export default function FollowNotification({notificationId, body}) {
    const toggleUserFollowFn = useAsyncFn(toggleUserFollow)
    const { toggleLocalUserFollow } = useNotificationUpdate();
    function onToggleUserFollow() {
        toggleUserFollowFn.execute({userId: body.follower._id})
        .then(res => toggleLocalUserFollow(notificationId, res.followedByMe))
    }
    return (
      <NotificationWrapper notificationId={notificationId}>
        <NotificationHead initiator={body.follower} action="followed you!" />
        <div className="body">
          <div className="footer">
            <button
              className="notification-btn text-sm-bold"
              type="button"
              onClick={onToggleUserFollow}
            >
              {body.followedByMe ? "Unfollow" : "Follow"}
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
        </div>
      </NotificationWrapper>
    );
}
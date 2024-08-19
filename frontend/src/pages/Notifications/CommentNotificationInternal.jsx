import { IconButton } from "../../components/IconButton";
import CommentForm from "../../components/Comment/CommentForm";
import { useAsyncFn } from "../../hooks/useAsync";
import { createComment, toggleCommentLike } from "../../services/comment";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotificationUpdate } from "../../contexts/NotificationContext";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
} from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartFilled,
  faComment as faCommentFilled,
  faLink
} from "@fortawesome/free-solid-svg-icons";

export default function CommentNotificationInternal({notificationId, body}) {
    const [isReplying, setIsReplying] = useState(false);
    const loggedInUser = useAuth();
    const replyCommentFn = useAsyncFn(createComment)
    const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)
    const {replyLocalComment, toggleLocalCommentLike} = useNotificationUpdate()
    const navigate = useNavigate();
    function onReply(content) {
        return replyCommentFn.execute({content, madeBy: loggedInUser, post: body.post._id, parent: body._id})
        .then(comment => {
          replyLocalComment(notificationId, comment._id)
          setIsReplying(false);
        })

    }
    function onToggleCommentLike() {
        toggleCommentLikeFn.execute({postId: body.post._id, commentId: body._id})
        .then(res => toggleLocalCommentLike(notificationId, res.likedByMe))
    }
    return (
      <>
        <div>
          <strong>{body.madeBy.name} comment: </strong>
          {body.content}
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
            onClick={onToggleCommentLike}
            isDisabled={toggleCommentLikeFn.loading}
            error={toggleCommentLikeFn.error}
            closeError={toggleCommentLikeFn.clearError}
          />
          <IconButton
            styles="notification-btn"
            icon={<FontAwesomeIcon icon={faComment} />}
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            isDisabled={body.repliedByMe}
          />
          {/* <IconButton
            styles="notification-btn"
            icon={<FontAwesomeIcon icon={faLink} />}
          /> */}
        </div>
        {isReplying && (
          <CommentForm
            onSubmit={onReply}
            loading={replyCommentFn.loading}
            error={replyCommentFn.error}
            closeError={replyCommentFn.clearError}
            autoFocus={true}
          />
        )}
      </>
    );
}
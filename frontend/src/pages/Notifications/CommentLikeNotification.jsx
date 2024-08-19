import NotificationHead from "./NotificationHead";
import NotificationWrapper from "./NotificationWrapper";

export default function CommentLikeNotification({ notificationId, body }) {
  
  return (
    <NotificationWrapper notificationId={notificationId}>
      <NotificationHead
        initiator={body.likedBy}
        action="liked your comment"
        target={{ _id: body.comment.post, text: body.comment.content }}
      />
    </NotificationWrapper>
  );
}

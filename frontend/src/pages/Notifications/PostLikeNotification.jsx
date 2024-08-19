import NotificationHead from "./NotificationHead";
import NotificationWrapper from "./NotificationWrapper";

export default function PostLikeNotification({ body, notificationId }) {
  return (
    <NotificationWrapper notificationId={notificationId}>
      <NotificationHead
        initiator={body.likedBy}
        action="liked your post"
        target={{ _id: body.post._id, text: body.post.title }}
      />
    </NotificationWrapper>
  );
}
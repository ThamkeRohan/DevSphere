import CommentNotificationInternal from "./CommentNotificationInternal";
import NotificationHead from "./NotificationHead";
import NotificationWrapper from "./NotificationWrapper";

export default function CommentNotification({notificationId, body}) {
    return (
      <NotificationWrapper notificationId={notificationId}>
        <NotificationHead
          initiator={body.madeBy}
          action=" commented on the post "
          target={{ _id: body.post._id, text: body.post.title }}
          createdAt={body.createdAt}
        />
        <div className="body">
          <CommentNotificationInternal
            notificationId={notificationId}
            body={body}
          />
        </div>
      </NotificationWrapper>
    );
}

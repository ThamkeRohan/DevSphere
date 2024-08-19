import NotificationHead from "./NotificationHead";
import CommentNotificationInternal from "./CommentNotificationInternal";
import NotificationWrapper from "./NotificationWrapper";


export default function ReplyNotification({notificationId, body}) {
  
    return (
      <NotificationWrapper notificationId={notificationId}>
        <NotificationHead
          initiator={body.madeBy}
          action="replied to your comment in"
          target={{
            _id: body.post._id,
            text: body.post.title,
          }}
          createdAt={body.createdAt}
        />
        <div className="body">
          <div className="parent">
            <strong>Your comment: </strong>
            <span>{body.parent.content}</span>
          </div>
          <CommentNotificationInternal
            notificationId={notificationId}
            body={body}
          />
        </div>
      </NotificationWrapper>
    );
}

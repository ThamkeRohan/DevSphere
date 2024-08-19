import { useNotification } from "../../contexts/NotificationContext";
import NewPostNotification from "./NewPostNotification";
import CommentNotification from "./CommentNotification";
import ReplyNotification from "./ReplyNotification";
import FollowNotification from "./FollowNotification";
import PostLikeNotification from "./PostLikeNotification";
import CommentLikeNotification from "./CommentLikeNotification"
import { useEffect, useState } from "react";

export default function Notifications() {
    const {notifications} = useNotification()
    const [filteredNotifications, setFilteredNotifications] = useState([]) 
    useEffect(() => {
        setFilteredNotifications(notifications)
    }, [notifications])
    
    return (
      <div className="notifications container-lg">
        <h1 className="page-heading">Notifications</h1>
        <section className="notificaitons-nav">
          <button className="text-md btn" type="button" 
            onClick={() => setFilteredNotifications(notifications)}
            >All</button>
            <button className="text-md btn" type="button" 
            onClick={() => setFilteredNotifications(notifications.filter(notification => (notification.notificationType === "COMMENT" || notification.notificationType === "REPLY" || notification.notificationType === "COMMENT_LIKE")))}
            >Comments</button>
            <button type="button" className="text-md btn"
            onClick={() => setFilteredNotifications(notifications.filter(notification => (notification.notificationType === "NEW_POST" || notification.notificationType === "POST_LIKE")))}
            >Posts</button>
        </section>
        <section className="notifications-list">
          {filteredNotifications?.length > 0 ? (
            filteredNotifications.map((notification) => {
                switch (notification.notificationType) {
                  case "NEW_POST":
                    return (
                      <NewPostNotification key={notification.notificationId} {...notification}/>
                    );
                  case "COMMENT":
                    return (
                      <CommentNotification key={notification.notificationId} {...notification} />
                    );
                  case "REPLY":
                    return (
                      <ReplyNotification key={notification.notificationId} {...notification} />
                    );
                  case "FOLLOW":
                    return (
                      <FollowNotification key={notification.notificationId} {...notification} />
                    );
                  case "POST_LIKE":
                    return (
                      <PostLikeNotification key={notification.notificationId} {...notification} />
                    );
                  case "COMMENT_LIKE":
                    return (
                      <CommentLikeNotification key={notification.notificationId} {...notification} />
                    );
                }
            })
          ) : (
            <div>You're all caught up.</div>
          )}
        </section>
      </div>
    );
}
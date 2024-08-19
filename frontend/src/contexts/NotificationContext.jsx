import React, { useContext, useEffect, useState } from "react"
import { getNotifications } from "../services/notification"
import { useAsyncFn } from "../hooks/useAsync"
import { useAuth } from "./AuthContext"

const NotificationContext = React.createContext()
const NotificationUpdateContext = React.createContext()

export function useNotification() {
    return useContext(NotificationContext)
}
export function useNotificationUpdate() {
    return useContext(NotificationUpdateContext)
}
export function NotificationProvider({children}) {
    const loggedInUser = useAuth()
    const [notifications, setNotifications] = useState([])
    const getNotificationsFn = useAsyncFn(getNotifications);
    // console.log(notifications);
    useEffect(() => {
      if (loggedInUser == null) return;
      getNotificationsFn
        .execute()
        .then((initialNotifications) =>
          setNotifications(initialNotifications)
        );
      const subscription = new EventSource(
        "/api/notifications/subscribe",
        { withCredentials: true }
      );
      subscription.addEventListener("open", (event) => console.log(event.data));
      subscription.addEventListener("insert", (event) => {
        console.log(event);
        addLocalNotification(JSON.parse(event.data));
      });
      subscription.addEventListener("delete", (event) => {
        deleteLocalNotification(JSON.parse(event.data).notificationId);
      });
      subscription.onerror = (error) => {
        console.log(error);
        subscription.close();
      };

      return () => {
        console.log("closing conneciton");
        setNotifications([]);
        subscription.close();
      };
    }, [loggedInUser]);
    
    
    function addLocalNotification(notification) {
      setNotifications(prev => [notification, ...prev ])
    }
    function deleteLocalNotification(notificationId) {
      setNotifications(prev => prev.filter(notification => notification.notificationId !== notificationId))
    }
    function toggleLocalPostLike(notificationId, likedByMe) {
      setNotifications(prev => prev.map(notification => {
        if(notification.notificationId === notificationId) {
          return {...notification, body: {...notification.body, likedByMe}}
        }
        else{
          return notification
        } 
      }))
    }
    function toggleLocalCommentLike(notificationId, likedByMe) {
      setNotifications(prev => prev.map(notification => {
        if(notification.notificationId === notificationId) {
          return {...notification, body: {...notification.body, likedByMe}}
        }
        else{
          return notification
        } 
      }))
    }
    function toggleLocalPostBookmark(notificationId, bookmarkedByMe) {
      setNotifications(prev => prev.map(notification => {
        if(notification.notificationId === notificationId) {
          return {...notification, body: {...notification.body, bookmarkedByMe}}
        }
        else {
          return notification
        }
      }))
    }
    function replyLocalComment(notificationId, replyId) {
      setNotifications(prev => prev.map(notification => {
        if(notification.notificationId === notificationId) {
          return {...notification, body: {...notification.body, repliedByMe: true, reply: replyId}}
        }
        else {
          return notification
        }
      }))
    }
    function toggleLocalUserFollow(notificationId, followedByMe) {
      setNotifications(prev => prev.map(notification => {
        if(notification.notificationId === notificationId) {
          return {...notification, body: {...notification.body, followedByMe}}
        }
        else {
          return notification
        }
      }))
    }
    return (
      <NotificationContext.Provider value={{
        notifications,
        unReadNotificationsCount: notifications.length
        }}>
        <NotificationUpdateContext.Provider value={{
          addLocalNotification,
          deleteLocalNotification,
          toggleLocalPostLike,
          toggleLocalCommentLike,
          replyLocalComment,
          toggleLocalUserFollow,
          toggleLocalPostBookmark
        }}>
          {children}
        </NotificationUpdateContext.Provider>
      </NotificationContext.Provider>
    )
}
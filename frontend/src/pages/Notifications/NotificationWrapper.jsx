import Toast from "../../components/Toast";
import { useNotificationUpdate } from "../../contexts/NotificationContext";
import { useAsyncFn } from "../../hooks/useAsync";
import { markNotificationAsRead } from "../../services/notification";

export default function NotificationWrapper({ children, notificationId }) {
  const markNotificationAsReadFn = useAsyncFn(markNotificationAsRead);
  const {deleteLocalNotification} = useNotificationUpdate()
  
  function handleClick() {
    markNotificationAsReadFn
      .execute({ notificationId })
      .then((notification) => deleteLocalNotification(notification._id));
  }
  return (
    <div className={`notification card`}>
      {children}
      <div>
        <button
          className="btn btn-regular mark-as-read-btn"
          disabled={markNotificationAsReadFn.loading}
          onClick={handleClick}
        >
          Mark as read
        </button>
        {markNotificationAsReadFn.error && (
          <Toast type="error" message={markNotificationAsReadFn.error} />
        )}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

export default function NotificationHead({
  initiator,
  action,
  target,
  createdAt,
}) {
  return (
    <div className="notification-head">
      <div className="initiator-profile-image">
        <img src={initiator.profileImageUrl} alt="initiator" />
      </div>
      <div>
        <div className="action-details">
          <span>
            <strong>
              <Link to={`/users/${initiator._id}/profile`}>
                {initiator.name}{" "}
              </Link>
            </strong>
          </span>
          <span>{action} </span>
          {target != null && (
            <span>
              <strong>
                <Link to={`/posts/${target._id}`}>{target.text}</Link>
              </strong>
            </span>
          )}
        </div>

        {createdAt && <div className="created-at text-sm">{createdAt}</div>}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
export default function ProfileLink({ icon, redirectionUrl, children }) {
  return (
    <Link to={redirectionUrl}>
      <div className="profile-link">
        <div className="icon">
          <img src={icon} alt="" />
        </div>
        {children && <p className="text-sm">{children}</p>}
      </div>
    </Link>
  );
}

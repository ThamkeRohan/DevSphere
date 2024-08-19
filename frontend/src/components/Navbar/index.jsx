import {Link, useNavigate} from "react-router-dom"
import { useAuth, useAuthUpdate } from "../../contexts/AuthContext"
import { useNotification } from "../../contexts/NotificationContext"
import { IconButton } from "../IconButton"
import { useAsyncFn } from "../../hooks/useAsync"
import { logout } from "../../services/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowRightFromBracket, faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faBell } from "@fortawesome/free-regular-svg-icons"
import { useState } from "react"

export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const loggedInUser = useAuth()
    const {removeLoggedInUser} = useAuthUpdate()
    const {unReadNotificationsCount} = useNotification()
    const logoutFn = useAsyncFn(logout)

    function onLogout() {
      logoutFn.execute()
      .then(res => {
        removeLoggedInUser()
      })
    }
    
    return (
      <>
        <header className="app-header">
          <div className="container-lg">
            <div>
              <Link to="/">
                <h1 className="text-xl-bold">DEV</h1>
              </Link>
            </div>
            <div>
              <nav className="navbar">
                {loggedInUser != null ? (
                  <ul className="auth-user-nav">
                    <div className="visible-links">
                      <li>
                        <Link to="/search">
                          <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="icon-lg icon-light"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to={`/notifications`}>
                          <span className="notification-icon">
                            <span className="unread-notification-count text-sm">
                              {unReadNotificationsCount}
                            </span>
                            <FontAwesomeIcon
                              icon={faBell}
                              className="icon-lg icon-light"
                            />
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link to={`/users/${loggedInUser._id}/profile`}>
                          <div className="profile">
                            <div className="profile-image">
                              <img
                                src={loggedInUser.profileImageUrl}
                                alt="profile-image"
                              />
                            </div>

                            <p>{loggedInUser.name}</p>
                          </div>
                        </Link>
                      </li>
                      <button
                        onClick={() => setShowMenu((prev) => !prev)}
                        className="btn btn-dark"
                      >
                        {showMenu ? (
                          <FontAwesomeIcon
                            icon={faXmark}
                            className="icon-lg icon-light"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faBars}
                            className="icon-lg icon-light"
                          />
                        )}
                      </button>
                    </div>

                    <div className="conditionally-visible-links">
                      {showMenu && (
                        <div className="menu">
                          <li>
                            <Link to="/posts/new">New Post</Link>
                          </li>
                          <li>
                            <Link to={`/users/${loggedInUser._id}/profile`}>Profile</Link>
                          </li>
                          <li>
                            <Link to="/tags">Tags</Link>
                          </li>
                          <li>
                            <Link to="/bookmarkedPosts">Bookmarks</Link>
                          </li>

                          <li>
                            <IconButton
                              icon={
                                <FontAwesomeIcon
                                  className="icon-lg icon-light"
                                  icon={faArrowRightFromBracket}
                                />
                              }
                              onClick={onLogout}
                              isDisabled={logoutFn.loading}
                              error={logoutFn.error}
                              closeError={logoutFn.clearError}
                              styles="btn btn-dark"
                            >
                              <span>Logout</span>
                            </IconButton>
                          </li>
                        </div>
                      )}
                    </div>
                  </ul>
                ) : (
                  <ul className="unauth-user-nav">
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                    <li>
                      <Link to="/signup">Signup</Link>
                    </li>
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </header>
      </>
    );
}
import ReactDom from "react-dom"
import CROSS_ICON from "../../assets/icons/cross.svg"
import APP_LOGO from "../../assets/images/app-logo.jpg"
import { useNavigate } from "react-router-dom";

export default function Modal({onClose}) {
    const navigate = useNavigate()
    
    return ReactDom.createPortal(
      <>
        <div className="modal">
          <div className="backdrop">
            <div className="main">
              <h2>Log in to continue</h2>
              <button onClick={onClose}>
                <img src={CROSS_ICON} alt="close" />
              </button>
            </div>
            <div>
              <div>
                <img src={APP_LOGO} alt="app-logo" />
                <p>
                  We're a place where coders share, stay up-to-date and grow
                  their careers.
                </p>
              </div>
              <div>
                <button type="button" onClick={() => navigate("/login")}>
                  Log In
                </button>
                <button type="button" onClick={() => navigate("/signup")}>
                  Sign UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.getElementById("portal")
    );
}
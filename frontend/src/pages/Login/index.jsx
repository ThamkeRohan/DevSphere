import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AUTH_REGEX, VALIDATION_MSG } from "../../constants/authConstants";
import Toast from "../../components/Toast";
import { useAuthUpdate } from "../../contexts/AuthContext";
import {useAsyncFn} from "../../hooks/useAsync"
import {passwordBasedLogin} from "../../services/auth"
import { useNavigate } from "react-router-dom";
import ActionLoading from "../../components/ActionLoading";
import GOOGLE_ICON from "../../assets/icons/google-logo.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCheck, faXmark} from "@fortawesome/free-solid-svg-icons"

export default function Login() {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [focus, setFocus] = useState({
    email: true,
    password: false,
  });
  const [validation, setValidation] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const {createLoggedInUser} = useAuthUpdate()
  const passwordBasedLoginFn = useAsyncFn(passwordBasedLogin)
  
  function handleSubmit(e) {
    e.preventDefault();
    passwordBasedLoginFn.execute({
      data: fields
    })
    .then((user) => {
      createLoggedInUser(user)
      navigate("/", {replace: true})
    })
  }
  function handleGoogleLogin() {
     window.open(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/oauth/google`, "_self");
  }
  function handleOnFocus(e) {
    const fieldName = e.target.name;
    setFocus((prev) => ({ ...prev, [fieldName]: true }));
  }
  function handleOnBlur(e) {
    const fieldName = e.target.name;
    setFocus((prev) => ({ ...prev, [fieldName]: false }));
  }
  function handleChange(e) {
    const fieldName = e.target.name;
    setFields((prev) => ({ ...prev, [fieldName]: e.target.value }));
    setValidation((prev) => ({
      ...prev,
      [fieldName]: AUTH_REGEX[fieldName].test(e.target.value),
    }));
  }

  return (
    <div className="login container-sm">
      <h1 className="page-heaing">Login</h1>
      <>
        {passwordBasedLoginFn.error && (
          <Toast type="error" message={passwordBasedLoginFn.error} />
        )}
        <div className="continue-with-google">
          <button className="btn btn-regular" onClick={handleGoogleLogin}>
            <div className="google-icon">
              <img src={GOOGLE_ICON} alt="google-icon" />
            </div>
            Continue with Google
          </button>
        </div>
        <div className="password-based-auth">
          <form className="form login" onSubmit={handleSubmit}>
            <div className="entry">
              <label htmlFor="email">
                Email:
                {fields.email &&
                  (validation.email ? (
                    <FontAwesomeIcon icon={faCheck} className="check" />
                  ) : (
                    <FontAwesomeIcon icon={faXmark} className="cross" />
                  ))}
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={fields.email}
                onChange={handleChange}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
              />
              {focus.email && fields.email && !validation.email && (
                <div className="validation-message">{VALIDATION_MSG.email}</div>
              )}
            </div>
            <div className="entry">
              <label htmlFor="password">
                Password:
                {fields.password &&
                  (validation.password ? (
                    <FontAwesomeIcon icon={faCheck} className="check" />
                  ) : (
                    <FontAwesomeIcon icon={faXmark} className="cross" />
                  ))}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={fields.password}
                onChange={handleChange}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
              />
              {focus.password && fields.password && !validation.password && (
                <div className="validation-message">
                  {VALIDATION_MSG.password}
                </div>
              )}
            </div>
            <button
              className="btn btn-block btn-filled text-normal-bold submit-btn"
              disabled={
                !validation.email ||
                !validation.password ||
                passwordBasedLoginFn.loading
              }
            >
              {passwordBasedLoginFn.loading ? <ActionLoading /> : "Login"}
            </button>
          </form>
          <div className="switch-auth">
            Don't have an account? <Link to="/signup">Signup</Link>
          </div>
        </div>
      </>
    </div>
  );
}

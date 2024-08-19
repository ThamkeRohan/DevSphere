import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import { AUTH_REGEX, VALIDATION_MSG } from "../../constants/authConstants"
import Toast from "../../components/Toast"
import { passwordBasedSignup } from "../../services/auth"
import { useAsyncFn } from "../../hooks/useAsync"
import ActionLoading from "../../components/ActionLoading"
import { useAuthUpdate } from "../../contexts/AuthContext"
import GOOGLE_ICON from "../../assets/icons/google-logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
    const [fields, setFields] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: ""
    })
    const [focus, setFocus] = useState({
        email: true,
        name: false,
        password: false,
        confirmPassword: false
    })
    const [validation, setValidation] = useState({
        email: false,
        name: false,
        password: false,
        confirmPassword: false
    })

    const { createLoggedInUser } = useAuthUpdate();
    const navigate = useNavigate()
    const passwordBasedSignupFn = useAsyncFn(passwordBasedSignup)
    
    function handleSubmit(e) {
        e.preventDefault()
        passwordBasedSignupFn.execute({data: fields})
        .then((user) => {
          createLoggedInUser(user)
          navigate("/", { replace: true });
        })
    }
    function handleGoogleLogin() {
      window.open(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/oauth/google`,
        "_self"
      );
    }
    
    function handleOnFocus(e) {
        const fieldName = e.target.name
        setFocus(prev => ({...prev, [fieldName]: true}))
    }
    function handleOnBlur(e) {
        const fieldName = e.target.name
        setFocus(prev => ({...prev, [fieldName]: false}))
    }
    function handleChange(e) {
        const fieldName = e.target.name
        setFields(prev => ({...prev, [fieldName]: e.target.value}))
        if(fieldName === "confirmPassword") {
            setValidation(prev => ({...prev, confirmPassword: fields.password === e.target.value}))
        }
        else {
            setValidation(prev => ({...prev, [fieldName]: AUTH_REGEX[fieldName].test(e.target.value)}))
        }
    }
    
    return (
      <div className="signup container-sm">
        <h1>SignUp</h1>
        <div>
          {passwordBasedSignupFn.error && (
            <Toast type="error" message={passwordBasedSignupFn.error} />
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
            <form className="form sign-up" onSubmit={handleSubmit}>
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
                  <div className="validation-message">
                    {VALIDATION_MSG.email}
                  </div>
                )}
              </div>
              <div className="entry">
                <label htmlFor="name">
                  Name:
                  {fields.name &&
                    (validation.name ? (
                      <FontAwesomeIcon icon={faCheck} className="check" />
                    ) : (
                      <FontAwesomeIcon icon={faXmark} className="cross" />
                    ))}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={fields.name}
                  onChange={handleChange}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                />
                {focus.name && fields.name && !validation.name && (
                  <div className="validation-message">
                    {VALIDATION_MSG.name}
                  </div>
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
              <div className="entry">
                <label htmlFor="confirmPassword">
                  Confirm Password:
                  {fields.confirmPassword &&
                    (validation.confirmPassword ? (
                      <FontAwesomeIcon icon={faCheck} className="check" />
                    ) : (
                      <FontAwesomeIcon icon={faXmark} className="cross" />
                    ))}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                />
                {focus.confirmPassword &&
                  fields.confirmPassword &&
                  !validation.confirmPassword && (
                    <div className="validation-message">
                      {VALIDATION_MSG.confirmPassword}
                    </div>
                  )}
              </div>
              <button
                className="btn btn-block btn-filled text-normal-bold submit-btn"
                disabled={
                  !validation.email ||
                  !validation.name ||
                  !validation.password ||
                  !validation.confirmPassword ||
                  passwordBasedSignupFn.loading
                }
              >
                {passwordBasedSignupFn.loading ? <ActionLoading /> : "Submit"}
              </button>
              <div className="switch-auth">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}
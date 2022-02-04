import React, { useState } from "react";
import { authentication } from "../../Firebase/Firebase";
import classes from "./AuthForm.module.css";
import useInput from "../../hooks/use-input";
import Loader from "../UI/Loader";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validation for email
  const emailValidation = (email) => {
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailFormat)) {
      return true;
    } else {
      return false;
    }
  };

  //email instance of the input custom component
  const {
    value: enteredEmail,
    isValid: emailIsValid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    hasError: emailHasError,
  } = useInput(emailValidation);

  // password instance of the input custom component
  const {
    value: enteredPassword,
    isValid: passwordIsValid,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    hasError: passwordHasError,
    reset: resetPassword,
  } = useInput((value) => value.trim().length > 7);

  // Login Handler
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const loginHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCJJ7gB1xWDjeSmyj12tkqkgOjlwz2vCLc",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        dispatch(
          authActions.logIn({
            token: data.idToken,
            expire: expirationTime.toISOString(),
          })
        );
        navigate("/");
      })
      .catch((err) => {
        // console.log(err.message);
        setAuthError(err.message);
        resetPassword();
      });
  };
  // Login with google handler
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(authentication, provider)
      .then((res) => {
        const expirationTime = new Date(
          new Date().getTime() + +res._tokenResponse.expiresIn * 1000
        );
        dispatch(
          authActions.logIn({
            token: res._tokenResponse.idToken,
            expire: expirationTime.toISOString(),
          })
        );
        navigate("/");
      })
      .catch((err) => {
        setAuthError(err.message);
      });
  };

  // User feedback when authentication process is not successful
  let feedback;
  if (authError === "EMAIL_NOT_FOUND") {
    feedback = <p className={classes["error-text"]}>Email is not registered</p>;
  } else if (authError === "INVALID_PASSWORD") {
    feedback = <p className={classes["error-text"]}>Invalid password</p>;
  } else if (authError !== "") {
    feedback = <p className={classes["error-text"]}>{authError}</p>;
  }

  // check if form is valid
  let formIsValid = false;
  if (passwordIsValid && emailIsValid) {
    formIsValid = true;
  }

  // Dynamic class for the email input field
  const emailInputClasses = emailHasError
    ? `${classes.control} ${classes.invalid} `
    : classes.control;

  // Dynamic class for the password input field
  const passwordInputClasses = passwordHasError
    ? `${classes.control} ${classes.invalid} `
    : classes.control;
  return (
    <div className={classes.element}>
      <h1>Welcome Back</h1>
      <button onClick={loginWithGoogle} className="btn">
        <div className={classes.flex}>
          <FcGoogle />
          Log in with Google
        </div>
      </button>
      <div className="separator">or</div>

      {/* Login form */}
      <form onSubmit={loginHandler}>
        <div className={emailInputClasses}>
          <label htmlFor="email">Email</label>
          <input
            value={enteredEmail}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            type="email"
            id="email"
            required
          />
          {emailHasError && (
            <p className={classes["error-text"]}>Kindly enter a valid email</p>
          )}
        </div>
        <div className={passwordInputClasses}>
          <label htmlFor="password">Password</label>
          <input
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            type="password"
            id="password"
            required
          />
          <Link to="/reset-password">Forgot password?</Link>
          {passwordHasError && (
            <p
              style={{ bottom: "2em", position: "relative" }}
              className={classes["error-text"]}
            >
              Kindly enter a valid password
            </p>
          )}
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <Loader />
          ) : (
            <button disabled={!formIsValid}>Login</button>
          )}
          {feedback}
          <p>
            Do not have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

import React, { useEffect, useState } from "react";
import classes from "./AuthForm.module.css";
import { FcGoogle } from "react-icons/fc";
import useInput from "../../hooks/use-input";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import Loader from "../UI/Loader";
import { authentication } from "../../Firebase/Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignUpForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // validation for the entered email
  const emailValidation = (email) => {
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailFormat)) {
      return true;
    } else {
      return false;
    }
  };

  // email input field instance of the custom component
  const {
    value: enteredEmail,
    isValid: emailIsValid,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    hasError: emailHasError,
  } = useInput(emailValidation);

  // password input field instance of the custom component
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
  const signUpHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCJJ7gB1xWDjeSmyj12tkqkgOjlwz2vCLc",
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
        setIsLoading(false);
        setAuthError(err.message);
        resetPassword();
      });
  };

  // Signup with google handler
  const signupWithGoogle = () => {
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

  let feedback;
  if (authError === "EMAIL_EXISTS") {
    feedback = (
      <p className={classes["error-text"]}>Email is already registered</p>
    );
  } else if (authError !== null) {
    feedback = <p className={classes["error-text"]}>Authentication failed</p>;
  }
  // Remove error when email changes
  useEffect(() => {
    setAuthError(null);
  }, [enteredEmail]);

  // check if form is valid
  let formIsValid = false;
  if (passwordIsValid && emailIsValid) {
    formIsValid = true;
  }

  // Dynamically set class of email input field

  const emailInputClasses = emailHasError
    ? `${classes.control} ${classes.invalid} `
    : classes.control;

  // Dynamically set class of password input field
  const passwordInputClasses = passwordHasError
    ? `${classes.control} ${classes.invalid} `
    : classes.control;
  return (
    <div className={classes.element}>
      <h1>Get Started</h1>
      <button onClick={signupWithGoogle} className="btn">
        <div className={classes.flex}>
          <FcGoogle />
          Sign up with Google
        </div>
      </button>

      <div className="separator">or</div>

      {/* Signup form */}
      <form onSubmit={signUpHandler}>
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
          {passwordHasError && (
            <p className={classes["error-text"]}>
              Kindly enter a valid password
            </p>
          )}
        </div>
        <div className={classes.actions}>
          {isLoading ? (
            <Loader />
          ) : (
            <button disabled={!formIsValid}>Sign up</button>
          )}
          {feedback}
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;

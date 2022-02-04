import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import useInput from "../hooks/use-input";
import classes from "./SettingsPage.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import Loader from "../components/UI/Loader";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const idToken = useSelector((state) => state.auth.loginToken);
  // password instance of the input custom component
  const {
    value: enteredPassword,
    isValid: passwordIsValid,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    hasError: passwordHasError,
    reset: resetPassword,
  } = useInput((value) => value.trim().length > 7);

  // Dynamic class for the password input field
  const passwordInputClasses = passwordHasError
    ? `${classes.control} ${classes.invalid} `
    : classes.control;

  const onBackHandler = () => {
    navigate("/");
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCJJ7gB1xWDjeSmyj12tkqkgOjlwz2vCLc",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: idToken,
          password: enteredPassword,
          returnSecureToken: false,
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
        dispatch(authActions.logOut());
        resetPassword();
      })
      .catch((err) => {
        // console.log(err.message);
        setIsLoading(false);
        setError(err.message);
        resetPassword();
      });
  };

  return (
    <Layout>
      <div className={passwordInputClasses}>
        <h1>Change password</h1>
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="new-password">New Password</label>
          <input
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            type="password"
            id="new-password"
            required
          />
          {passwordHasError && (
            <p className={classes["error-text"]}>
              Kindly enter a valid password
            </p>
          )}
          {isLoading ? (
            <div className={classes.loader}>
              <Loader />
            </div>
          ) : (
            <div className={classes.actions}>
              <button onClick={onBackHandler} className={classes.toggle}>
                Back
              </button>
              <button disabled={!passwordIsValid}>Submit</button>
            </div>
          )}
        </form>
        {error && <p className={classes["error-text"]}>{error}</p>}
      </div>
    </Layout>
  );
};

export default SettingsPage;

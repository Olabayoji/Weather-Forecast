import React, { useEffect, useState } from "react";
import classes from "./AuthForm.module.css";
import Loader from "../UI/Loader";
import useInput from "../../hooks/use-input";
import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { Navbar, Container } from "react-bootstrap";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    reset: resetPassword,
  } = useInput(emailValidation);

  //   Authentication error state
  const [authError, setAuthError] = useState(null);

  //   Reset password handler
  const resetPasswordHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyCJJ7gB1xWDjeSmyj12tkqkgOjlwz2vCLc",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: enteredEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          // console.log("good");
          return res.json();
        } else {
          return res.json().then((data) => {
            console.log(data);
            let errorMessage = "Authentication Failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        resetPassword();
      })
      .catch((err) => {
        // console.log(err.message);
        setAuthError(err.message);
      });
  };
  //   User feedback when authentication fails
  let feedback;
  if (authError === "EMAIL_NOT_FOUND") {
    feedback = <p className={classes["error-text"]}>Email is not registered</p>;
  } else if (authError !== "") {
    feedback = <p className={classes["error-text"]}>{authError}</p>;
  }

  // Remove error when email changes
  useEffect(() => {
    setAuthError(null);
  }, [enteredEmail]);
  return (
    <div className={classes.container}>
      <Navbar bg="light" expand="lg">
        <Container>
          <Link to="/">
            <Navbar.Brand className="logo">Weatherly</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      <div className={classes.element}>
        <h1>Forgot Password?</h1>
        <p className="text">
          No worries, kindly enter your email and we'll send you reset
          instructions.
        </p>
        <form onSubmit={resetPasswordHandler} className={classes["reset-form"]}>
          <div className={classes.control}>
            <label htmlFor="email">Email</label>
            <input
              value={enteredEmail}
              onChange={emailChangeHandler}
              type="email"
              id="email"
              required
            />
          </div>
          <div className={classes.actions}>
            {isLoading ? (
              <Loader />
            ) : (
              <button disabled={!emailIsValid}>Reset password</button>
            )}
            {feedback}
          </div>
        </form>
        <Link className={classes.flex} to="/login">
          <IoMdArrowBack /> Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;

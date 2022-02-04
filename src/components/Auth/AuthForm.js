import React from "react";
import { Navbar, Container } from "react-bootstrap";
import LogInForm from "./LogInForm";
import SignUpForm from "./SignUpForm";
import classes from "./AuthForm.module.css";
import { Link } from "react-router-dom";
const AuthForm = (props) => {
  let auth;
  // Dynamically change what is rendered depending on the params prop
  if (props.params === "login") {
    auth = <LogInForm />;
  }
  if (props.params === "signup") {
    auth = <SignUpForm />;
  }

  return (
    <div className={classes.container}>
      <Navbar bg="light" expand="lg">
        <Container>
          <Link to="/">
            <Navbar.Brand className="logo">Weatherly</Navbar.Brand>
          </Link>
        </Container>
      </Navbar>
      {auth}
    </div>
  );
};

export default AuthForm;

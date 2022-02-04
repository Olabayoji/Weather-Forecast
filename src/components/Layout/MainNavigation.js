import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth-slice";
function MainNavigation() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.auth.loginToken);

  // Logout handler
  const logoutHandler = () => {
    dispatch(authActions.logOut());
  };
  // Navigation bar using bootstrap
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand className="logo" href="/">
          Weatherly
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* {loggedIn && (
              <Nav.Link className="centered" href="#home">
                Favorite
              </Nav.Link>
            )} */}
            {loggedIn && (
              <NavDropdown
                className="centered"
                title="Profile"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item className="centered" href="/settings">
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Item className="centered" onClick={logoutHandler}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {!loggedIn && (
              <Link className="centered cta nav-link" to="/login">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavigation;

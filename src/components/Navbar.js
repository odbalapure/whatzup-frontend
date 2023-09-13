import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../context";
import { isMobile } from "../utils/common";
import { useEffect, useRef } from "react";

function Navbar() {
  /* Navigate programatically */
  const navigate = useNavigate();
  const navigateToHome = () => navigate("/", { replace: true });
  const navLinks = useRef(null);

  /* Glboal context values */
  const { userName, isAdmin, isLoggedIn } = useGlobalContext();

  /* Function to logout user */
  const logoutUser = () => {
    localStorage.removeItem("whatzup_user");
    navigateToHome();
    window.location.reload(false);
  };

  useEffect(() => {
    navLinks.current = document.querySelectorAll(".nav-item");
    if (!navLinks.current) return;
    navLinks.current.forEach(function (link) {
      link.addEventListener("click", function () {
        const navbarToggler = document.querySelector(".navbar-toggler");
        const navbarContent = document.querySelector(".navbar-collapse");
        navbarContent.classList.remove("show");
        navbarToggler.classList.add("collapsed");
      });
    });
  }, [navLinks]);

  return (
    <>
      {/* Navbar code */}
      <nav
        className="navbar navbar-expand-lg navbar-dark fixed-top"
        style={{ backgroundColor: "#0d101c" }}
      >
        <div className="container-fluid d-flex">
          {isMobile() && (
            <i
              style={{
                fontSize: "1.5rem",
                display: "inline-block",
                width: "56px"
              }}
              onClick={() => navigate(-1)}
              className="bi bi-chevron-left text-white"
            />
          )}
          <Link style={{ textDecoration: "none", fontWeight: "600" }} to="/">
            {isMobile() && <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>}
            <span className="navbar-brand text-success fs-3">
              Whatzup&nbsp;
              <i
                style={{ color: "azure" }}
                className="bi bi-calendar2-day-fill"
              ></i>
            </span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
              <li className="nav-item">
                <Link className="nav-link fs-5" aria-current="page" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fs-5"
                  aria-current="page"
                  to="/signup"
                >
                  Signup
                </Link>
              </li>
              <li className="nav-item">
                {isAdmin && isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/event"
                  >
                    Event
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {isAdmin && isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/announcement"
                  >
                    Announcements
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/chat"
                  >
                    Chat
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {isMobile() && isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/chat"
                    onClick={logoutUser}
                  >
                    Logout
                  </Link>
                )}
              </li>
            </ul>
            {!isMobile() && (isLoggedIn || userName) ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ fontSize: "1.2rem" }}
              >
                <span style={{ color: "azure", marginRight: "1rem" }}>
                  Hello{" "}
                  <span className="fw-bold text-primary">
                    <i>{userName.split(" ")[0]}</i>
                  </span>
                  !
                </span>
                <button
                  onClick={logoutUser}
                  className="btn btn-outline-primary"
                  type="submit"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

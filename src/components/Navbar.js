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
                width: "56px",
              }}
              onClick={() => navigate(-1)}
              className="text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-chevron-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </i>
          )}
          <Link style={{ textDecoration: "none", fontWeight: "600" }} to="/">
            <span className="navbar-brand text-success fs-3">
              Whatzup&nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-calendar-check-fill"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
              </svg>
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
                {!isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </li>
              <li className="nav-item">
                {!isLoggedIn && (
                  <Link
                    className="nav-link fs-5"
                    aria-current="page"
                    to="/signup"
                  >
                    Signup
                  </Link>
                )}
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

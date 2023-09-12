import { useRef, useState } from "react";
import { showToast } from "../utils/common";
import CustomToast from "./common/Toast";
import { Api } from "../utils/Api";
import Spinner from "./common/Spinner";

function ForgotPassword() {
  const emailRef = useRef();
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const forgotPasswordDetails = async (event) => {
    event.preventDefault();
    if (emailRef.current.value === "") {
      setIsError(true);
      showToast("Please enter an email id!", "error");
      return;
    }
    setIsLoading(true);
    const response = await Api(
      "auth/forgot-password",
      "PATCH",
      {
        email: emailRef.current.value
      },
      false
    );
    if (response?.error) {
      setIsError(true);
      setIsLoading(false);
      showToast(response?.error, "error");
    } else {
      setIsSuccess(true);
      showToast(response?.msg, "success");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        border: "1px solid lightgray",
        marginTop: "2rem",
        borderRadius: "1rem"
      }}
    >
      <form className="p-3">
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-bold">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="email"
            ref={emailRef}
            placeholder="Enter email to get password reset link"
          />
        </div>
        <div className="d-grid gap-2">
          <button
            className="btn btn-warning"
            type="button"
            onClick={forgotPasswordDetails}
            style={{ marginTop: "1rem" }}
          >
            Send Password Reset Link
          </button>
        </div>
      </form>
      {(isError || isSuccess) && <CustomToast />}
      {isLoading && <Spinner />}
    </div>
  );
}

export default ForgotPassword;

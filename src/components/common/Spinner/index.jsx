import { isMobile } from "../../../utils/common";

const Spinner = () => (
  <div
    style={{
      position: "absolute",
      top: isMobile() ? "20%" : "15%",
      left: isMobile() ? "45%" : "50%"
    }}
    className="d-flex justify-content-center text-secondary"
  >
    <div
      style={{ height: "3rem", width: "3rem" }}
      className="spinner-border"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default Spinner;

const Spinner = (props) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: props.top || '10rem',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
    className="d-flex justify-content-center align-items-center text-secondary"
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

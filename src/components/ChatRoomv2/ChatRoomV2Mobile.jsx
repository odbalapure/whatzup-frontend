const ChatRoomV2Mobile = () => {
  return (
    <div
      className="container"
      style={{ marginTop: "2rem", marginBottom: "2rem" }}
    >
      <div style={{ height: "30rem" }} className="card">
        <div className="card-header fs-4 d-flex justify-content-between">
          <div style={{ cursor: "pointer" }}>
            <i
              className="bi bi-x-circle-fill"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Click to close this chat window"
            ></i>
          </div>
        </div>
        <div style={{ overflow: "auto" }} className="card-body">

        </div>
        <div className="card-footer">
          <form
            className="d-flex justify-content-around align-items-center"
          >
            <div style={{ width: "90%" }}>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                style={{ borderRadius: "2rem" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success bi bi-send-fill"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Send Message"
              style={{ borderRadius: "2rem" }}
            ></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomV2Mobile;

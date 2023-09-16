import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useAsync from "../hooks/useAsync";
import Spinner from "../components/common/Spinner";
import { Api } from "../utils/Api";
import CustomToast from "../components/common/Toast";
import { showToast } from "../utils/common";

const url = process.env.REACT_APP_API_URL + "/api/v1/announcements";

function Announcement() {
  const navigate = useNavigate();
  const navigateToHome = useCallback(
    () => navigate("/", { replace: true }),
    [navigate]
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("whatzup_user"));
    if (!user?.token || user?.role !== "ADMIN") {
      localStorage.clear();
      navigateToHome();
    }
  }, [navigateToHome]);

  /* Announcement List */
  const { data } = useAsync("announcements", "GET", null, false);

  /* Create editable object */
  const [editMode, setEditMode] = useState(false);
  const [editObj, setEditObj] = useState({});

  /* Operation status */
  const [isError, setIsError] = useState(false);
  const [msg, setMsg] = useState("");

  /* Form fields */
  const announcement = useRef("");
  const area = useRef("");
  const message = useRef("");
  const contactPersonName = useRef("");
  const contactPersonPhone = useRef("");
  const [importance, setImportance] = useState("");

  /**
   * @desc Create an announcement
   * @request POST
   */
  const createAnnouncement = async () => {
    if (
      announcement.current.value === "" ||
      area.current.value === "" ||
      message === "" ||
      importance === ""
    ) {
      setIsError(true);
      showToast("All fields are mandatory!", "error");
      return;
    }

    try {
      setMsg("Creating announcement please wait...");
      const response = await Api(
        "announcements",
        "POST",
        {
          announcement: announcement.current.value,
          area: area.current.value,
          message: message.current.value,
          contactPersonName: contactPersonName.current.value,
          contactPersonPhone: "+91" + contactPersonPhone.current.value,
          importance: importance,
          createdAt: new Date().toString()
        },
        true
      );

      if (response?.error) {
        setIsError(true);
      } else {
        setIsError(false);
      }

      setIsError("");
      setMsg(response.data.msg);
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setIsError("Something went wrong while creating announcement...");
      setMsg("");
    }
  };

  /**
   * @desc Delete announcement
   */
  const deleteAnnoucement = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      setIsError("");
    } catch (err) {
      setIsError("Something went wrong while fetching announcements...");
    }
  };

  /**
   * @desc Edit announcement
   */
  const editAnnouncement = async () => {
    try {
      const url = process.env.REACT_APP_API_URL + "/announcements/edit";

      await axios.patch(`${url}/${editObj._id}`, {
        announcement: announcement.current.value,
        area: area.current.value,
        message: message.current.value,
        contactPersonName: contactPersonName.current.value,
        contactPersonPhone: contactPersonPhone.current.value,
        importance: importance || editObj.importance
      });

      setEditObj({});
      setIsError("");
      setMsg("Event edited!");
      setEditMode(false);
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setIsError("Something went wrong while fetching announcements...");
    }
  };

  /**
   * @desc Create editable object
   */
  const createEditableObject = async (id) => {
    setEditObj({});
    setEditMode((prev) => !prev);
    const announcement = data?.announcements.find(
      (announcement) => announcement._id === id
    );
    setEditObj(announcement);
  };

  /* Prevent form submission and reset form values */
  const handleSubmit = (e) => {
    e.target.reset();
    e.preventDefault();
  };

  return (
    <div
      style={{ marginTop: "5rem" }}
      className="container d-flex justify-content-center flex-column"
    >
      <div
        style={{
          border: "1px solid lightgray",
          padding: "1rem",
          margin: "2rem",
          borderRadius: "1rem",
          boxSizing: "border-box"
        }}
      >
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="announcement"
              placeholder="Enter announcement title"
              ref={announcement}
              defaultValue={editMode ? editObj.announcement : ""}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="area"
              placeholder="Enter area"
              ref={area}
              defaultValue={editMode ? editObj.area : ""}
            />
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              id="message"
              placeholder="Enter message"
              ref={message}
              defaultValue={editMode ? editObj.message : ""}
            />
          </div>
          <div className="row">
            <div className="mb-3 col-6">
              <input
                type="text"
                className="form-control"
                id="contact-person"
                placeholder="Enter contact person name"
                ref={contactPersonName}
                defaultValue={editMode ? editObj.contactPersonName : ""}
              />
            </div>
            <div className="mb-3 col-6">
              <input
                type="text"
                className="form-control"
                id="contact-number"
                placeholder="Enter contact person phone number"
                ref={contactPersonPhone}
                defaultValue={editMode ? editObj.contactPersonPhone : ""}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="text-muted lead">Importance: </div>
            <div className="d-flex justify-content-evenly">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="low"
                  value="LOW"
                  onChange={(e) => setImportance(e.target.value)}
                />
                <label className="form-check-label" htmlFor="low">
                  Low
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="moderate"
                  value="MODERATE"
                  onChange={(e) => setImportance(e.target.value)}
                />
                <label className="form-check-label" htmlFor="moderate">
                  Moderate
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="high"
                  value="HIGH"
                  onChange={(e) => setImportance(e.target.value)}
                />
                <label className="form-check-label" htmlFor="high">
                  High
                </label>
              </div>
            </div>
          </div>
          {editMode ? (
            <div className="d-grid gap-2">
              <button
                onClick={editAnnouncement}
                className="btn btn-isError"
                type="submit"
              >
                Edit Announcement
              </button>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <button
                onClick={createAnnouncement}
                className="btn btn-success"
                type="submit"
              >
                Create Announcement
              </button>
            </div>
          )}
        </form>
      </div>
      <div>
        {msg ? (
          <p
            className="d-flex justify-content-center alert alert-success"
            role="alert"
          >
            {msg}
          </p>
        ) : null}
      </div>
      <div className="p-sm-5" style={{ overflowX: "auto" }}>
        {data?.announcements ? (
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Area</th>
                <th scope="col">Message</th>
                <th scope="col">Contact Person</th>
                <th scope="col">Importance</th>
                <th scope="col">Edit/Delete</th>
              </tr>
            </thead>
            <tbody>
              {data.announcements.map((announcement) => {
                return (
                  <tr key={announcement._id}>
                    <td>{announcement.announcement}</td>
                    <td>{announcement.area}</td>
                    <td>{announcement.message}</td>
                    <td>
                      {announcement.contactPersonName} (
                      {announcement.contactPersonPhone})
                    </td>
                    <td>{announcement.importance}</td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                      >
                        <button
                          onClick={() => createEditableObject(announcement._id)}
                          type="button"
                          className="btn btn-warning"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                          </svg>{" "}
                        </button>
                        <button
                          onClick={() => deleteAnnoucement(announcement._id)}
                          type="button"
                          className="btn btn-danger"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                          </svg>{" "}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Spinner message="Loading announcements please wait..." top="40rem" />
        )}
        {isError && <CustomToast />}
      </div>
    </div>
  );
}

export default Announcement;

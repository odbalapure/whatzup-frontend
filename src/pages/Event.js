import { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { showToast } from "../utils/common";
import CustomToast from "../components/common/Toast";
import Spinner from "../components/common/Spinner";

const url = process.env.REACT_APP_API_URL + "/events";

function Event() {
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

  /* Events list */
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /* Create editable object */
  const [editMode, setEditMode] = useState(false);
  const [editObj, setEditObj] = useState({});

  /* Operation status */
  const [warning, setWarning] = useState("");
  const [msg, setMsg] = useState("");

  /* Time and date */
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  /* Form fields */
  const title = useRef("");
  const image = useRef("");
  const description = useRef("");
  const contactPersonName = useRef("");
  const contactPersonPhone = useRef("");

  /**
   * @desc Create an event
   * @request POST
   */
  const createEvent = async () => {
    if (
      title.current.value === "" ||
      date === "" ||
      from === "" ||
      to === "" ||
      image.current.value === "" ||
      description.current.value === ""
    ) {
      setTimeout(() => setWarning(""), 2000);
      setWarning(true);
      showToast("All fields are madatory", "error");
      setMsg("");
      return;
    }

    try {
      setMsg("Creating event please wait...");

      if (JSON.parse(localStorage.getItem("whatzup_user"))) {
        const data = new FormData();
        data.append("title", title.current.value);
        data.append("from", from);
        data.append("to", to);
        data.append("image", image.current.value);
        data.append("description", description.current.value);
        data.append("contactPersonName", contactPersonName.current.value);
        console.log(data);
        const response = await axios.post(url, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("whatzup_user")).token
          }
        });
        getAllEvents();
        setMsg(response.data.msg);
        setWarning("");
      }
    } catch (err) {
      setWarning(err.msg);
      setMsg("");
    }
  };

  /**
   * @desc Get events
   * @method GET
   */
  const getAllEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(url);
      setEvents(response.data.events);
      setWarning("");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setWarning("Something went wrong while fetching events...");
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  /**
   * @desc Delete an event
   * @method DELETE
   */
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      setWarning("");
      getAllEvents();
    } catch (err) {
      setWarning("Something went wrong while fetching announcements...");
    }
  };

  /**
   * @desc Edit event
   */
  const editEvent = async () => {
    const url = process.env.REACT_APP_API_URL + "/events/edit";

    try {
      await axios.patch(`${url}/${editObj._id}`, {
        event: title.current.value,
        date: date || editObj.date,
        from: from || editObj.from,
        to: to || editObj.to,
        image: image.current.value,
        description: description.current.value,
        contactPersonName: contactPersonName.current.value,
        contactPersonPhone: contactPersonPhone.current.value
      });

      setEditObj({});
      setWarning("");
      setMsg("Event edited!");
      setEditMode(false);
      setTimeout(() => setMsg(""), 2000);
      getAllEvents();
    } catch (err) {
      setWarning("Something went wrong while fetching announcements...");
    }
  };

  /**
   * @desc Create editable object
   */
  const createEditableObject = async (id) => {
    setEditObj({});
    setEditMode((prev) => !prev);
    const event = events.find((event) => event._id === id);
    setEditObj(event);
  };

  /* Prevent form submission and reset form values */
  const handleSubmit = (e) => {
    // e.target.reset();
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
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-3">
              <input
                type="text"
                className="form-control"
                id="event"
                placeholder="Enter event title"
                ref={title}
                defaultValue={editMode ? editObj.event : ""}
              />
            </div>
            <div className="col-lg-6 col-md-12 mb-3">
              <input
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="form-control"
                id="event"
                min={new Date().toISOString().split("T")[0]}
                defaultValue={editMode ? editObj.date : ""}
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              id="image"
              placeholder="Enter image URL"
              ref={image}
              defaultValue={editMode ? editObj.image : ""}
            />
          </div>
          <div className="row">
            <div className="mb-3 col-lg-5 col-md-12">
              <input
                onChange={(e) => setFrom(e.target.value)}
                type="time"
                className="form-control"
                id="from"
                defaultValue={editMode ? editObj.from : ""}
              />
            </div>
            <div
              className="col-lg-2 col-md-12"
              style={{
                marginTop: "0.3rem",
                textAlign: "center"
              }}
            >
              To
            </div>
            <div className="mb-3 col-lg-5 col-md-12">
              <input
                onChange={(e) => setTo(e.target.value)}
                type="time"
                className="form-control"
                id="to"
                defaultValue={editMode ? editObj.to : ""}
              />
            </div>
          </div>
          <div className="mb-3">
            <textarea
              type="text"
              className="form-control"
              id="message"
              placeholder="Enter event description"
              ref={description}
              defaultValue={editMode ? editObj.description : ""}
            />
          </div>
          <div className="row">
            <div className="mb-3 col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                id="contact-person"
                placeholder="Enter contact person name"
                ref={contactPersonName}
                defaultValue={editMode ? editObj.contactPersonName : ""}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                id="contact-phone"
                placeholder="Enter contact person phone number"
                ref={contactPersonPhone}
                defaultValue={editMode ? editObj.contactPersonPhone : ""}
              />
            </div>
          </div>
          {editMode ? (
            <div className="d-grid gap-2">
              <button
                onClick={editEvent}
                className="btn btn-warning"
                type="submit"
              >
                Edit Event
              </button>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <button
                onClick={createEvent}
                className="btn btn-success"
                type="submit"
              >
                Create Event
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="container mt-4" style={{ overflowX: "auto" }}>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date</th>
              <th scope="col">Message</th>
              <th scope="col">From</th>
              <th scope="col">To</th>
              <th scope="col">Contact Person</th>
              <th scope="col">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              return (
                <tr key={event._id}>
                  <td>{event.event}</td>
                  <td style={{ width: "7rem" }}>{event.date}</td>
                  <td>{event.description}</td>
                  <td>{event.from}</td>
                  <td>{event.to}</td>
                  <td>
                    {event.contactPersonName} ({event.contactPersonPhone})
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        onClick={() => createEditableObject(event._id)}
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
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
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
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
      {warning && <CustomToast />}
      {isLoading && <Spinner top="40rem" />}
    </div>
  );
}

export default Event;

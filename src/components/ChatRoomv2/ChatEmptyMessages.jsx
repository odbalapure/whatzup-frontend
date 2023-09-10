const ChatEmptyMessages = (props) => {
  const { message } = props;
  return (
    <div id="messages-show-empty">
      <div
        id="empty-messages"
        className="text-muted d-flex flex-column align-items-center"
        style={{ marginTop: "30%" }}
      >
        <i style={{ fontSize: "5rem" }} className="bi bi-calendar-day" />
        <div className="text-lead">{message}</div>
        <div>Whatzup ©, 2023</div>
      </div>
    </div>
  );
};

export default ChatEmptyMessages;
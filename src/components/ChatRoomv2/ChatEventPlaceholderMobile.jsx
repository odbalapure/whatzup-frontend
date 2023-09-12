const ChatEventPlaceholderMobile = () => {
  return (
    <>
      {[1, 2].map((_, index) => (
        <div
          id={index}
          key={index}
          className="d-flex align-items-center p-3"
          style={{ borderBottom: "1px solid lightgray", height: "5rem" }}
        >
          <div>
            <img
              src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg"
              height="60px"
              width="60px"
              alt="chat-event-placeholder-mobile"
            />
          </div>
          &nbsp;&nbsp;
          <div className="bg-secondary placeholder col-9"></div>
        </div>
      ))}
    </>
  );
};

export default ChatEventPlaceholderMobile;

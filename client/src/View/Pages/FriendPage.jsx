import { useEffect, useState, useContext } from "react";
import api from "../../axios";
import { Photo } from "../../utils/converter";
import UserContext from "../../UserContext";
import Loading from '../Components/Loading';
import { Link } from "react-router-dom";
const Message = ({ message }) => {
  return (
    <div className={`d-flex ${message.isSender ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
      <div className="p-3 bg-light rounded">
        <h5>{message.content}</h5>
        <small className="text-muted">{new Date(message.messaged_at).toLocaleString()}</small>
        <div className="mt-2">
          <span className="text-muted">{message.reaction}</span>
        </div>
      </div>
    </div>
  );
};

const FriendPage = () => {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentFriendId, setCurrentFriendId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastMessageId, setLastMessageId] = useState(null); // Track the last message ID
  const [isActive, set_active] = useState(false);
  const handleMouseEnter = () => {
    set_active(true);
  }
  const handleMouseLeave = () => {
    set_active(false);
  }
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get("/friend");
        const friendsList = response.data;
        const updatedFriends = friendsList.map((friend) => ({
          ...friend,
          profile_picture: Photo(friend.profile_picture),
        }));
        setFriends(updatedFriends);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setTimeout(() => setLoading(false), 2000); // Ensure loading is updated
      }
    };

    fetchFriends();
  }, []);

  const fetchMessages = async (friend_id, after_message_id = -1) => {
    try {
      setCurrentFriendId(friend_id);
      const response = await api.get(`/friend/messages/${friend_id}/${after_message_id}`);
      setMessages((prevMessages) => [...prevMessages, ...response.data.messages]);
      if (response.data.messages.length > 0) {
        setLastMessageId(response.data.messages[response.data.messages.length - 1].message_id); // Update last message ID
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      setMessages([])
      await api.post(`/friend/message/${currentFriendId}`, { content: newMessage });
      fetchMessages(currentFriendId); // Refresh messages after sending
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    // Fetch new messages every 1 second while a conversation is open
    const interval = setInterval(() => {
      if (currentFriendId) {
        fetchMessages(currentFriendId, lastMessageId); // Only fetch messages after the last message ID
      }
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [currentFriendId, lastMessageId]);

  if (loading) return <Loading />;

  return (

    <>



      <div className="background-layer"></div>


      <section id="navbar">
        <header className="nbar pt-3 pb-1">
          <div className="container">
            <input type="checkbox" name="check" id="check" />
            <div className="logo-container">
              <div><img style={{ width: '50px' }} src="/imgdb/logo.png" alt="" /></div>
              <h3 className="nblogo">DB<span>Proj</span></h3>
            </div>

            <div className="nav-btn">
              <div className="nav-links">
                <ul className="ps-0 justify-content-around">
                  <li className="nav-link" style={{ '--i': '1.1s' }}>
                    <div className="ps-4 pe-4">
                      <form className="d-flex rounded-2" role="search" style={{ background: 'var(--btn-light)' }}>
                        <input className="form-control me-2 border border-0" style={{ background: 'var(--btn-light)' }} type="search" placeholder="Search" aria-label="Search" />
                        <button className="border border-0 rounded-2 ps-2 pe-2 fw-bold f-but" type="submit" style={{ background: 'var(--gtextdark)' }}>
                          <img width="20px" src="/imgdb/search.png" alt="" />
                        </button>
                      </form>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="navbar-profile" style={{ '--i': '1.8s' }}>
                <div className="d-flex navbar-pic-name container align-items-center pt-2">
                  <div className="d-flex align-items-center">
                    <div className="navbar-pic">
                      <img src={Photo(userDetails.profile_picture) || '/imgdb/profile.png'} alt="" />
                    </div>
                    <div className="navbar-name pointer">
                      {userDetails.user_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hamburger-menu-container">
              <div className="hamburger-menu">
                <div></div>
              </div>
            </div>
          </div>
        </header>

        <nav className="navbar fixed-bottom" style={{ backgroundColor: 'rgba(240, 248, 255, 0)', backdropFilter: 'blur(2px)' }}>
          <div className="container pt-1 pb-3">
            <div className="row w-100">
              <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/home.png" alt="" /></div>
              <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/message.png" alt="" /></div>
              <div className="col col-4 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/plus.png" alt="" /></div>
              <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/bell.png" alt="" /></div>
              <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/profile.png" alt="" /></div>
            </div>
          </div>
        </nav>
      </section>








      <div>
        <div className={`sidebar ${isActive ? 'active' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="top">
            <div className="dots flex">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
          <div className="menu">
          <div className="menu-item flex pb-3">
            <img src="/imgdb/home.png" alt="" />
            <Link to='/feed' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Home</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/bell.png" alt="" />
            <Link to = '/notifications' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Notification</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/message.png" alt="" />
            <Link to = '/friend' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Messages</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/profile.png" alt="" />
            <Link to={`/profile/${userDetails.user_name}`} className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Profile</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/plus.png" alt="" />
            <Link to='/post/create' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Post</Link>
          </div>
          </div>
        </div>
      </div>






      <div className="container " style={{paddingTop : '80px'}}>

        <div className="row">

          <div className="col-0 col-sm-1 col-md-2">  </div>

          <div className="col-12 col-sm-10 col-md-9">

            <div className="container mt-4 ">

              <div className="row ">

                {/* Friend Section */}
                <div className="col-md-4 border-end">
                  <h4>Friends</h4>
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <div
                        key={friend.user_id}
                        className="d-flex align-items-center p-2 border-bottom bg-body-tertiary rounded-4 mb-2"
                        onClick={() => fetchMessages(friend.user_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={friend.profile_picture || "/imgdb/textimg3.png"}
                          alt="Profile"
                          className="rounded-circle me-3"
                          width="50"
                          height="50"
                        />
                        <h5 className="m-0">{friend.user_name}</h5>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">No friends found.</div>
                  )}
                </div>

                {/* Message Section */}
                <div className="col-md-8">
                  <h4>Messages</h4>
                  <div className="messages-container overflow-auto mb-3" style={{ height: "400px" }}>
                    {messages.length > 0 ? (
                      messages.map((message) => (
                        <Message
                          key={message.message_id}
                          message={{
                            ...message,
                            isSender: message.user_id1 === userDetails.user_id,
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-muted text-center mt-5">No messages yet.</div>
                    )}
                  </div>

                  {/* Message Input */}
                  {currentFriendId && (
                    <div className="d-flex sticky-bottom " style={{paddingBottom : '30px'}}>
                      <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button className="btn btn-primary" onClick={sendMessage}>
                        Send
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>

          <div className="col-0 col-sm-1"></div>

        </div>


      </div>

    </>
  );
};

export default FriendPage;

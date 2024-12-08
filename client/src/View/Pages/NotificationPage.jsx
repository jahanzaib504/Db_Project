import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios"; // Ensure your API setup is correctly imported
import Loading from "../Components/Loading";
import { Photo } from "../../utils/converter";

const NotificationPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const acceptRequest = async (user_id) => {
    try {
      await api.post(`/friend/request/${user_id}/accept`);
      setFriendRequests((prev) =>
        prev.filter((request) => request.user_id !== user_id)
      );
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const rejectRequest = async (user_id) => {
    try {
      await api.post(`/friend/request/${user_id}/reject`);
      setFriendRequests((prev) =>
        prev.filter((request) => request.user_id !== user_id)
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await api.get("/friend/all-friend/requests");
        setFriendRequests(response.data);
      } catch (err) {
        console.error("Error fetching friend requests:", err);
        setFriendRequests([]); // Default to empty list if error occurs
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await api.get("/friend/all-friend/pending");
        setPendingRequests(response.data);
      } catch (err) {
        console.error("Error fetching pending requests:", err);
        setPendingRequests([]); // Default to empty list if error occurs
      }
    };

    const fetchPeopleYouMayKnow = async () => {
      try {
        const response = await api.get("/user/may-know");
        setPeopleYouMayKnow(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log("No suggestions available (404).");
          setPeopleYouMayKnow([]); // Gracefully handle 404
        } else {
          console.error("Error fetching people you may know:", err);
        }
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFriendRequests(),
        fetchPendingRequests(),
        fetchPeopleYouMayKnow(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">People You May Know</h2>
      {peopleYouMayKnow.length > 0 ? (
        peopleYouMayKnow.map((person) => (
          <div className="d-flex align-items-center mb-3" key={person.user_id}>
            <img
              src={person.profile_picture && Photo(person.profile_picture) || '/imgdb/profile.png'}
              alt="Profile"
              className="rounded-circle me-3"
              width="50"
              height="50"
            />
            <Link to={`/profile/${person.user_name}`} className="text-decoration-none">
              {person.user_name}
            </Link>
          </div>
        ))
      ) : (
        <p className="text-muted">No suggestions available.</p>
      )}

      <h2 className="mt-5 mb-3">Friend Requests</h2>
      {friendRequests.length > 0 ? (
        friendRequests.map((fr) => (
          <div className="d-flex align-items-center mb-3" key={fr.user_id2}>
            <img
              src={fr.profile_picture && Photo(fr.profile_picture) || '/imgdb/profile.png'}
              alt="Profile"
              className="rounded-circle me-3"
              width="50"
              height="50"
            />
            <div>{fr.user_name}</div>
            <span className="me-auto">{fr.user_name}</span>
            <button
              className="btn btn-success me-2"
              onClick={() => acceptRequest(fr.user_id1)}
            >
              Accept
            </button>
            <button
              className="btn btn-danger"
              onClick={() => rejectRequest(fr.user_id1)}
            >
              Reject
            </button>
          </div>
        ))
      ) : (
        <p className="text-muted">No friend requests found.</p>
      )}

      <h2 className="mt-5 mb-3">Pending Requests</h2>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((pr) => (
          <div className="d-flex align-items-center mb-3" key={pr.user_id1}>
            <img
              src={pr.profile_picture && Photo(pr.profile_picture) || '/imgdb/profile.png'}
              alt="Profile"
              className="rounded-circle me-3"
              width="50"
              height="50"
            />
            <span>{pr.user_name}</span>
            <span className="ms-auto text-muted">Pending</span>
          </div>
        ))
      ) : (
        <p className="text-muted">No pending requests.</p>
      )}
    </div>
  );
};

export default NotificationPage;

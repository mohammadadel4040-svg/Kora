import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const savedUser = localStorage.getItem("user");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch {
      user = null;
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "renter") {
      setMessage("This page is only available for renters.");
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `https://api-gateway.gentlestone-6c3db93a.swedencentral.azurecontainerapps.io/api/rentals/renter/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Could not load rental requests."
          );
          setLoading(false);
          return;
        }

        setRequests(data.rentalRequests || []);
        setLoading(false);

      } catch (error) {
        setMessage("Could not connect to server.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <Link className="logo" to="/">
          Kora
        </Link>

        <div className="nav-links">
          <Link to="/">
            Home
          </Link>

          <Link to="/my-requests">
            My Requests
          </Link>

          {user && (
            <span className="user-name">
              Hello, {user.name}
            </span>
          )}

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">
              Renter dashboard
            </p>

            <h1>
              My Rental Requests
            </h1>

            <p>
              Track the rental requests you have sent to property owners.
            </p>
          </div>
        </div>

        {loading && (
          <div className="dashboard-empty">
            <h3>
              Loading requests...
            </h3>
          </div>
        )}

        {!loading && message && (
          <div className="dashboard-empty">
            <h3>
              {message}
            </h3>
          </div>
        )}

        {!loading &&
          !message &&
          requests.length === 0 && (
            <div className="dashboard-empty">
              <h3>
                You have not sent any rental requests yet.
              </h3>

              <p>
                Browse available homes and send your first request.
              </p>

              <Link
                to="/"
                className="dashboard-primary-link"
              >
                Browse properties
              </Link>
            </div>
          )}

        {!loading &&
          requests.length > 0 && (
            <div className="request-list">
              {requests.map((request) => (
                <article
                  className="request-list-card"
                  key={request._id}
                >
                  <div className="request-card-top">
                    <div>
                      <p className="request-small-label">
                        Property ID
                      </p>

                      <h3>
                        {request.propertyId}
                      </h3>
                    </div>

                    <span
                      className={`status-badge status-${request.status}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="request-info-grid">
                    <div>
                      <span>
                        Requested move-in
                      </span>

                      <strong>
                        {new Date(
                          request.requestedMoveInDate
                        ).toLocaleDateString()}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Request sent
                      </span>

                      <strong>
                        {new Date(
                          request.createdAt
                        ).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  {request.message && (
                    <div className="request-message-box">
                      <span>
                        Your message
                      </span>

                      <p>
                        {request.message}
                      </p>
                    </div>
                  )}

                  <div className="request-list-footer">
                    <Link
                      to={`/property/${request.propertyId}`}
                      className="view-property-link"
                    >
                      View property
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}

export default MyRequests;

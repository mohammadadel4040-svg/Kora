import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
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


  const loadDashboard = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "owner") {
      setMessage(
        "This dashboard is only available for property owners."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const propertyResponse = await fetch(
        `http://localhost:5000/api/properties/owner/${user.id}`
      );

      const propertyData = await propertyResponse.json();

      if (!propertyResponse.ok) {
        throw new Error(
          propertyData.message ||
          "Could not load owner properties."
        );
      }


      const rentalResponse = await fetch(
        `http://localhost:5000/api/rentals/owner/${user.id}`
      );

      const rentalData = await rentalResponse.json();

      if (!rentalResponse.ok) {
        throw new Error(
          rentalData.message ||
          "Could not load rental requests."
        );
      }


      setProperties(
        propertyData.properties || []
      );

      setRequests(
        rentalData.rentalRequests || []
      );

    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
        "Could not connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDashboard();
  }, []);


  const updateRequestStatus = async (
    requestId,
    newStatus
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/rentals/${requestId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
          "Could not update rental request."
        );

        return;
      }

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: data.rentalRequest.status
              }
            : request
        )
      );

      setMessage(
        `Rental request ${newStatus} successfully.`
      );

    } catch (error) {
      setMessage(
        "Could not connect to the server."
      );
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };


  if (!user) {
    return null;
  }


  return (
    <div className="dashboard-page">

      <nav className="navbar">

        <Link
          className="logo"
          to="/"
        >
          Kora
        </Link>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/owner-dashboard">
            Owner Dashboard
          </Link>

          <Link
            to="/owner/create-property"
            className="dashboard-primary-link"
          >
            Add Property
          </Link>

          <span className="user-name">
            Hello, {user.name}
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      <main className="owner-dashboard-container">

        <section className="owner-dashboard-header">

          <div>

            <p className="eyebrow">
              Property owner
            </p>

            <h1>
              Owner Dashboard
            </h1>

            <p>
              Manage your properties and rental requests
              from renters.
            </p>

          </div>

        </section>


        {message && (
          <div className="dashboard-message">
            {message}
          </div>
        )}


        {loading ? (
          <div className="dashboard-empty">

            <h3>
              Loading dashboard...
            </h3>

          </div>
        ) : (
          <>

            <section className="owner-stats">

              <div className="owner-stat-card">

                <span>
                  My properties
                </span>

                <strong>
                  {properties.length}
                </strong>

              </div>


              <div className="owner-stat-card">

                <span>
                  Rental requests
                </span>

                <strong>
                  {requests.length}
                </strong>

              </div>


              <div className="owner-stat-card">

                <span>
                  Pending requests
                </span>

                <strong>
                  {
                    requests.filter(
                      (request) =>
                        request.status === "pending"
                    ).length
                  }
                </strong>

              </div>

            </section>


            <section className="owner-section">

              <div className="owner-section-heading">

                <div>
                  <p className="eyebrow">
                    Listings
                  </p>

                  <h2>
                    My Properties
                  </h2>
                </div>


                <Link
                  to="/owner/create-property"
                  className="dashboard-primary-link"
                >
                  Add Property
                </Link>

              </div>


              {properties.length === 0 ? (

                <div className="dashboard-empty">

                  <h3>
                    You do not have any properties yet.
                  </h3>

                  <p>
                    Create your first property listing.
                  </p>

                  <Link
                    to="/owner/create-property"
                    className="dashboard-primary-link"
                  >
                    Add Property
                  </Link>

                </div>

              ) : (

                <div className="owner-property-grid">

                  {properties.map((property) => (

                    <article
                      className="owner-property-card"
                      key={property._id}
                    >

                      <div className="owner-property-image">

                        <span>
                          {property.propertyType}
                        </span>

                      </div>


                      <div className="owner-property-content">

                        <p>
                          {property.city}
                        </p>

                        <h3>
                          {property.title}
                        </h3>

                        <strong>
                          €{property.price}/month
                        </strong>


                        <div className="owner-property-actions">

                          <Link
                            to={`/property/${property._id}`}
                          >
                            View property
                          </Link>

                        </div>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>


            <section className="owner-section">

              <div className="owner-section-heading">

                <div>

                  <p className="eyebrow">
                    Incoming requests
                  </p>

                  <h2>
                    Rental Requests
                  </h2>

                </div>

              </div>


              {requests.length === 0 ? (

                <div className="dashboard-empty">

                  <h3>
                    No rental requests yet.
                  </h3>

                  <p>
                    Requests from renters will appear here.
                  </p>

                </div>

              ) : (

                <div className="owner-request-list">

                  {requests.map((request) => (

                    <article
                      className="owner-request-card"
                      key={request._id}
                    >

                      <div className="owner-request-header">

                        <div>

                          <p className="request-small-label">
                            Property
                          </p>

                          <h3>
                            {request.propertyId}
                          </h3>

                        </div>


                        <span
                          className={
                            `status-badge status-${request.status}`
                          }
                        >
                          {request.status}
                        </span>

                      </div>


                      <div className="owner-request-info">

                        <div>

                          <span>
                            Renter ID
                          </span>

                          <strong>
                            {request.renterId}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Requested move-in
                          </span>

                          <strong>
                            {
                              new Date(
                                request.requestedMoveInDate
                              ).toLocaleDateString()
                            }
                          </strong>

                        </div>

                      </div>


                      {request.message && (

                        <div className="request-message-box">

                          <span>
                            Message from renter
                          </span>

                          <p>
                            {request.message}
                          </p>

                        </div>

                      )}


                      <div className="owner-request-footer">

                        <Link
                          to={`/property/${request.propertyId}`}
                          className="view-property-link"
                        >
                          View property
                        </Link>


                        {request.status === "pending" && (

                          <div className="owner-request-actions">

                            <button
                              className="reject-button"
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  "rejected"
                                )
                              }
                            >
                              Reject
                            </button>


                            <button
                              className="accept-button"
                              onClick={() =>
                                updateRequestStatus(
                                  request._id,
                                  "accepted"
                                )
                              }
                            >
                              Accept
                            </button>

                          </div>

                        )}

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>

          </>
        )}

      </main>

    </div>
  );
}


export default OwnerDashboard;
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function RentalRequest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [moveInDate, setMoveInDate] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "renter") {
      setStatusMessage("Only renters can send rental requests.");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `https://api-gateway.gentlestone-6c3db93a.swedencentral.azurecontainerapps.io/api/properties/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setStatusMessage(
            data.message || "Could not load property."
          );
          setLoading(false);
          return;
        }

        setProperty(data.property);
        setLoading(false);
      } catch (error) {
        setStatusMessage("Could not connect to server.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!property) {
      return;
    }

    if (!moveInDate) {
      setStatusMessage("Please choose a move-in date.");
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage("");

      const response = await fetch(
        "https://api-gateway.gentlestone-6c3db93a.swedencentral.azurecontainerapps.io/api/rentals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            propertyId: property._id,
            renterId: user.id,
            ownerId: property.ownerId,
            message: requestMessage,
            requestedMoveInDate: moveInDate
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(
          data.message || "Rental request failed."
        );
        setSubmitting(false);
        return;
      }

      setStatusMessage("Rental request sent successfully.");

      setTimeout(() => {
        navigate(`/property/${property._id}`);
      }, 1200);

    } catch (error) {
      setStatusMessage("Could not connect to server.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <h2>Loading rental request...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">
      <nav className="navbar">
        <Link className="logo" to="/">
          Kora
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          {user && (
            <span className="user-name">
              Hello, {user.name}
            </span>
          )}
        </div>
      </nav>

      <main className="request-page-container">
        <Link
          to={property ? `/property/${property._id}` : "/"}
          className="back-link"
        >
          ← Back
        </Link>

        <div className="rental-request-card">
          <p className="eyebrow">
            Rental request
          </p>

          <h1>
            Request this property
          </h1>

          {property && (
            <div className="request-property-summary">
              <h2>
                {property.title}
              </h2>

              <p>
                {property.city} · €{property.price}/month
              </p>
            </div>
          )}

          {user && user.role === "renter" && property ? (
            <form
              className="rental-request-form"
              onSubmit={handleSubmit}
            >
              <label>
                Requested move-in date
              </label>

              <input
                type="date"
                value={moveInDate}
                onChange={(event) =>
                  setMoveInDate(event.target.value)
                }
                required
              />

              <label>
                Message to the owner
              </label>

              <textarea
                rows="6"
                placeholder="Hello, I am interested in this property..."
                value={requestMessage}
                onChange={(event) =>
                  setRequestMessage(event.target.value)
                }
              />

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Sending..."
                  : "Send rental request"}
              </button>
            </form>
          ) : null}

          {statusMessage && (
            <p className="form-message">
              {statusMessage}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default RentalRequest;

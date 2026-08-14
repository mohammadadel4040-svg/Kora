import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `https://api-gateway.gentlestone-6c3db93a.swedencentral.azurecontainerapps.io/api/properties/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Property could not be loaded");
          setLoading(false);
          return;
        }

        setProperty(data.property);
        setLoading(false);
      } catch (error) {
        setMessage("Could not connect to the server");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleRentalRequest = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "renter") {
      setMessage("Only renters can send rental requests.");
      return;
    }

    navigate(`/property/${id}/request`);
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <h2>Loading property...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <h2>Property not found</h2>
          <p>{message}</p>

          <Link to="/" className="back-link">
            Back to home
          </Link>
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

          {user ? (
            <span className="user-name">
              Hello, {user.name}
            </span>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </nav>

      <main className="details-container">
        <Link to="/" className="back-link">
          ← Back to properties
        </Link>

        <div className="details-layout">
          <section className="details-main">
            <div className="details-image">
              <span className="details-badge">
                {property.propertyType}
              </span>

              <div className="image-placeholder">
                Property image
              </div>
            </div>

            <div className="details-header">
              <div>
                <p className="property-location">
                  {property.city}
                </p>

                <h1>{property.title}</h1>

                <p className="details-address">
                  {property.address}
                </p>
              </div>

              <div className="details-price">
                <strong>
                  €{property.price}
                </strong>

                <span>/ month</span>
              </div>
            </div>

            <div className="details-specs">
              <div>
                <strong>
                  {property.bedrooms}
                </strong>
                <span>Bedrooms</span>
              </div>

              <div>
                <strong>
                  {property.bathrooms}
                </strong>
                <span>Bathrooms</span>
              </div>

              <div>
                <strong>
                  {property.furnished ? "Yes" : "No"}
                </strong>
                <span>Furnished</span>
              </div>

              <div>
                <strong>
                  {property.status}
                </strong>
                <span>Status</span>
              </div>
            </div>

            <section className="details-section">
              <h2>Description</h2>

              <p>
                {property.description}
              </p>
            </section>

            <section className="details-section">
              <h2>Amenities</h2>

              <div className="amenities-list">
                {property.amenities &&
                property.amenities.length > 0 ? (
                  property.amenities.map((amenity) => (
                    <span key={amenity}>
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p>No amenities listed.</p>
                )}
              </div>
            </section>

            <section className="details-section">
              <h2>Availability</h2>

              <p>
                Available from:{" "}
                <strong>
                  {new Date(
                    property.availableFrom
                  ).toLocaleDateString()}
                </strong>
              </p>
            </section>
          </section>

          <aside className="details-sidebar">
            <div className="request-card">
              <p className="eyebrow">
                Interested in this home?
              </p>

              <h2>
                Send a rental request
              </h2>

              <p>
                Login as a renter and send a request
                directly to the property owner.
              </p>

              <button
                onClick={handleRentalRequest}
                disabled={property.status !== "available"}
              >
                {property.status === "available"
                  ? "Request this property"
                  : "Currently unavailable"}
              </button>

              {message && (
                <p className="form-message">
                  {message}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PropertyDetails;

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetails from "./pages/PropertyDetails";
import RentalRequest from "./pages/RentalRequest";
import MyRequests from "./pages/MyRequests";
import OwnerDashboard from "./pages/OwnerDashboard";
import CreateProperty from "./pages/CreateProperty";

import "./App.css";


function Home() {
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });


  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (city) {
        params.append("city", city);
      }

      if (propertyType) {
        params.append(
          "propertyType",
          propertyType
        );
      }

      if (maxPrice) {
        params.append(
          "maxPrice",
          maxPrice
        );
      }

      const response = await fetch(
        `http://localhost:5000/api/properties?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load properties"
        );
      }

      const data = await response.json();

      setProperties(
        data.properties || []
      );

    } catch (error) {
      console.error(
        "Error loading properties:",
        error
      );

      setProperties([]);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProperties();
  }, []);


  const handleSearch = (event) => {
    event.preventDefault();
    fetchProperties();
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };


  const openProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };


  return (
    <div className="app">

      <nav className="navbar">
        <Link
          className="logo"
          to="/"
        >
          Kora
        </Link>

        <div className="nav-links">
          <a href="#home">
            Home
          </a>

          <a href="#properties">
            Properties
          </a>

          <a href="#about">
            About
          </a>

          {user ? (
            <>
              {user.role === "renter" && (
                <Link to="/my-requests">
                  My Requests
                </Link>
              )}

              {user.role === "owner" && (
                <Link to="/owner-dashboard">
                  Owner Dashboard
                </Link>
              )}

              <span className="user-name">
                Hello, {user.name}
              </span>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="register-nav"
              >
                Register
              </Link>

              <Link
                to="/login"
                className="login-button"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>


      <section
        className="hero"
        id="home"
      >
        <div className="hero-content">

          <p className="eyebrow">
            Find a place that feels like home
          </p>

          <h1>
            Discover your next room or apartment with Kora.
          </h1>

          <p className="hero-text">
            Browse comfortable homes, compare prices,
            and send rental requests in one simple place.
          </p>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            />

            <select
              value={propertyType}
              onChange={(event) =>
                setPropertyType(event.target.value)
              }
            >
              <option value="">
                Any type
              </option>

              <option value="apartment">
                Apartment
              </option>

              <option value="room">
                Room
              </option>
            </select>

            <input
              type="number"
              placeholder="Max price €"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(event.target.value)
              }
            />

            <button type="submit">
              Search
            </button>
          </form>
        </div>
      </section>


      <section
        className="properties-section"
        id="properties"
      >
        <div className="section-heading">

          <div>
            <p className="eyebrow">
              Available homes
            </p>

            <h2>
              Explore properties
            </h2>
          </div>

          <p>
            {properties.length}{" "}
            {properties.length === 1
              ? "property"
              : "properties"}{" "}
            found
          </p>

        </div>


        {loading ? (
          <div className="empty-state">
            <h3>
              Loading properties...
            </h3>
          </div>
        ) : (
          <div className="property-grid">

            {properties.map((property) => (
              <article
                className="property-card"
                key={property._id}
              >
                <div className="property-image">
                  <span>
                    {property.propertyType}
                  </span>
                </div>

                <div className="property-content">

                  <p className="property-location">
                    {property.city}
                  </p>

                  <h3>
                    {property.title}
                  </h3>

                  <p className="property-description">
                    {property.description}
                  </p>

                  <div className="property-details">
                    <span>
                      {property.bedrooms} bed
                    </span>

                    <span>
                      {property.bathrooms} bath
                    </span>

                    <span>
                      {property.furnished
                        ? "Furnished"
                        : "Unfurnished"}
                    </span>
                  </div>

                  <div className="property-footer">
                    <strong>
                      €{property.price}/month
                    </strong>

                    <button
                      onClick={() =>
                        openProperty(property._id)
                      }
                    >
                      View details
                    </button>
                  </div>

                </div>
              </article>
            ))}

            {properties.length === 0 && (
              <div className="empty-state">

                <h3>
                  No properties found
                </h3>

                <p>
                  Try changing your search filters.
                </p>

              </div>
            )}

          </div>
        )}

      </section>


      <section
        className="about-section"
        id="about"
      >
        <p className="eyebrow">
          Why Kora
        </p>

        <h2>
          Simple renting for renters and property owners.
        </h2>

        <div className="feature-grid">

          <div>
            <h3>
              Search easily
            </h3>

            <p>
              Find rooms and apartments by city,
              property type, and monthly price.
            </p>
          </div>

          <div>
            <h3>
              Send requests
            </h3>

            <p>
              Renters can send rental requests
              directly to property owners.
            </p>
          </div>

          <div>
            <h3>
              Manage homes
            </h3>

            <p>
              Property owners can create and manage
              their rooms and apartment listings.
            </p>
          </div>

        </div>
      </section>


      <footer>
        <strong>
          Kora
        </strong>

        <p>
          Find a place to call home.
        </p>
      </footer>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/property/:id/request"
          element={<RentalRequest />}
        />

        <Route
          path="/my-requests"
          element={<MyRequests />}
        />

        <Route
          path="/owner-dashboard"
          element={<OwnerDashboard />}
        />

        <Route
          path="/owner/create-property"
          element={<CreateProperty />}
        />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
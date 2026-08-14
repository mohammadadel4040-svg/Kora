import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateProperty() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");

  let user = null;

  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch {
      user = null;
    }
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "apartment",
    price: "",
    city: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    availableFrom: "",
    amenities: ""
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "owner") {
      setMessage("Only property owners can create properties.");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("Sending property to server...");

      const amenitiesArray = form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const propertyData = {
        ownerId: user.id,
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        price: Number(form.price),
        city: form.city,
        address: form.address,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        furnished: form.furnished,
        availableFrom: form.availableFrom,
        amenities: amenitiesArray,
        images: [],
        status: "available"
      };

      console.log("Sending property:", propertyData);

      const apiUrl =
        "http://localhost:5000/api/properties";

      console.log("Sending request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },

        body: JSON.stringify(propertyData)
      });

      console.log("Response URL:", response.url);
      console.log("Response status:", response.status);
      console.log(
        "Response content type:",
        response.headers.get("content-type")
      );

      const responseText = await response.text();

      console.log("Raw server response:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error(
          "Server did not return JSON. It returned:",
          responseText
        );

        setMessage(
          `Unexpected server response. Status: ${response.status}. Check the browser Console.`
        );

        setSubmitting(false);
        return;
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            data.error ||
            "Could not create property."
        );

        setSubmitting(false);
        return;
      }

      console.log("Property created:", data);

      setMessage("Property created successfully.");

      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 1000);

    } catch (error) {
      console.error(
        "Create property request failed:",
        error
      );

      setMessage(
        `Could not connect to server: ${error.message}`
      );

      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-empty">
          <h3>Please log in first.</h3>

          <Link
            to="/login"
            className="dashboard-primary-link"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "owner") {
    return (
      <div className="dashboard-page">
        <div className="dashboard-empty">
          <h3>
            Only property owners can create properties.
          </h3>

          <Link
            to="/"
            className="dashboard-primary-link"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

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

          <Link to="/owner-dashboard">
            Owner Dashboard
          </Link>

          <span className="user-name">
            Hello, {user.name}
          </span>
        </div>
      </nav>

      <main className="create-property-container">

        <Link
          to="/owner-dashboard"
          className="back-link"
        >
          ← Back to dashboard
        </Link>

        <div className="create-property-card">

          <p className="eyebrow">
            New listing
          </p>

          <h1>
            Add a Property
          </h1>

          <p>
            Create a new room or apartment listing
            for Kora renters.
          </p>

          <form
            className="create-property-form"
            onSubmit={handleSubmit}
          >

            <label>
              Property title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Modern apartment in Berlin"
              required
            />

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the property..."
              required
            />

            <div className="form-two-columns">

              <div>
                <label>
                  Property type
                </label>

                <select
                  name="propertyType"
                  value={form.propertyType}
                  onChange={handleChange}
                >
                  <option value="apartment">
                    Apartment
                  </option>

                  <option value="room">
                    Room
                  </option>
                </select>
              </div>

              <div>
                <label>
                  Monthly price (€)
                </label>

                <input
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div className="form-two-columns">

              <div>
                <label>
                  City
                </label>

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Berlin"
                  required
                />
              </div>

              <div>
                <label>
                  Address
                </label>

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street and number"
                  required
                />
              </div>

            </div>

            <div className="form-two-columns">

              <div>
                <label>
                  Bedrooms
                </label>

                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={form.bedrooms}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>
                  Bathrooms
                </label>

                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  value={form.bathrooms}
                  onChange={handleChange}
                />
              </div>

            </div>

            <label>
              Available from
            </label>

            <input
              name="availableFrom"
              type="date"
              value={form.availableFrom}
              onChange={handleChange}
              required
            />

            <label>
              Amenities
            </label>

            <input
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              placeholder="Wi-Fi, Kitchen, Balcony"
            />

            <small>
              Separate amenities with commas.
            </small>

            <label className="checkbox-row">

              <input
                name="furnished"
                type="checkbox"
                checked={form.furnished}
                onChange={handleChange}
              />

              Furnished

            </label>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create property"}
            </button>

          </form>

          {message && (
            <p className="form-message">
              {message}
            </p>
          )}

        </div>

      </main>

    </div>
  );
}

export default CreateProperty;
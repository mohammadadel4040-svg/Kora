const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    propertyType: {
      type: String,
      enum: ["room", "apartment"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    bedrooms: {
      type: Number,
      default: 1
    },

    bathrooms: {
      type: Number,
      default: 1
    },

    furnished: {
      type: Boolean,
      default: false
    },

    availableFrom: {
      type: Date,
      required: true
    },

    amenities: {
      type: [String],
      default: []
    },

    images: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Property", propertySchema);
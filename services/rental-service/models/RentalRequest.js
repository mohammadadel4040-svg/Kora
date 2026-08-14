const mongoose = require("mongoose");

const rentalRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true
    },

    renterId: {
      type: String,
      required: true
    },

    ownerId: {
      type: String,
      required: true
    },

    message: {
      type: String,
      default: ""
    },

    requestedMoveInDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("RentalRequest", rentalRequestSchema);
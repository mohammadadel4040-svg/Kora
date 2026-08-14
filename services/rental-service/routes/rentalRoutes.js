const express = require("express");
const RentalRequest = require("../models/RentalRequest");

const router = express.Router();


// =====================================
// CREATE RENTAL REQUEST
// =====================================

router.post("/", async (req, res) => {
  try {
    const {
      propertyId,
      renterId,
      ownerId,
      message,
      requestedMoveInDate
    } = req.body;

    if (
      !propertyId ||
      !renterId ||
      !ownerId ||
      !requestedMoveInDate
    ) {
      return res.status(400).json({
        message:
          "Property, renter, owner and move-in date are required"
      });
    }

    const rentalRequest = new RentalRequest({
      propertyId,
      renterId,
      ownerId,
      message: message || "",
      requestedMoveInDate
    });

    await rentalRequest.save();

    res.status(201).json({
      message: "Rental request created successfully",
      rentalRequest
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================
// GET ALL RENTAL REQUESTS
// =====================================

router.get("/", async (req, res) => {
  try {
    const rentalRequests =
      await RentalRequest.find().sort({
        createdAt: -1
      });

    res.json({
      message:
        "Rental requests retrieved successfully",
      rentalRequests
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================
// GET REQUESTS FOR ONE RENTER
// =====================================

router.get(
  "/renter/:renterId",
  async (req, res) => {
    try {
      const rentalRequests =
        await RentalRequest.find({
          renterId: req.params.renterId
        }).sort({
          createdAt: -1
        });

      res.json({
        message:
          "Renter requests retrieved successfully",
        rentalRequests
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================
// GET REQUESTS FOR ONE OWNER
// =====================================

router.get(
  "/owner/:ownerId",
  async (req, res) => {
    try {
      const rentalRequests =
        await RentalRequest.find({
          ownerId: req.params.ownerId
        }).sort({
          createdAt: -1
        });

      res.json({
        message:
          "Owner requests retrieved successfully",
        rentalRequests
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================
// GET ONE RENTAL REQUEST
// =====================================

router.get("/:id", async (req, res) => {
  try {
    const rentalRequest =
      await RentalRequest.findById(
        req.params.id
      );

    if (!rentalRequest) {
      return res.status(404).json({
        message: "Rental request not found"
      });
    }

    res.json({
      message:
        "Rental request retrieved successfully",
      rentalRequest
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// =====================================
// UPDATE REQUEST STATUS
// =====================================

router.put(
  "/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "accepted",
        "rejected"
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Status must be pending, accepted or rejected"
        });
      }

      const rentalRequest =
        await RentalRequest.findByIdAndUpdate(
          req.params.id,
          {
            status
          },
          {
            new: true,
            runValidators: true
          }
        );

      if (!rentalRequest) {
        return res.status(404).json({
          message: "Rental request not found"
        });
      }

      res.json({
        message:
          "Rental request status updated successfully",
        rentalRequest
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


// =====================================
// DELETE RENTAL REQUEST
// =====================================

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const rentalRequest =
        await RentalRequest.findByIdAndDelete(
          req.params.id
        );

      if (!rentalRequest) {
        return res.status(404).json({
          message: "Rental request not found"
        });
      }

      res.json({
        message:
          "Rental request deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message
      });
    }
  }
);


module.exports = router;
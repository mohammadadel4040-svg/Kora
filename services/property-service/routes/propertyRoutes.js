const express = require("express");
const Property = require("../models/property");

const router = express.Router();


// CREATE PROPERTY
router.post("/", async (req, res) => {
  try {
    const {
      ownerId,
      title,
      description,
      propertyType,
      price,
      city,
      address,
      bedrooms,
      bathrooms,
      furnished,
      availableFrom,
      amenities,
      images,
      status
    } = req.body;

    const property = new Property({
      ownerId,
      title,
      description,
      propertyType,
      price,
      city,
      address,
      bedrooms,
      bathrooms,
      furnished,
      availableFrom,
      amenities,
      images,
      status
    });

    await property.save();

    res.status(201).json({
      message: "Property created successfully",
      property
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// GET ALL PROPERTIES + FILTERS
router.get("/", async (req, res) => {
  try {
    const {
      city,
      propertyType,
      minPrice,
      maxPrice,
      furnished,
      status
    } = req.query;

    const filter = {};

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i"
      };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (furnished !== undefined) {
      filter.furnished = furnished === "true";
    }

    if (status) {
      filter.status = status;
    }

    const properties = await Property.find(filter).sort({
      createdAt: -1
    });

    res.json({
      message: "Properties retrieved successfully",
      count: properties.length,
      properties
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// GET PROPERTIES BY OWNER
// IMPORTANT: keep this BEFORE "/:id"
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.params.ownerId
    }).sort({
      createdAt: -1
    });

    res.json({
      message: "Owner properties retrieved successfully",
      count: properties.length,
      properties
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// GET ONE PROPERTY
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    res.json({
      message: "Property retrieved successfully",
      property
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// UPDATE PROPERTY
router.put("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    res.json({
      message: "Property updated successfully",
      property
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


// DELETE PROPERTY
router.delete("/:id", async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(
      req.params.id
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    res.json({
      message: "Property deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});


module.exports = router;
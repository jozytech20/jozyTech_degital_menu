import Venue from "../../model/Venue.js";
import { deleteCloudinaryImage } from "../Image/deleteCloudinaryImage.js";


export const getMyVenue = async (req, res) => {
  try {
    const venueId = req.user.venueId;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "venue fetched successfully",
      data: venue,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export const updateMyVenue = async (req, res) => {
  try {
    const venueId = req.user.venueId;
    const { name, email, phone, website, logoUrl, logoPublicId } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    if (logoUrl && logoUrl !== venue.branding.logoUrl) {
      await deleteCloudinaryImage(venue.branding.logoPublicId);
      venue.branding.logoUrl = logoUrl;
      venue.branding.logoPublicId = logoPublicId;
    }

    if (name) venue.name = name;
    if (email) venue.email = email;
    if (phone) venue.phone = phone;
    if (website) venue.website = website;

    await venue.save();

    res.status(200).json({
      success: true,
      message: "venue updated successfully",
      data: venue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};
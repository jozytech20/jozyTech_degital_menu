import Venue from "../../model/Venue.js";


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
    const { email, phone, website, logoUrl } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    if (email) venue.email = email;
    if (phone) venue.phone = phone;
    if (website) venue.website = website;
    if (logoUrl) venue.branding.logoUrl = logoUrl;

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
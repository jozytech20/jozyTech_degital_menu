import Venue from "../../model/Venue";


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

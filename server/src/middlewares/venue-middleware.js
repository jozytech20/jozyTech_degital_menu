import Venue from "../model/Venue.js";


export const resolveVenue = async( req, res, next ) =>{
  try {
    const host = req.headers.host
    const subDomain = host.split(".")[0]  //blue-nile
    
    const venue = await Venue.findOne({ slug : subDomain, status : "active" })
     if (!venue) {
       return res.status(404).json({ 
        success: false,
        message: "Venue not found" 
      });
     }

     req.venue = venue;
     next();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success : false,
      message : "Internal server error!"
    })
  }
}
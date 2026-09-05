import mongoose from "mongoose";
import User from "../../model/User.js";
import Venue from "../../model/Venue.js";



export const createVenue = async( req, res ) =>{
  const session = await mongoose.startSession();
  session.startTransaction();

 try {
   const {
     ownerName,
     ownerEmail,
     password,
     slug,
     venueName,
     venueEmail,
     phone,
     website,
   } = req.body;

   if (
     !ownerName ||
     !ownerEmail ||
     !password ||
     !slug ||
     !venueName ||
     !venueEmail ||
     !phone
   ) {
     return res.status(400).json({
       success: false,
       message: "invalid credentials!",
     });
   }

   const existingUser = await User.findOne({ email: ownerEmail });
   if (existingUser) {
     return res.status(409).json({
       success: false,
       message: "Email already in use",
     });
   }

   const reservedSlugs = ["www", "api", "admin", "dashboard", "app", "mail"];

   if (reservedSlugs.includes(slug)) {
     return res.status(400).json({
       success: false,
       message: "this slug is reserved!",
     });
   }

   const existingVenue = await Venue.findOne({ slug });
   if (existingVenue) {
     return res.status(409).json({
       success: false,
       message: "this slug is already taken!",
     });
   }

   //creating an owner
   const owner = await User.create(
     [
       {
         name: ownerName,
         email: ownerEmail,
         password,
         role: "owner",
         venueId: null,
         createdBy: req.user.id,
       },
     ],
     { session },
   );

   //creating venue
   const venue = await Venue.create(
     [
       {
         name: venueName,
         email: venueEmail,
         phone,
         website: website,
         slug,
         ownerId: owner[0]._id,
         createdBy: req.user.id,
       },
     ],
     { session },
   );

   await User.findByIdAndUpdate(owner[0]._id, {
     venueId: venue[0]._id,
   }, { session });

   await session.commitTransaction();

   res.status(201).json({
     success: true,
     message: "owner and venue successfully created! ",
     data: venue[0],
   });
 } catch (error) {
  await session.abortTransaction();
  console.error(error);
   res.status(500).json({
     success: false,
     message: "internal server error!",
   });
 } finally {
   session.endSession();
 }
}

export const fetchVenues = async(req, res) =>{
  try {
    const { search } = req.query;

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const venues = await Venue.find(filter);

   
     res.status(200).json({
       success: true,
       message: "venues successfully fetched!",
       data: venues,
     });

  } catch (error) {
    console.error(error);
     res.status(500).json({
       success: false,
       message: "Internal server error!",
     });
  }
}

export const updateVenue = async( req, res) =>{
 try {
   const id = req.params.id;

   const {
     slug,
     name,
     email,
     phone,
     website,
     status,
     // subscription,  //obj
     branding, //obj
   } = req.body;

   const venue = await Venue.findById(id);
   if (!venue) {
    return res.status(404).json({
       success: false,
       message: "No Venue Found!",
     });
   }

   if (slug) {
     const reservedSlugs = ["www", "api", "admin", "dashboard", "app", "mail"];
     if (reservedSlugs.includes(slug)) {
       return res.status(400).json({
         success: false,
         message: "This slug is reserved",
       });
     }

     const existingVenue = await Venue.findOne({ slug, _id: { $ne: id } });
     if (existingVenue) {
       return res.status(409).json({
         success: false,
         message: "This slug is already taken",
       });
     }

     venue.slug = slug;
   }
   
   if (name) venue.name = name;
   if (email) venue.email = email;
   if (phone) venue.phone = phone;
   if (website) venue.website = website;
   if (status) venue.status = status;

    if (branding) {
      if (branding.logoUrl) venue.branding.logoUrl = branding.logoUrl;
      if (branding.theme?.primaryColor)
        venue.branding.theme.primaryColor = branding.theme.primaryColor;
      if (branding.theme?.secondaryColor)
        venue.branding.theme.secondaryColor = branding.theme.secondaryColor;
      if (branding.qrCodeUrl) venue.branding.qrCodeUrl = branding.qrCodeUrl;
    }

   await venue.save();

   res.status(200).json({
     success: true,
     message: "venue successfully updated!",
     data : venue,
   });
 } catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal server error!",
  });
 }
}
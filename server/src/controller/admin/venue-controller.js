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
         website: website || null,
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
import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    website: String,
    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free",
      },
      expiresAt: Date,
      isActive: { type: Boolean, default: true },
    },
    branding: {
      logoUrl: { type: String, default: "" },
      qrCodeUrl: { type: String, default: "" },
      theme: {
        primaryColor: {
          type: String,
          default: "#008000",
        },
        secondaryColor: {
          type: String,
          default: "#000000",
        },
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);


const Venue = mongoose.model("Venue", venueSchema)
export default Venue;
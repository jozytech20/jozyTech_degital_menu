import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      index: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Special features for the entire category
    hasSpecialOffer: Boolean,
    specialOfferText: String,
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
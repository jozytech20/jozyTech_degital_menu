// models/MenuItem.js
import mongoose from "mongoose"

const menuItemSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    variants: [
      //Select Size: [Small $10.99] [Medium $14.99 ✓] [Large $18.99]
      {
        name: String,
        price: Number,
        isDefault: { type: Boolean, default: false },
      },
    ],
    image: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      //Highlight this item as special
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const MenuItem = mongoose.model("MenuItem", menuItemSchema)
export default MenuItem;
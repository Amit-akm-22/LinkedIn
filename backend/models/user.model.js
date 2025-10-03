import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "",
    },
    bannerImg: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "Linkedin User",
    },
    location: {
      type: String,
      default: "Earth",
    },
    about: {
      type: String,
      default: "",
    },
    skills: [String],
    experience: [
      {
        _id: false, // disables ObjectId for subdocs
        customId: { type: String, default: () => crypto.randomUUID() },
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
        currentlyWorking: Boolean,
      },
    ],
   education: [
  {
    _id: false, // disable default ObjectId
    customId: { type: String, default: () => crypto.randomUUID() },
    school: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
  },
],

    
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

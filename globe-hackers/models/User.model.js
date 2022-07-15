const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, 'This username is already taken'],
      required: [true, "Please provide a username"],
    },
    passwordHash: {
      type: String,
      required : [true, "Password is required"],
    },
    country: {
      type: String,
      required: [true, 'You need to tell us where you come from :)'],
    },
    experience: {
      type: String,
      enum: ["newbie", "intermediate", "advanced"],
      required: [true, "choose a level of experience as a traveler"],
    }
  },
    {
    timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;

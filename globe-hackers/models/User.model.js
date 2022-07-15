const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, 'This username is already taken'],
      required: true,
    },
    passwordHash: {
      type: String,
      required : [true, "Password is required"],
    },
    country: {
      type: String,
      required: [true, 'You need to tell us where you come from :)']
    },
    experience: {
      enum: ["newbie", "intermediate", "advanced"],
      required: [true, "please tell us what is your traveler's experience"],
    },
  },
    {
    timestamps: true,
    }
);

const User = model("User", userSchema);

module.exports = User;

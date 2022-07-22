const { Schema, model } = require("mongoose");

const tipSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: [true, "Please tell us in which country takes place your travel experience"]
    },
    city: {
      type: String,
      required: [true, "Please tell us in which city takes place your travel experience"],
    },
    category: {
      type: String,
      // required: [true, "Please tell us in what category this hack falls into"],
      // enum: ["restaurant","leisure","bar","museum","sport","sight-seeing","night"],
    },
    description: {
      type: String,
      minlength: 50,
      required: [true, "Please tell us more and use at least 50 characters. We want to know everything :)"],
    },
    imageUrl: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Tip = model("Tip", tipSchema);

module.exports = Tip;

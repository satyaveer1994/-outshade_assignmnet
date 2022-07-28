const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema(
  {
    creator:{
      type:ObjectId
    },
    title: {
      type: String,
      required: true,
    
    },
    description: {
      type: String,
    
    },
    eventDate: {
      type: String,
      required: true,
    },
    invitees: [
      {
        invitee: { 
            type:  ObjectId,
              ref: "User",
               required: true,
             },
        time: {
          type: String,
          required: true,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
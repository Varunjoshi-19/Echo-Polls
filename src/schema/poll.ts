import mongoose, { Schema, models, model } from "mongoose";

const OptionSchema = new Schema({

    text: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 0
    },


});



const PollSchema = new Schema({

    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [OptionSchema],
        validate: [(val: any) => val.length >= 2, "At least 2 options required"]
    },

    votesBy: {
        type: Map,
        of: Number,
        default: {},
    },
    createdBy: {
        type: String,
        required: true
    }

}, { timestamps: true });


export const Poll = models.Poll || model("Poll", PollSchema);
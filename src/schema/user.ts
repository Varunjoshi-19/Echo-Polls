import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }


}, { timestamps: true });


export const User = models.User || model("User", UserSchema);

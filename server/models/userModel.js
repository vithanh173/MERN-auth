import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: { type: String },
        lastName: { type: String },
        phoneNumber: { type: Number },
        address: { type: String },
        profile: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/previews/010/056/184/original/people-icon-sign-symbol-design-free-png.png",
        },
    },
    { timestamps: true }
)

export const User = mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    profileImage: {
        type: String,
        default: "https://example.com/default-profile-picture.png", // Replace with your default image URL
    },
    coverImage: {
        type: String,
        default: "https://example.com/default-cover-image.png", // Replace with your default image URL
    },
    bio: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
    }],
}, { timestamps: true, }
);

const User = mongoose.model("User", userSchema);

export default User;
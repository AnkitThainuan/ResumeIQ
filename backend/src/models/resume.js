import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filePath: String,
    extractedText: String,
    analysis: Object
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
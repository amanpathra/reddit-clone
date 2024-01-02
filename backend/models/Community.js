import mongoose, { Schema } from "mongoose";

const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    frontline: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    members: {
        type: Number
    },
    rules: {
        type: String
    },
    mods: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]

}, {
    timestamps: true
})

const Community = mongoose.model('community', CommunitySchema);
export default Community;
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    valid: { type: Boolean, default: false },
    userAgent: { type: String, required: true },
    ip: { type: String, required: true}
},
    {
        timestamps: true
    }
)

export default mongoose.model('Sessions', SessionSchema)


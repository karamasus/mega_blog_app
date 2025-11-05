import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    featuredImage: { type: String, required: true }
},
    {
        timestamps: true
    }
)

export default mongoose.model('Posts', postsSchema)


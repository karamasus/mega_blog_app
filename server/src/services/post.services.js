import Posts from '../models/post.model.js'

export const createPost = async ({ userId, featuredImage, slug, title, content, status }) => {
    try {
        const newPost = new Posts({ userId, featuredImage, slug, title, content, status })
        newPost.save()
        return newPost
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getPostBySlug = async (slug) => {
    try {
        return await Posts.findOne({ slug })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getAllPosts = async (userId) => {
    try {
        return await Posts.find({ userId })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const updatePostBySlug = async ({ slug, currentSlug, content, featuredImage, title, status }) => {
    try {
        const updatedPost = await Posts.findOneAndUpdate(
            { slug: currentSlug },
            { $set: { featuredImage, content, status, slug, title } },
            { new: true }
        )

        if (!updatedPost)
            throw new Error('Post not found.')

        return updatedPost
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const deletePostBySlug = async (slug) => {
    try {
        const deletedPost = await Posts.findOneAndDelete({ slug })

        if (!deletedPost)
            throw new Error('Post not found.')

        return deletedPost
    } catch (err) {
        console.log(err)
        throw err
    }
}

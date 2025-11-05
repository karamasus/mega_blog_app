import { createPost, deletePostBySlug, getAllPosts, getPostBySlug, updatePostBySlug } from "../services/post.services.js";

export const postPostsPage = async (req, res) => {
    try {
        const featuredImage = req.file ? `uploads/users/${req.file.filename}` : null
        const { title, slug, content, status } = req.body

        if (!title || !slug || !content) return res.status(400).json({ success: false, message: 'Title, slug and content required.' })

        const existingPost = await getPostBySlug(slug)

        if (existingPost) return res.status(409).json({ success: false, message: 'Post already exists.' })

        const newPost = await createPost({ userId: req.user.id, featuredImage, title, slug, content, status });

        return res.status(201).json({ success: true, message: 'Post created successfully.', newPost })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const getPostsPage = async (req, res) => {
    try {
        const userId = req.user.id

        if (!userId) return res.status(401).json({ success: false, message: 'User not logged in.' })

        const posts = await getAllPosts(userId)

        if (!posts) return res.status(404).json({ success: false, message: 'No post found.' })

        return res.status(201).json({ success: true, message: 'Posts fetched successfully.', posts })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const getPostBySlugPage = async (req, res) => {
    try {
        const { slug } = req.params

        if (!slug) return res.status(401).json({ success: 'false', message: 'Invalid slug.' })

        const post = await getPostBySlug(slug)

        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })

        return res.status(201).json({ success: true, message: 'Post found.', post })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const putPostBySlugPage = async (req, res) => {
    try {
        const { slug: currentSlug } = req.params

        if (!currentSlug) return res.status(400).json({ success: false, message: 'Invalid slug' })

        const { title, content, status, slug } = req.body

        let featuredImage = req.file ? `uploads/users/${req.file.filename}` : null

        if (!title || !content || !slug) return res.status(400).json({ success: false, message: 'Title, slug and content required.' })

        const findPost = await getPostBySlug(currentSlug)

        if (!findPost) return res.status(404).json({ success: false, message: 'Post not found.' })

        const existingPost = await getPostBySlug(slug)

        if (existingPost && existingPost.slug !== currentSlug) return res.status(409).json({ success: false, message: 'Post with this slug already exists.' })

        if (!featuredImage) featuredImage = findPost.featuredImage

        const updatedPost = await updatePostBySlug({ title, content, status, slug, currentSlug, featuredImage })

        return res.status(200).json({ success: true, message: 'Post updated successfully.', updatedPost })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

export const deletePostPage = async (req, res) => {
    try {
        const { slug } = req.params

        if (!slug) return res.status(400).json({ success: false, message: 'Invalid slug.' })

        const post = await getPostBySlug(slug)

        if (!post) return res.status(404).json({ success: false, message: 'Post not found.' })

        const deletedPost = await deletePostBySlug(slug);

        if (!deletedPost) return res.status(501).json({ success: false, message: 'Unable to delete post.' })

        return res.status(200).json({ success: true, message: 'Post deleted successfully.', deletedPost })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal server error.' })
    }
}

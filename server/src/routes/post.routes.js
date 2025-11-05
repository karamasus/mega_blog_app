import { Router } from "express";
import { deletePostPage, getPostBySlugPage, getPostsPage, postPostsPage, putPostBySlugPage } from "../controllers/post.controller.js";
import { uploads } from '../config/multerConfig.js'

const router = Router()

router
    .route('/posts')
    .post(uploads.single('featuredImage'), postPostsPage)
    .get(getPostsPage)

router
    .route('/posts/:slug')
    .get(getPostBySlugPage)
    .put(uploads.single('featuredImage'), putPostBySlugPage)
    .delete(deletePostPage)

export const postRoutes = router


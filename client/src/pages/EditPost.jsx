import { useCallback, useEffect, useState } from "react"
import Container from "../components/container/Container"
import PostForm from '../components/post-form/PostForm'
import { useParams } from 'react-router-dom'
import { fetchPostBySlug } from "../services/post.services"

const EditPost = () => {
    const [post, setPost] = useState(null)
    const { slug } = useParams()

    const fetchPost = useCallback(async () => {
        try {
            const res = await fetchPostBySlug(slug)
            if (res) {
                setPost(res)
            }
        } catch (err) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <div className='py-8'>
            <Container>
                {post && <PostForm post={post} />}
            </Container>
        </div>
    )
}

export default EditPost


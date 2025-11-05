import Container from '../components/container/Container'
import Button from '../components/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { deletePostBySlug, fetchPostBySlug } from '../services/post.services.js'
import { useDispatch } from 'react-redux'
import { deletePost } from '../store/postSlice.js'

const Post = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleDeletePost = async () => {
        try {
            const res = await deletePostBySlug(slug)
            if (res) {
                dispatch(deletePost(res._id))
                navigate('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const fetchPost = useCallback(async () => {
        try {
            const res = await fetchPostBySlug(slug)
            if (res) {
                setPost(res)
            }
        } catch (err) {
            console.log(err)
            setError('Error fetching post.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!post)
            fetchPost()
        else
            setLoading(false)
    }, [fetchPost])

    if (loading) return <div className='text-red-500 text-center'>Loading...</div>

    if (error) return <div className='text-red-500 text-center'>{error}</div>

    return (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${post.featuredImage}`}
                        alt=''
                        className="rounded-xl w-full"
                    />
                    <div className="absolute right-6 top-6">
                        <Link to={`/edit-post/${slug}`}>
                            <Button bgColor="bg-green-500" className="mr-3">
                                Edit
                            </Button>
                        </Link>
                        <Button bgColor="bg-red-500" onClick={handleDeletePost}>
                            Delete
                        </Button>
                    </div>
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {post.content}
                </div>
            </Container>
        </div>
    )
}

export default Post



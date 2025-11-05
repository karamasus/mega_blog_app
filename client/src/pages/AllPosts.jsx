import Container from '../components/container/Container'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { fetchPosts } from '../services/post.services.js'
import { useDispatch } from 'react-redux'
import { setPosts } from '../store/postSlice.js'
import PostCard from '../components/PostCard.jsx'

const AllPosts = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()
    const posts = useSelector(state => state.posts.posts)
    const status = useSelector(state => state.auth.status)

    const fetchAllPosts = useCallback(async () => {
        try {
            const res = await fetchPosts()
            if (res) {
                dispatch(setPosts(res))
            }
        } catch (err) {
            console.log(err)
            setError('Failed to load posts.')
        } finally {
            setLoading(false)
        }
    }, [dispatch])

    useEffect(() => {
        if (status && (!posts || posts.length === 0))
            fetchAllPosts()
        else
            setLoading(false)
    }, [fetchAllPosts, posts])

    if (loading) return <div className='h-screen w-full flex justify-center p-4'>Loading...</div>

    if (error) return <div className='text-red-500 text-center'>{error}</div>

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {
                        posts && posts.map(post => {
                            return <PostCard key={post._id} post={post} />
                        })
                    }
                </div>
            </Container>
        </div>
    )
}

export default AllPosts

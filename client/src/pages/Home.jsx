import PostCard from '../components/PostCard'
import Container from '../components/container/Container'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../services/post.services.js'
import { useCallback, useEffect, useState } from 'react'
import { setPosts } from '../store/postSlice.js'

function Home() {
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
    }, [fetchAllPosts])

    if (loading) return <div className='h-screen w-full flex justify-center p-4'>Loading...</div>

    if (error) return <div className='text-red-500 text-center'>{error}</div>

    if (!posts || posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home


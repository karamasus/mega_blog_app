import { Link } from 'react-router-dom'
import Container from './container/Container'

function PostCard({ post }) {

  return (
    <div className='py-8'>
      <Container>
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <Link to={`/post/${post.slug}`} className='w-full'>
            <div className='w-full justify-center mb-4'>
              <img src={`${import.meta.env.VITE_API_URL}/${post.featuredImage}`} alt={post.title}
                className='rounded-xl h-60 w-90' />
            </div>
            <h2
              className='text-xl font-bold'
            >{post.title}</h2>
          </Link>
        </div>
      </Container>
    </div>
  )
}

export default PostCard

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../services/user.services.js'
import { logout } from '..//../store/authSlice.js'

function LogoutBtn() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutHandler = async () => {
    try {
      const res = await logoutUser()
      if (res) {
        console.log(res)
        alert('Logout successfully.')
        dispatch(logout())
        navigate('/login')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <button
      className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
      onClick={logoutHandler}
    >Logout</button>
  )
}

export default LogoutBtn

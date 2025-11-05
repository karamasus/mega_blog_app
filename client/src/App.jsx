import { Outlet } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import './App.css'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice.js'
import { fetchUser } from './services/user.services.js'

const App = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const fetchData = useCallback(async () => {
    try {
      const res = await fetchUser()
      if (res) {
        dispatch(login(res))
      }
    } catch (err) {
      console.log(err)
      dispatch(logout())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
      fetchData()
  }, [])

  if (loading)
    return <div className='h-screen w-full flex justify-center pt-5'>Loading...</div>

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default App


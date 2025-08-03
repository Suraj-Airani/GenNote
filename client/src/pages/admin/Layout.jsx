import React from 'react'
import { assets } from '../../assets/assets'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'

const Layout = () => {

    const navigate = useNavigate()

  return (
    <>
        <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
            <img src={assets.logo} alt="" className='w-32 sm:w-40 cursor-pointer' onClick={()=> navigate('/')}/>
            <button onClick={()=>navigate('/')} className='flex text-sm px-10 py-2 bg-primary text-white rounded-full cursor-pointer'>
                Logout
                <img src={assets.logout_icon} className='w-3.5' alt="logout" />    
            </button>
        </div>
        <div className='flex h-[calc(100vh-70px)]'>
            <Sidebar />
            <Outlet />
        </div>
    </>
  )
}

export default Layout
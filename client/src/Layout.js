import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import List from './List'
import NavBar from './NavBar'

const Layout = () => {
  return (
    <div className="App flex flex-col">
      <Header />
      <div className='w-full max-w-6xl mx-auto flex'>
        <div className="border border-[#e6e6e6] rounded-lg bg-white m-2 p-2 flex flex-col flex-[5]">
          <Outlet />
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Layout
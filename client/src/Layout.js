import React, { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import NavBar from './NavBar'

const Layout = () => {
  return (
    <div className="App flex flex-col">
      <Header />
      <div className='w-full max-w-6xl mx-auto flex flex-col-reverse lg:flex-row'>
        <div className="border border-neutral-300 rounded-lg bg-white m-2 p-2 flex flex-col flex-[5]">
          <Suspense fallback={<div>Page is Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
        <NavBar />
      </div>
    </div>
  )
}

export default Layout
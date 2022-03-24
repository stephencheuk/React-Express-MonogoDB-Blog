import React from 'react'
import { Outlet } from 'react-router-dom'

const Posts = () => {
  return (
    <div>
      <div>Posts</div>
      <Outlet />
    </div>
  )
}

export default Posts
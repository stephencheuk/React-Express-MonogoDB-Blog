import React from 'react'
import { Link } from 'react-router-dom'

const NavBlock = ({ name, data, ...props }) => {
  return (
    <div className='navbar border border-neutral-300 rounded-lg m-2 p-2 bg-white'>
      {name}
      <hr className='border-[#ff3d00]' />
      <div className='flex'>
        {
          data.map(tag => <Link to={`/posts?tag=${tag}`} className='m-1 border-b border-transparent hover:border-orange-700' key={tag}>{tag}</Link>)
        }
      </div>
    </div>

  )
}

export default NavBlock
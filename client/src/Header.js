import { Link } from "react-router-dom"

const Header = (props) => {
  return (
    <div className="header bg-[#fc766a] mb-5">
      <div className="max-w-6xl mx-auto flex place-items-center justify-between">
        <div className="font-extralight m-4 text-2xl text-white">
          <Link to="/">Simple BLOG</Link>
          [<Link to="/posts">/Posts</Link>]
          [<Link to="/posts/new">/Posts/new</Link>]
          [<Link to="/posts/123">/Posts/123</Link>]
        </div>
        <div className="flex items-center">
          <input className="rounded text-sm p-1 outline-none" placeholder="Search" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white m-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
    </div>
  )
}

export default Header
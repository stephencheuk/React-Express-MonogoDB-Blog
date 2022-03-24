import React from 'react'
import { Link } from 'react-router-dom'

const Post = ({ data, ...props }) => {

  // {
  //   cat: '思維',
  //   title: '人生24堂',
  //   desc: '',
  //   author: 'stephen',
  //   createdAt: '2022-03-18 00:01:10',
  //   img: 'https://1.bp.blogspot.com/-ao-g06bkbZk/XWZAVpMHs1I/AAAAAAAABYs/IPpjTILdxIUg16s2h77SBtfjIAjU2GldgCLcBGAs/s1600/photo-1522008660239-1bbdb39444c4.jpg',
  //   tags: ['思維', '人生'],
  // }

  return (
    <div>
      {
        data.map((d) => {
          return (
            <div key={d.title} className='flex mx-2 py-6 border-b border-[#e6e6e6]'>
              <Link to={`/posts/${d._id}`}>
                <div className='flex-1 h-[256px] w-[380px] overflow-hidden place-content-center flex'>
                  {d.image ? <img className="max-w-fit" alt="" src={d.image} /> : null}
                  {d.img ? <img className="max-w-fit" alt="" src={d.img} /> : null}
                </div>
              </Link>
              <div className='flex-1 pl-6 flex flex-col'>
                <div className='text-2xl font-bold'> <Link to={`/posts/${d._id}`}>{d.title}</Link> </div>
                <div className='flex items-center my-4 text-gray-400'>
                  <div className='flex text-xs mr-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {d.author}
                  </div>
                  <div className='flex text-xs'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {d.updatedAt}
                  </div>
                </div>
                <div className='text-xs flex items-center'><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> {d.tags.map(tag => <div key={tag.value} className='m-1'><Link to={`?tag=${tag.value}`}>{tag.value}</Link></div>)}</div>
                <div className='flex items-center'>
                  {d.desc}
                </div>
              </div>
            </div>
          )
        })
      }
    </div >
  )
}

export default Post
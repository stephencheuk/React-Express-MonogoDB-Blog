import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Post from './Post'

const PostsList = () => {

  const [searchParams] = useSearchParams();

  const postsDummy = [
    // {
    //   cat: '思維',
    //   title: '人生24堂',
    //   desc: '思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 ',
    //   author: 'stephen',
    //   createdAt: '2022-03-18 00:01:10',
    //   img: 'https://1.bp.blogspot.com/-ao-g06bkbZk/XWZAVpMHs1I/AAAAAAAABYs/IPpjTILdxIUg16s2h77SBtfjIAjU2GldgCLcBGAs/s1600/photo-1522008660239-1bbdb39444c4.jpg',
    //   tags: ['思維', '人生'],
    // }, {
    //   cat: '思維',
    //   title: '人生24堂',
    //   desc: '思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 思維 人生 ',
    //   author: 'stephen',
    //   createdAt: '2022-03-18 00:01:10',
    //   img: 'https://1.bp.blogspot.com/-ao-g06bkbZk/XWZAVpMHs1I/AAAAAAAABYs/IPpjTILdxIUg16s2h77SBtfjIAjU2GldgCLcBGAs/s1600/photo-1522008660239-1bbdb39444c4.jpg',
    //   tags: ['思維', '人生'],
    // }
  ];

  const [posts, setPosts] = useState(postsDummy);

  useEffect(() => {
    GetData();
  }, [searchParams])

  const GetData = async (e) => {
    try {
      const param = Object.fromEntries(searchParams);
      const search = [];
      if (param['tag']) search.push('tag=' + param['tag']);
      console.log('search', search)
      const res = await axios.get("/api/mydata/list" + (search ? '?' + search.join('&') : ''));
      console.log(res.data.data);
      setPosts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <div className='flex justify-between border-b'>
        <div className='p-4 text-2xl font-bold'>
          All Posts
        </div>
        <div className='p-4 text-2xl font-bold'><Link to="/posts/new" title="New Post">＋</Link></div>
      </div>
      <Post data={posts} />
    </div>
  )
}

export default PostsList
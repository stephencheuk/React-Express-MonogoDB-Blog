import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Post from './Post'

const PostsList = () => {

  const [searchParams] = useSearchParams();

  const [tag, setTag] = useState("");
  const [posts, setPosts] = useState([]);

  const GetData = async (e) => {
    try {
      const param = Object.fromEntries([...searchParams]);
      const search = [];
      if (param['tag']) { search.push('tag=' + param['tag']); setTag(param['tag']) }
      if (param['search']) { search.push('search=' + param['search']); setTag(param['search']) }
      if (param['page']) { search.push('page=' + param['page']); }
      const res = await axios.get("/api/mydata/list" + (search ? '?' + search.join('&') : ''));
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    GetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div>
      <div className='flex justify-between border-b'>
        <div className='p-4 flex items-center gap-2'>
          <div className=' text-2xl font-bold'>
            All Posts
          </div>
          <div className='hidden text-2xl'>
            {" "}
            {
              tag ?? `#${tag}`
            }
          </div>
        </div>
        <div className='p-4 text-2xl font-bold'><Link to="/posts/new" title="New Post">＋</Link></div>
      </div>
      <Post data={posts} />
    </div>
  )
}

export default PostsList
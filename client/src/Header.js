import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom"

import { SearchIcon } from "@heroicons/react/solid";

const Header = (props) => {

  let [searchParams, setSearchParams] = useSearchParams();
  let [querystring_search, setQS_Search] = useState('');

  window.searchParams = searchParams;
  window.querystring_search = querystring_search;

  const omEnterPress = (e) => {
    if (e.key === 'Enter') {
      let q = {};
      //q = Object.fromEntries([...searchParams]);
      q.search = e.target.value;
      setSearchParams(q)
    }
  }

  useEffect(() => {
    setQS_Search(searchParams.get('search') || '');
  }, [searchParams])

  return (
    <div className="header bg-[#fc766a] mb-5">
      <div className="max-w-6xl mx-auto flex place-items-center justify-between">
        <div className="font-extralight m-4 text-2xl text-white">
          <Link to="/">Simple BLOG</Link>
        </div>
        <div className="flex items-center">
          <input className="rounded text-sm p-1 outline-none" placeholder="Search" value={querystring_search} onChange={e => setQS_Search(e.target.value)} onKeyPress={omEnterPress} />
          <SearchIcon className="h-4 w-4 text-white m-2" />
        </div>
      </div>
    </div>
  )
}

export default Header
import axios from "axios";
import React, { useEffect, useState } from 'react'

import NavBlock from "./NavBlock";

const NavBar = () => {

  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/mydata/tags");
        setTags(res.data.tags);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='flex-[2]'>
      {/*<NavBlock name="Category" />*/}
      <NavBlock name="Tags" data={tags} />
    </div>
  )
}

export default NavBar
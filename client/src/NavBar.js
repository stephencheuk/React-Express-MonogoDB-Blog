import axios from "axios";
import React, { useEffect, useState } from 'react'

import NavBlock from "./NavBlock";

const NavBar = () => {

  const [tags, setTags] = useState([]);

  useEffect(async () => {
    try {
      const res = await axios.get("/api/mydata/tags");
      console.log(res.data);
      setTags(res.data.tags);
    } catch (err) {
      console.log(err);
    }

  }, []);

  return (
    <div className='hidden flex-[2] lg:block'>
      {/*<NavBlock name="Category" />*/}
      <NavBlock name="Tags" data={tags} />
    </div>
  )
}

export default NavBar
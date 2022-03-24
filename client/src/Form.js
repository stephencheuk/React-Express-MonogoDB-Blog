import { useState, useEffect } from 'react';
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/solid";

const Form = ({ ...props }) => {

  const [formdata, setFormData] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    GetData();
  }, [])

  const GetData = async (e) => {
    try {
      const res = await axios.get("/api/mydata/list");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }

  }

  const DeleteHandler = async (e, _id) => {
    e.preventDefault();
    try {
      await axios.delete("/api/mydata/del/" + _id, {
        id: _id
      });
      GetData();
    } catch (err) {
      console.log(err);
    }
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formdata);
    try {
      if (formdata._id) {
        await axios.put("/api/mydata/update/" + formdata._id, {
          ...formdata
        });
      } else {
        await axios.post("/api/mydata/add", {
          ...formdata
        });
      }
      setFormData({})
      GetData();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='w-[500px] m-auto mt-10'>
      <form onSubmit={SubmitHandler}>
        <input type="hidden" name="_id" value={formdata['_id'] || ''} onChange={e => setFormData({ ...formdata, name: e.target.value })} />
        <div className='flex m-2'>
          <div className='w-16'>Name:</div>
          <div className='flex-1'><input className='rounded border border-red-500 w-full' name="name" value={formdata['name'] || ''} onChange={e => setFormData({ ...formdata, name: e.target.value })} /></div>
        </div>
        <div className='flex m-2'>
          <div className='w-16'>Age:</div>
          <div className='flex-1'><input className='rounded border border-red-500 w-full' name="age" value={formdata['age'] || ''} onChange={e => setFormData({ ...formdata, age: e.target.value })} /></div>
        </div>
        <div className=' m-2'>
          <button type='submit' className='m-2 py-2 px-4 border border-red-500 rounded'>Submit</button>
          <button type='reset' className='m-2 py-2 px-4 border border-red-500 rounded' onClick={e => setFormData({})}>Reset</button>
        </div>

        <h2>Data List</h2>
        {
          data?.map((d) => {
            return (
              <div className="flex w-[500px] h-14 justify-between">
                <div key={d._id}>name = {d.name} / age = {d.age} </div>
                <div>
                  <button type="button" className="px-4 py-2 h-10 rounded border border-red-500" onClick={e => setFormData(d)}><PencilIcon className="h-5 w-5 text-blue-500" /></button>
                  <button type="button" className="px-4 py-2 h-10 rounded border border-red-500" onClick={e => DeleteHandler(e, d._id)}><TrashIcon className="h-5 w-5 text-blue-500" /></button>
                </div>
              </div>
            )
          })
        }
      </form>

    </div>
  )
}

export default Form;
import { useState, useEffect, useRef } from 'react';
import axios from "axios";

import { PhotographIcon } from "@heroicons/react/solid";

import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './constants'
import TagField from './tagify/tagify';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

const Button = ({ type, onClick, ...props }) => {
  return <button type={type} className='m-2 py-2 px-4 border bg-neutral-100 border-neutral-300 rounded' onClick={onClick}>{props.children}</button>
}

const PostsEdit = ({ ...props }) => {

  let formVal = {};
  let setFormVal = {};

  let { id } = useParams();

  [formVal.id, setFormVal.id] = useState('');
  [formVal.tags, setFormVal.tags] = useState([]);
  [formVal.title, setFormVal.title] = useState('');
  [formVal.image, setFormVal.image] = useState('');
  [formVal.category, setFormVal.category] = useState('');
  [formVal.description, setFormVal.description] = useState('');

  const [editor, setEditor] = useState(null);

  const coverRef = useRef();
  const tagifyRef = useRef();

  const navigate = useNavigate();

  const editorChange = async (api, event) => {
    console.log('editorChange', api, event)
    await api.saver.save().then((outputData) => {
      setFormVal.description(JSON.stringify(outputData));
    }).catch((error) => {
      console.log('editor change error', error);
    });
  };

  useEffect(() => {
    editor || GetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const UpdateCover = (e) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    axios.post("/api/images/files", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      setFormVal.image(response.data.path);
      console.log(response);
    }).catch((err) => {
      console.log(err);
    });
    coverRef.current.value = '';
  }

  const GetData = async (e) => {
    try {
      const res = await axios.get("/api/mydata/post/" + id);
      console.log(res.data);
      const editorjs = new EditorJS({
        holder: "editorJS",
        autofocus: true,
        tools: EDITOR_JS_TOOLS,
        onChange: editorChange,
        data: JSON.parse(res?.data?.post?.description || "{}"),
      });
      setFormData(res.data.post);
      setEditor(editorjs);
    } catch (err) {
      console.log(err);
    }
  }

  const setFormData = (d) => {
    console.log(d);
    setFormVal.id(d._id || '');
    setFormVal.tags(d.tags || []);
    setFormVal.title(d.title || '');
    setFormVal.image(d.image || '');
    setFormVal.category(d.category || '');
    setFormVal.description(d.description || "{}");
    if (editor) {
      editor.blocks.render(JSON.parse(d.description || "{}"));
    }
  }

  const DeleteHandler = async (e, _id) => {
    e.preventDefault();
    _id = formVal.id;
    delete formVal.id;
    try {
      await axios.delete("/api/mydata/del/" + _id, {
        id: _id
      });
      navigate("/posts", { replace: true });
    } catch (err) {
      console.log('Delete Handler', err);
    }
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    toast.info("Saving ...", {
      position: toast.POSITION.TOP_RIGHT
    });
    try {
      if (formVal.id) {
        await axios.put("/api/mydata/update/" + formVal.id, {
          ...formVal
        }).then(() => {
          toast.info("Data Saved", {
            position: toast.POSITION.TOP_RIGHT
          });
        }).catch((err) => {
          toast.error("Data Save Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });;
      } else {
        await axios.post("/api/mydata/add", {
          ...formVal
        }).then(() => {
          toast.info("Data Saved", {
            position: toast.POSITION.TOP_RIGHT
          });
        }).catch((err) => {
          toast.error("Data Save Error", {
            position: toast.POSITION.TOP_RIGHT
          });
        });
      }
      navigate("/posts", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='w-full m-auto'>
      <div className='border border-slate-400 rounded'>
        <input type="hidden" name="_id" value={formVal.id} />
        <div className='relative'>
          <div className='flex items-center cursor-pointer w-fit absolute right-3 mt-[5px] z-10'>
            <TagField value={formVal.tags} tagifyRef={tagifyRef} onChange={val => setFormVal.tags(val)} />
          </div>
        </div>
        <div className='h-40 relative bg-gray-100 post-banner group'>
          <input className='hidden' ref={coverRef} type="file" onChange={UpdateCover} accept="image/*" />

          <div className="cover" style={{
            backgroundImage: formVal.image ? `url(${formVal.image})` : 'none',
          }}></div>

          <div className='cover-crtl absolute bottom-2 right-2 hidden group-hover:inline-block'>
            <div className='flex items-center cursor-pointer w-fit  bg-gray-200 p-1 text-xs rounded' onClick={e => coverRef.current.click()}>
              <PhotographIcon className='w-5 h-5' />
              Replace Cover
            </div>
          </div>
        </div>
        <div className='ce-block__content'>
          <input type="text" className='outline-none p-1 font-bold text-4xl w-full' value={formVal.title || 'No Title'} onChange={e => setFormVal.title(e.target.value)} />
        </div>
        <div id="editorJS" className="p-3"></div>
      </div>
      <div className='flex justify-between'>
        <div className='my-2'>
          <Button type='button' onClick={e => navigate(-1)}>Back</Button>
          <Button type='button' onClick={SubmitHandler}>Save</Button>
          <Button type='button' onClick={e => setFormData({})}>Reset</Button>
        </div>
        <div className='my-2'>
          <button type='reset' className='m-2 py-2 px-4 border bg-red-500 border-red-600 rounded text-white' onClick={DeleteHandler}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default PostsEdit;
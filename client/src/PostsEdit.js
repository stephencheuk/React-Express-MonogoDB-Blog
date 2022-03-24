import { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import { TrashIcon, PencilIcon } from "@heroicons/react/solid";

import EditorJS from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from './constants'
import TagField from './tagify/tagify';
import { useParams } from 'react-router-dom';

//import Editor from "rich-markdown-editor";

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

  // const [formdata, setFormData] = useState({});

  const [data, setData] = useState([]);
  const [richData, setRichData] = useState([]);
  const [editor, setEditor] = useState(null);
  const [status, setStatus] = useState("Save");

  const coverRef = useRef();
  const tagifyRef = useRef();
  //const [editorState, setEditorState] = useState(EditorState.createEmpty());


  const editorChange = async (api, event) => {
    console.log('editorChange', api, event)
    await api.saver.save().then((outputData) => {
      //setFormData({ ...formdata, description: JSON.stringify(outputData) });
      setFormVal.description(JSON.stringify(outputData));
      //console.log('Article data: ', formdata)
    }).catch((error) => {
      //console.log('Saving failed: ', error)
    });
    //console.log('editorChange dd', dd);
  };

  useEffect(() => {
    if (!editor) {
      GetData();
    }
    // GetList();
  }, []);

  // useEffect(() => {
  //   console.log('monitor editor', editor);
  //   if (editor) {
  //     GetData()
  //   }
  // }, [editor]);

  const AddCover = (e) => {
    alert(123);
    //axios
  }
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

  const GetList = async (e) => {
    try {
      const res = await axios.get("/api/mydata/list");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  const GetData = async (e) => {
    try {
      const res = await axios.get("/api/mydata/post/" + id);
      console.log(res.data);
      setEditor(new EditorJS({
        holder: "editorJS",
        autofocus: true,
        tools: EDITOR_JS_TOOLS,
        onChange: editorChange,
        // data: JSON.parse('{"time":1647597077224,"blocks":[{"id":"X1Vhp4BKmf","type":"paragraph","data":{"text":"1234567"}}],"version":"2.23.2"}')
        data: JSON.parse(res?.data?.post?.description || "{}"),
      }));
      setFormData(res.data.post);
    } catch (err) {
      console.log(err);
    }
  }

  window.GetData = GetData;

  const setFormData = (d) => {
    //setFormData(d);
    setFormVal.id(d._id || '');
    setFormVal.tags(d.tags || []);
    setFormVal.title(d.title || '');
    setFormVal.image(d.image || '');
    setFormVal.category(d.category || '');
    if (editor) {
      console.log('setFormData', JSON.parse(d.description || "{}"))
      console.log(editor);
      editor.blocks.render(JSON.parse(d.description || "{}"));
    }
  }

  const DeleteHandler = async (e, _id) => {
    e.preventDefault();
    try {
      await axios.delete("/api/mydata/del/" + _id, {
        id: _id
      });
      GetList();
    } catch (err) {
      console.log(err);
    }
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();
    console.log(formVal);
    setStatus("Saving ...");
    try {
      if (formVal.id) {
        await axios.put("/api/mydata/update/" + formVal.id, {
          ...formVal
        });
      } else {
        await axios.post("/api/mydata/add", {
          ...formVal
        });
      }
      setStatus("Done");
      setTimeout(() => setStatus("Save"), 1000)
      //setFormData({})
      //GetList();
    } catch (err) {
      console.log(err);
    }
  }

  const UpdateTags = useCallback((val) => {
    //setFormData({ ...formdata, tags: val });
    console.log('UpdateTags', val);
    setFormVal.tags(val);
  }, []);

  return (
    <div className='w-full m-auto mt-10'>
      <div className='border border-slate-400 rounded'>
        <input type="hidden" name="_id" value={formVal.id} onChange={e => setFormVal(e.target.value)} />
        <div className='relative'>
          <div className='flex items-center cursor-pointer w-fit absolute right-3 mt-[5px] z-10'>
            <TagField value={formVal.tags} tagifyRef={tagifyRef} onChange={UpdateTags} />
            { /** suggestions={suggestions} */}
          </div>
        </div>
        <div className='h-40 relative bg-gray-100 post-banner'>
          <input className='hidden' ref={coverRef} type="file" onChange={UpdateCover} accept="image/*" />

          <div className="cover" style={{
            backgroundImage: formVal.image ? `url(${formVal.image})` : 'none',
          }}></div>

        </div>
        <div className='ce-block__content header1'>
          <div className='banner-controller flex justify-between'>
            <div className='flex items-center cursor-pointer w-fit' onClick={e => coverRef.current.click()}>
              <svg viewBox="0 0 14 14" className="addPageCover" style={{ width: '14px', height: '14px', display: 'block', fill: 'rgba(55, 53, 47, 0.35)', flexShrink: 0, backfaceVisibility: 'hidden', marginRight: '6px' }}><path fillRule="evenodd" clipRule="evenodd" d="M2 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm0 12h10L8.5 5.5l-2 4-2-1.5L2 12z"></path></svg>
              Add cover
            </div>
          </div>
          <input type="text" className='outline-none p-1 font-bold text-4xl' value={/*formdata['title']*/ formVal.title || 'No Title'} onChange={e => setFormVal.title(e.target.value) /*setFormData({ ...formdata, title: e.target.value })*/} />
        </div>
        <div id="editorJS" class="p-3"></div>
      </div>
      <form onSubmit={SubmitHandler}>
        <div className='flex m-2'>
          <div className='flex-1 flex items-center'>Image:</div>
          <div className='flex-[4]'><input className='p-2 outline-none rounded border border-[#e6e6e6] w-full' name="image" value={/*formdata['image'] || ''*/ formVal.image} onChange={e => setFormVal.image(e.target.value) /*setFormData({ ...formdata, image: e.target.value })*/} /></div>
        </div>
        <div className=' m-2'>
          <button type='submit' className='m-2 py-2 px-4 border border-[#e6e6e6] rounded'>{status}</button>
          <button type='reset' className='m-2 py-2 px-4 border border-[#e6e6e6] rounded' onClick={e => setFormData({})}>Reset</button>
        </div>

        <h2>formdata 1</h2>
        {JSON.stringify(formVal, ' ', ' ')}
        <h2>Data List</h2>
        {
          data?.map((d) => {
            return (
              <div key={d._id} className="flex w-[800px] h-28 justify-between">
                <div key={d._id}>{JSON.stringify(d, ' ', ' ')}</div>
                <div className='flex'>
                  <button type="button" className="px-4 py-2 h-10 rounded border border-[#e6e6e6]" onClick={e => setFormData(d)}><PencilIcon className="h-5 w-5 text-blue-500" /></button>
                  <button type="button" className="px-4 py-2 h-10 rounded border border-[#e6e6e6]" onClick={e => DeleteHandler(e, d._id)}><TrashIcon className="h-5 w-5 text-blue-500" /></button>
                </div>
              </div>
            )
          })
        }
      </form>

    </div>
  )
}

export default PostsEdit;
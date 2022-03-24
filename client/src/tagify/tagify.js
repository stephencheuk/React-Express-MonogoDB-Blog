import Tags from "@yaireo/tagify/dist/react.tagify";

import "./tagify.css"
import "./tagify_custom.css"

import React, { useRef } from 'react'

const baseTagifySettings = {
  blacklist: [],
  //maxTags: 6,
  backspace: "edit",
  placeholder: "type something",
  editTags: 1,
  dropdown: {
    enabled: 0
  },
  callbacks: {}
};

const TagField = ({ label, name, value = [], onChange, initialValue = [], suggestions = [] }) => {

  const tagify = useRef()

  const handleChange = e => {
    if (e.type == 'edit:updated'
      || e.type == 'remove'
    ) { onChange(e.detail.tagify.value) }
    console.log(e.type, " ==> ", e.detail.tagify.value.map(item => item.value));
  };

  const settings = {
    ...baseTagifySettings,
    whitelist: suggestions,
    callbacks: {
      add: handleChange,
      remove: handleChange,
      blur: handleChange,
      edit: handleChange,
      invalid: handleChange,
      click: handleChange,
      focus: handleChange,
      "edit:updated": handleChange,
      "edit:start": handleChange
    },
    dropdown: {
      position: 'text',
      enabled: 1 // show suggestions dropdown after 1 typed character
    }
  };

  console.log("InitialValue", initialValue);

  return (
    <div className="form-group" style={{ display: 'flex', justifyContent: 'center' }}>
      <Tags
        tagifyRef={tagify}
        className="customLook"
        settings={settings}
        value={value}
      />
      <button type="button" title="Add Tag" className="AddTagBtn" onClick={e => tagify.current.addEmptyTag()}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg></button>
    </div >
  );
}

export default TagField;
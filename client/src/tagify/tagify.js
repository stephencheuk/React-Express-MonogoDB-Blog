import Tags from "@yaireo/tagify/dist/react.tagify";
import { TagIcon } from "@heroicons/react/outline";

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
    if (e.type === 'edit:updated'
      || e.type === 'remove'
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
      <button type="button" title="Add Tag" className="AddTagBtn" onClick={e => tagify.current.addEmptyTag()}><TagIcon className="w-5 h-5" /></button>
    </div >
  );
}

export default TagField;
import React, { useCallback, useEffect, useRef, useState } from 'react'

import DragSort from '@yaireo/dragsort'
import Tags from '@yaireo/tagify/dist/react.tagify'

import "./TagsInput.css";

export const serverDelay = func => duration =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(func())
    }, duration || 1000)
  )

export const getWhitelistFromServer = serverDelay(() => [
  "aaa",
  "aaa1",
  "aaa2",
  "aaa3",
  "bbb1",
  "bbb2",
  "bbb3",
  "bbb4"
])

export const getValue = serverDelay(() => ["foo", "bar", "baz"])

const TagsInput = ({ onChange, value, ...props }) => {

  const tagifyRef1 = useRef()
  const tagifyRefDragSort = useRef()

  // just a name I made up for allowing dynamic changes for tagify settings on this component
  const [tagifySettings, setTagifySettings] = useState([])
  const [tagifyProps, setTagifyProps] = useState({})

  useEffect(() => {

    console.log('TagsInput loading');

    setTagifyProps({ loading: true });

    getWhitelistFromServer(2000).then((response) => {
      setTagifyProps((lastProps) => ({
        ...lastProps,
        whitelist: response,
        showFilteredDropdown: "a",
        loading: false
      }));
    });

    // simulate setting tags value via server request
    getValue(3000).then((response) =>
      setTagifyProps((lastProps) => ({ ...lastProps, defaultValue: response }))
    );

    // simulate state change where some tags were deleted
    setTimeout(
      () =>
        setTagifyProps((lastProps) => ({
          ...lastProps,
          defaultValue: ["abc"],
          showFilteredDropdown: false
        })),
      5000
    );
  }, []);

  const baseTagifySettings = {
    blacklist: ["xxx", "yyy", "zzz"],
    maxTags: 6,
    //backspace: "edit",
    placeholder: "Tags",
    dropdown: {
      enabled: 0 // a;ways show suggestions dropdown
    }
  }

  const settings = {
    ...baseTagifySettings,
    ...tagifySettings
  }

  const _onChange = useCallback((e) => {
    onChange(e.detail.value);
  }, []);

  return (
    <Tags
      tagifyRef={tagifyRef1}
      settings={settings}
      defaultValue=""
      value={value}
      autoFocus={true}
      {...tagifyProps}
      onChange={_onChange}
      onEditInput={() => console.log("onEditInput")}
      onEditBeforeUpdate={() => console.log`onEditBeforeUpdate`}
      onEditUpdated={() => console.log("onEditUpdated")}
      onEditStart={() => console.log("onEditStart")}
      onEditKeydown={() => console.log("onEditKeydown")}
      onDropdownShow={() => console.log("onDropdownShow")}
      onDropdownHide={() => console.log("onDropdownHide")}
      onDropdownSelect={() => console.log("onDropdownSelect")}
      onDropdownScroll={() => console.log("onDropdownScroll")}
      onDropdownNoMatch={() => console.log("onDropdownNoMatch")}
      onDropdownUpdated={() => console.log("onDropdownUpdated")}
    />

  )
}

export default TagsInput
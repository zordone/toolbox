import React, { useState } from "react";
import { noop, preventDefault } from "../../utils";
import BasicField from "./BasicField";

const FileField = ({
  name,
  placeholder = "Drop a file or URL here",
  setName = noop,
  content,
  setContent = noop,
  allowTypes = [],
  ...props
}) => {
  const [isDropOk, setIsDropOk] = useState();

  const getUrl = (event) => event.dataTransfer.getData("URL");

  const getItem = (event) => {
    const items = [...event.dataTransfer.items].filter((item) => {
      const isFile =
        item.kind === "file" &&
        (allowTypes.length === 0 || allowTypes.includes(item.type));
      const isUrl = item.kind === "string" && item.type === "text/uri-list";
      return isFile || isUrl;
    });
    return items[0];
  };

  const getFile = (event) => {
    const files = [...event.dataTransfer.files].filter(
      (file) => allowTypes.length === 0 || allowTypes.includes(file.type)
    );
    return files[0];
  };

  return (
    <BasicField
      {...props}
      state={name}
      type="text"
      placeholder={placeholder}
      readOnly
      fullWidth
      isDropOk={isDropOk}
      onDragOver={preventDefault}
      onDragEnter={(event) => {
        preventDefault(event);
        setIsDropOk(!!getItem(event));
      }}
      onDragLeave={(event) => {
        preventDefault(event);
        setIsDropOk(undefined);
      }}
      onDrop={(event) => {
        preventDefault(event);
        setIsDropOk(undefined);
        // url?
        const url = getUrl(event);
        if (url) {
          fetch(url)
            .then((res) => res.text())
            .then((content) => {
              setName(url);
              setContent(content);
            })
            .catch(console.error);
          return;
        }
        // file?
        const file = getFile(event);
        if (file) {
          file
            .text()
            .then((content) => {
              setName(file.name);
              setContent(content);
            })
            .catch(console.error);
          return;
        }
        // other
        console.warn("Unknown drop", event.dataTransfer);
      }}
    />
  );
};

export default FileField;

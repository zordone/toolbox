import React, { ComponentProps, DragEvent, FC, useState } from "react";
import { noop, preventDefault } from "../utils";
import BasicField from "./BasicField";

interface FileFieldProps extends ComponentProps<typeof BasicField> {
  allowTypes: string[];
  setContent: (content: string) => void;
  setName: (name: string) => void;
}

const FileField: FC<FileFieldProps> = ({
  allowTypes = [],
  name,
  placeholder = "Drop a file or URL here",
  setContent = noop,
  setName = noop,
  ...rest
}) => {
  const [isDropOk, setIsDropOk] = useState<boolean>();

  const getUrl = (event: DragEvent<HTMLInputElement>) =>
    event.dataTransfer.getData("URL");

  const getItem = (event: DragEvent<HTMLInputElement>) => {
    const items = [...event.dataTransfer.items].filter((item) => {
      const isFile =
        item.kind === "file" &&
        (allowTypes.length === 0 || allowTypes.includes(item.type));
      const isUrl = item.kind === "string" && item.type === "text/uri-list";
      return isFile || isUrl;
    });
    return items[0];
  };

  const getFile = (event: DragEvent<HTMLInputElement>) => {
    const files = [...event.dataTransfer.files].filter(
      (file) => allowTypes.length === 0 || allowTypes.includes(file.type)
    );
    return files[0];
  };

  return (
    <BasicField
      {...rest}
      fullWidth
      isDropOk={isDropOk}
      placeholder={placeholder}
      readOnly
      state={name}
      type="text"
      onDragEnter={(event) => {
        preventDefault(event);
        setIsDropOk(!!getItem(event));
      }}
      onDragLeave={(event) => {
        preventDefault(event);
        setIsDropOk(undefined);
      }}
      onDragOver={preventDefault}
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

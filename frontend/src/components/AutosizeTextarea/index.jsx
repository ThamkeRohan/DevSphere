import React, { useRef } from "react";
import useAutosizeTextarea from "../../hooks/useAutosizeTextarea";

export default function AutosizeTextarea({
  value,
  setValue,
  placeholder,
  styles,
}) {
  const textareaRef = useRef(null);
  useAutosizeTextarea(textareaRef, value)
  return (
    <textarea
      ref={textareaRef}
      className={styles}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    ></textarea>
  );
}

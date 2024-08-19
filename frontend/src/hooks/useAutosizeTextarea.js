import React, { useEffect } from "react";

export default function useAutosizeTextarea(textareaRef, value) {
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;

      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [value, textareaRef]); 
}

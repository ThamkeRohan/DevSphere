import React, { forwardRef } from "react";
import useAutosizeTextarea from "../../hooks/useAutosizeTextarea";

const AutosizeTextareaWithRefForwarding = forwardRef((props, ref) => {
  const { value, setValue, styles, placeholder } = props;
  useAutosizeTextarea(ref, value);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles}
      placeholder={placeholder}
    ></textarea>
  );
});

export default AutosizeTextareaWithRefForwarding;

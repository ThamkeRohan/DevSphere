import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../../services/uploadImage";
import {useAsyncFn} from "../../hooks/useAsync"
import Toast from "../../components/Toast"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faImage} from "@fortawesome/free-regular-svg-icons"
import {faBold, faItalic, faLink, faList as faUnorderedList, faListOl as faOrderedList, faHeading, faCode} from "@fortawesome/free-solid-svg-icons"
import AutosizeTextareaWithRefForwarding from "../AutosizeTextareaWithRefForwarding";

const UPLOAD_PRESET = "mz03rpce";

function MarkdownEditor({markdown, setMarkdown}) {
    const textareaRef = useRef()
    const [cursorPos, setCursorPos] = useState(0)
    const uploadImageFn = useAsyncFn(uploadImage)
    useEffect(() => {
        textareaRef.current.focus()
        textareaRef.current.selectionEnd = cursorPos
    }, [cursorPos])

    function addPattern(position, pattern) {
      const a = markdown.substring(0, textareaRef.current.selectionEnd);
      const b = markdown.substring(textareaRef.current.selectionEnd);
      setMarkdown(`${a}${pattern}${b}`);
      if (position === "CENTER") {
        setCursorPos(
          textareaRef.current.selectionEnd +
           pattern.length / 2
        );
      } else {
        setCursorPos(
          textareaRef.current.selectionEnd +
            pattern.length
        );
      }
    }
    function handleUploadImage(e) {
      console.log(e.target)
      const imageData = new FormData()
      imageData.append("file", e.target.files[0])
      imageData.append("upload_preset", UPLOAD_PRESET)
      uploadImageFn.execute({ imageData }).then((data) => {
        addPattern("END", `![Image description](${data.secure_url})`);
      });
    }
    function handleClick(e) {
      addPattern(e.currentTarget.dataset.position, e.currentTarget.dataset.pattern);
    }
    
    
    return (
      <div className="markdown-editor">
        <ul className="editor-toolbar">
          <button className="btn icon-btn" type="button" data-position="CENTER" data-pattern="****" onClick={handleClick}>
            <FontAwesomeIcon icon={faBold}/>
          </button>
          <button className="btn icon-btn" type="button" data-position="CENTER" data-pattern="**" onClick={handleClick}>
            <FontAwesomeIcon icon={faItalic}/>
          </button>
          <button className="btn icon-btn" type="button" data-position="END" data-pattern="[](url)" onClick={handleClick}>
            <FontAwesomeIcon icon={faLink}/>
          </button>
          <button className="btn icon-btn" type="button" data-position="END" data-pattern="1. " onClick={handleClick}>
            <FontAwesomeIcon icon={faOrderedList} />
          </button>
          <button className="btn icon-btn" type="button" data-position="END" data-pattern="- " onClick={handleClick}>
            <FontAwesomeIcon icon={faUnorderedList} />
          </button>
          <button className="btn icon-btn" type="button" data-position="END" data-pattern="## " onClick={handleClick}>
            <FontAwesomeIcon icon={faHeading}/>
          </button>
          <button className="btn icon-btn" type="button" data-position="CENTER" data-pattern="``" onClick={handleClick}>
            <FontAwesomeIcon icon={faCode}/>
          </button>
          <button className="btn icon-btn" type="button" data-position="CENTER" data-pattern="```&#13;&#13;```" onClick={handleClick}>
            <FontAwesomeIcon icon={faCode} className="code-block"/>
          </button>
          <span>
            <label className="btn icon-btn" htmlFor="upload-image"><FontAwesomeIcon icon={faImage} /></label>
            <input id="upload-image" type="file" onChange={handleUploadImage} disabled={uploadImageFn.loading}/>
            {uploadImageFn.error && <Toast type="error" message={uploadImageFn.error} isClosable onClose={uploadImageFn.clearError}/>}
          </span>
          
        </ul>
        <AutosizeTextareaWithRefForwarding
          styles="text-md"
          placeholder="Post content here..."
          value={markdown}
          setValue={setMarkdown}
          ref={textareaRef}
        />
      </div>
    );
}

export default MarkdownEditor
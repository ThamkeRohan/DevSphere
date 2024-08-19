import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { forwardRef } from "react"
import Modal from "../Modal"
import Toast from "../Toast"

const CommentForm = forwardRef(function CommentForm({initialContent = "", onSubmit, loading, error, closeError, autoFocus}, ref) {
    const [content, setContent] = useState(initialContent)
    const [isOpen, setIsOpen] = useState(false)
    const loggedInUser = useAuth()
    function handleSubmit(e) {
        e.preventDefault()
        onSubmit(content).then(() => setContent(""))
    }
    function handleFocus() {
        if(loggedInUser == null) {
            setIsOpen(true)
        }
    }
    return (
      <>
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            ref={ref}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus={autoFocus}
            onFocus={handleFocus}
          ></textarea>
          <button className="btn btn-submit" disabled={content.length === 0 || loading}>Submit</button>
          {error && <Toast type="error" message={error} isClosable onClose={closeError}/>}
        </form>
        {isOpen && <Modal onClose={() => setIsOpen(false)} />}
      </>
    );
})

export default CommentForm
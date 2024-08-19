import { useState } from "react";
import { useAsyncFn } from "../../hooks/useAsync";
import MultiSelect from "../MultiSelect/index";
import MarkdownEditor from "./MarkdownEditor";
import { uploadImage } from "../../services/uploadImage";
import Post from "../Post";
import { useAuth } from "../../contexts/AuthContext";
import { POST_FORM_MESSAGES } from "../../constants/formMessages";
import Toast from "../Toast";
import AutosizeTextarea from "../AutosizeTextarea";

function PostForm({
  initialTitle = "",
  initialCoverImageUrl = "",
  initialDescription = "",
  initialSelectedTags = [],
  initialMarkdown = "",
  createdAt = Date.now().toString(),
  onSubmit,
  loading,
  error,
  closeError,
}) {
  const [showPreview, setShowPreview] = useState(false);
  const loggedInUser = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [coverImageUrl, setCoverImageUrl] = useState(initialCoverImageUrl);
  const [description, setDescription] = useState(initialDescription);
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [emptyFields, setEmptyFields] = useState([]);
  const uploadImageFn = useAsyncFn(uploadImage);

  function onCoverImageUpload(e) {
    if (e.target.files == null || e.target.files.length === 0) {
      setCoverImageUrl(null);
      return;
    }
    const imageData = new FormData();
    imageData.append("file", e.target.files[0]);
    imageData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    uploadImageFn
      .execute({ imageData })
      .then((data) => setCoverImageUrl(data.secure_url));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const blankFields = [];
    if (title.trim().length === 0) {
      blankFields.push("title");
    }
    if (coverImageUrl.trim().length === 0) {
      blankFields.push("coverImageUrl");
    }
    if (selectedTags.length === 0) {
      blankFields.push("selectedTags");
    }
    if (description.trim().length === 0) {
      blankFields.push("description");
    }
    if (markdown.trim().length === 0) {
      blankFields.push("markdown");
    }

    if (blankFields.length === 0) {
      onSubmit({
        title,
        coverImageUrl,
        tags: selectedTags,
        description,
        content: markdown,
      });
    } else {
      setEmptyFields(blankFields);
    }
  }

  return (
    <div className="post-form">
      <div className="head">
        <div className="nav">
          <button
            className={`text-normal-bold ${!showPreview ? "active" : ""}`}
            type="button"
            onClick={() => setShowPreview(false)}
          >
            Edit
          </button>
          <button
            className={`text-normal-bold ${showPreview ? "active" : ""}`}
            type="button"
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
        </div>
        {error && (
          <Toast type="error" message={error} isClosable onClose={closeError} />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {showPreview ? (
          <Post
            coverImageUrl={coverImageUrl}
            author={loggedInUser}
            title={title}
            tags={selectedTags}
            content={markdown}
            createdAt={createdAt}
          />
        ) : (
          <div className="form-box">
            <div className="cover-image-preview">
              {coverImageUrl && <img src={coverImageUrl} alt="cover-image" />}
            </div>
            <div className="entry">
              <label className="post-cover-img" htmlFor="post-cover-img">
                Add a cover image
              </label>
              <input
                id="post-cover-img"
                className="post-cover-img"
                type="file"
                onChange={onCoverImageUpload}
                disabled={uploadImageFn.loading}
              />
              {emptyFields.includes("coverImageUrl") && (
                <div className="validation-message text-sm">
                  {POST_FORM_MESSAGES.coverImageUrl}
                </div>
              )}
              {uploadImageFn.error && (
                <Toast
                  type="error"
                  message={uploadImageFn.error}
                  isClosable
                  onClose={uploadImageFn.clearError}
                />
              )}
            </div>

            <div className="entry">
              <AutosizeTextarea
                styles="post-title text-xl-bold"
                placeholder="Post title here..."
                value={title}
                setValue={setTitle}
              />
              {emptyFields.includes("title") && (
                <div className="validation-message text-sm">
                  {POST_FORM_MESSAGES.title}
                </div>
              )}
            </div>
            <div className="entry">
              <AutosizeTextarea
                styles="post-description text-md"
                placeholder="Post description here..."
                value={description}
                setValue={setDescription}
              />
              {emptyFields.includes("description") && (
                <div className="validation-message text-sm">
                  {POST_FORM_MESSAGES.description}
                </div>
              )}
            </div>
            <div className="entry">
              <MultiSelect
                isCreatable
                selectedOptions={selectedTags}
                setSelectedOptions={setSelectedTags}
                placeholder="Add tags..."
              />
              {emptyFields.includes("selectedTags") && (
                <div className="validation-message text-sm">
                  {POST_FORM_MESSAGES.selectedTags}
                </div>
              )}
            </div>
            <div className="entry">
              <MarkdownEditor markdown={markdown} setMarkdown={setMarkdown} />
              {emptyFields.includes("markdown") && (
                <div className="validation-message text-sm">
                  {POST_FORM_MESSAGES.markdown}
                </div>
              )}
            </div>
          </div>
        )}
        <button className="btn btn-submit" disabled={loading}>
          Save
        </button>
      </form>
    </div>
  );
}

export default PostForm;

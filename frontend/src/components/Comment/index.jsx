import { useState } from "react"
import CommentForm  from "./CommentForm"
import { IconButton } from "../IconButton/index"
import { useAsyncFn } from "../../hooks/useAsync"
import { createComment, deleteComment, editComment, toggleCommentLike } from "../../services/comment"
import { CommentsStack } from "./CommetsStack"
import { useAuth } from "../../contexts/AuthContext"
import Modal from "../Modal"
import { usePostUpdate } from "../../pages/ViewPost/PostContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart as faHeart,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons"


export default function Comment({_id, content, madeBy, createdAt, post, likedByMe, likeCount}) {
    const {createLocalComment, editLocalComment, deleteLocalComment, toggleLocalCommentLike, getReplies} = usePostUpdate()
    const loggedInUser = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [areChildrenVisible, setAreChildrenVisible] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const createCommentFn = useAsyncFn(createComment)
    const editCommentFn = useAsyncFn(editComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    const toggleCommentLikeFn = useAsyncFn(toggleCommentLike)
    const childComments = getReplies(_id)

    function onCommentReply(content) {
      return createCommentFn
          .execute({
            content,
            post,
            madeBy: {
              _id: loggedInUser._id,
              name: loggedInUser.name,
              profileImageUrl: loggedInUser.profileImageUrl,
            },
            parent: _id,
          })
          .then((comment) => {
            setIsReplying(false);
            createLocalComment(comment);
          });
    }
    function onCommentEdit(content) {
        return editCommentFn.execute({
            postId: post,
            commentId: _id,
            content
        })
        .then(comment => {
            setIsEditing(false)
            editLocalComment(comment._id, comment.content)
        })
    }
    function onCommentDelete() {
        return deleteCommentFn.execute({
            postId: post,
            commentId: _id
        })
        .then(comment => deleteLocalComment(comment._id))
    }
    function onToggleCommentLike() {
        if(loggedInUser == null) {
          setIsOpen(true)
          return
        }
        return toggleCommentLikeFn.execute({
            postId: post,
            commentId: _id
        })
        .then(comment => toggleLocalCommentLike(_id, comment.likedByMe))
    }
    return (
      <div className="comment card">
        <div className="main">
          <div className="header">
            <span className="profile-image">
              <img src={madeBy.profileImageUrl} alt="profile-image" />
            </span>
            <span className="made-by">
              <div className="name text-sm-bold">{madeBy.name}</div>
              <div className="created-at text-sm">{createdAt}</div>
            </span>
          </div>
          {isEditing ? (
            <CommentForm
              initialContent={content}
              loading={editComment.loading}
              error={editComment.error}
              onSubmit={onCommentEdit}
              autoFocus
            />
          ) : (
            <div className="content">{content}</div>
          )}
          <div className="footer">
            <IconButton
              styles="comment-btn"
              icon={
                likedByMe ? (
                  <FontAwesomeIcon icon={faHeartFilled} />
                ) : (
                  <FontAwesomeIcon icon={faHeart} />
                )
              }
              ariaLabel={likedByMe ? "Unlike" : "Like"}
              isDisabled={
                toggleCommentLikeFn.loading || loggedInUser._id === madeBy._id
              }
              onClick={onToggleCommentLike}
            >
              {likeCount}
            </IconButton>

            <IconButton
              styles="comment-btn"
              icon={<FontAwesomeIcon icon={faComment} />}
              isActive={isReplying}
              onClick={() => {
                if (loggedInUser == null) {
                  setIsOpen(true);
                  return;
                }
                setIsReplying((prev) => !prev);
              }}
              ariaLabel={isReplying ? "Cancel Reply" : "Reply"}
            />
            {loggedInUser != null && loggedInUser._id === madeBy._id && (
              <>
                <IconButton
                  styles="comment-btn"
                  icon={<FontAwesomeIcon icon={faPenToSquare} />}
                  isActive={isEditing}
                  onClick={() => setIsEditing((prev) => !prev)}
                  ariaLabel={isEditing ? "Cancel Edit" : "Edit"}
                />
                <IconButton
                  styles="comment-btn"
                  icon={<FontAwesomeIcon icon={faTrashCan} />}
                  onClick={onCommentDelete}
                  ariaLabel="Delete"
                  isDisabled={deleteCommentFn.loading}
                />
              </>
            )}
          </div>
        </div>
        {isReplying && (
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        )}
        {areChildrenVisible && childComments?.length > 0 && (
          <div className="comments-stack-container">
            <button
              className="collapse-line"
              onClick={() => setAreChildrenVisible(false)}
            ></button>
            <CommentsStack comments={childComments} />
          </div>
        )}
        {!areChildrenVisible && childComments?.length > 0 && (
          <button
            className="btn show-reply-btn"
            onClick={() => setAreChildrenVisible(true)}
          >
            Show replies
          </button>
        )}
        {isOpen && <Modal onClose={() => setIsOpen(false)} />}
      </div>
    );
}
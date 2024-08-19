import React, { useState, useRef, useEffect } from 'react'
import { usePost, usePostUpdate } from './PostContext'
import { IconButton } from '../../components/IconButton'
import { useAsyncFn } from '../../hooks/useAsync'
import { togglePostLike } from '../../services/post'
import CommentForm from '../../components/Comment/CommentForm'
import { createComment } from '../../services/comment'
import { CommentsStack } from '../../components/Comment/CommetsStack'
import {useAuth} from "../../contexts/AuthContext"
import Post from '../../components/Post'
import Modal from '../../components/Modal'
import { useLocation } from 'react-router-dom'
import Toast from '../../components/Toast'
import { useNavigate } from 'react-router-dom'
import { deletePost } from '../../services/post'
import { togglePostBookmark } from '../../services/user'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart,
  faComment,
  faBookmark,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartFilled, faBookmark as faBookmarkFilled } from '@fortawesome/free-solid-svg-icons'


export default function ViewPost() {
  const loggedInUser = useAuth()
  const {post, rootComments} = usePost()
  const {toggleLocalPostLike, toggleLocalPostBookmark, createLocalComment} = usePostUpdate()
  const [isOpen, setIsOpen] = useState(false)
  const togglePostLikeFn = useAsyncFn(togglePostLike)
  const createCommentFn = useAsyncFn(createComment)
  const deletePostFn = useAsyncFn(deletePost)
  const togglePostBookmarkFn = useAsyncFn(togglePostBookmark)
  const commentFormRef = useRef()
  const {state} = useLocation()
  const navigate = useNavigate()
  
  function onTogglePostLike() {
    if(loggedInUser == null) {
      setIsOpen(true)
      return
    }
    togglePostLikeFn.execute({postId: post._id})
    .then(post => toggleLocalPostLike(post.likedByMe))
  }
  function onCreateComment(content) {
    return createCommentFn
      .execute({
        content,
        post: post._id,
        madeBy: {
          _id: loggedInUser._id,
          name: loggedInUser.name,
          profileImageUrl: loggedInUser.profileImageUrl,
        },
        parent: null,
      })
      .then((comment) => createLocalComment(comment));
  }
  function onDeletePost() {
    deletePostFn.execute({postId: post._id})
    .then(() => navigate("/", {replace: true}))
  }
  function onTogglePostBookmark() {
    if(loggedInUser == null) {
      setIsOpen(true)
      return
    }
    togglePostBookmarkFn.execute({userId: loggedInUser._id, postId: post._id})
    .then(res => toggleLocalPostBookmark(res.bookmarkedByMe))
  }

  
  return (
    <div className="view-post">
      {state?.message && <Toast type="success" message={state.message} />}
      <div className="post-btns-container">
        <IconButton
          styles="post-btn"
          icon={
            post.likedByMe ? (
              <FontAwesomeIcon icon={faHeartFilled} />
            ) : (
              <FontAwesomeIcon icon={faHeart} />
            )
          }
          onClick={onTogglePostLike}
          isDisabled={
            togglePostLikeFn.loading || loggedInUser._id === post.author._id
          }
          error={togglePostLikeFn.error}
          closeError={togglePostLikeFn.clearError}
        >
          {post.likeCount}
        </IconButton>

        <IconButton
          styles="post-btn"
          icon={<FontAwesomeIcon icon={faComment} />}
          onClick={() => commentFormRef.current.focus()}
        />
        <IconButton
          styles="post-btn"
          icon={
            post.bookmarkedByMe ? (
              <FontAwesomeIcon icon={faBookmarkFilled} />
            ) : (
              <FontAwesomeIcon icon={faBookmark} />
            )
          }
          onClick={onTogglePostBookmark}
          isDisabled={togglePostBookmarkFn.loading}
          error={togglePostBookmarkFn.error}
          closeError={togglePostBookmarkFn.clearError}
        >
          {post.bookmarkedByUsersCount}
        </IconButton>

        {loggedInUser != null && loggedInUser._id === post.author._id && (
          <>
            <IconButton
              styles="post-btn"
              icon={<FontAwesomeIcon icon={faPenToSquare} />}
              onClick={() => navigate(`/posts/${post._id}/edit`)}
            />
            <IconButton
              styles="post-btn"
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              onClick={onDeletePost}
              isDisabled={deletePostFn.loading}
              error={deletePostFn.error}
              closeError={deletePostFn.clearError}
            />
          </>
        )}
      </div>
      <section className="post-section">
        <Post {...post} />
      </section>
      <section className="comments-section container-md">
        <h3 className="text-xl-bold">Comments</h3>
        <div>
          <CommentForm
            onSubmit={onCreateComment}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
            closeError={createCommentFn.clearError}
            ref={commentFormRef}
          />
          {rootComments?.length > 0 && (
            <CommentsStack comments={rootComments} />
          )}
        </div>
      </section>
      {isOpen && <Modal onClose={() => setIsOpen(false)} />}
    </div>
  );
}

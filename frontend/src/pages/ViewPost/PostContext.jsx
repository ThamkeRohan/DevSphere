import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPost } from '../../services/post'
import { useAsync } from '../../hooks/useAsync'
import PageLoading from '../../components/PageLoading'
import Error from '../../components/Error'

const PostContext = React.createContext()
const PostUpdateContext = React.createContext()

export function usePost() {
    return useContext(PostContext)
}
export function usePostUpdate() {
    return useContext(PostUpdateContext)
}
export function PostProvider({ children }) {
    const {postId} = useParams()
    const {loading, error, value: post, updateValue: setPost, refresh} = useAsync(() => getPost({postId}), [postId])
    const commentsByParentId = useMemo(() => {
      const relationshipMap = new Map();
      post?.comments?.forEach((comment) => {
        if (relationshipMap.get(comment.parent) == null) {
          relationshipMap.set(comment.parent, []);
        }
        relationshipMap.set(comment.parent, [
          ...relationshipMap.get(comment.parent),
          comment,
        ]);
      });
      return relationshipMap;
    }, [post?.comments]);

    function getReplies(parent) {
      return commentsByParentId.get(parent);
    }
    function createLocalComment(comment) {
      setPost(prevPost => ({...prevPost, comments: [...prevPost.comments, comment]}))
    }
    function editLocalComment(id, content) {
      setPost(prevPost => ({...prevPost, comments: prevPost.comments.map(comment => {
        if(comment._id === id) {
          return {...comment, content}
        }
        else {
          return comment
        }
      })}))
    }
    function deleteLocalComment(id) {
      setPost(prevPost => ({...prevPost, comments: prevPost.comments.filter(comment => comment._id !== id)}))
    }
    function toggleLocalCommentLike(id, likedByMe) {
      setPost(prevPost => ({...prevPost, comments: prevPost.comments.map(comment => {
        if(comment._id === id) {
          if(likedByMe) {
            return {...comment, likedByMe, likeCount: comment.likeCount + 1}
          }
          else {
            return {...comment, likedByMe, likeCount: comment.likeCount - 1}
          }
        }
        else {
          return comment
        }
      })}))
    }
    function toggleLocalPostLike(likedByMe) {
        setPost(prevPost => {
            if(likedByMe) {
                return {...prevPost, likedByMe, likeCount: prevPost.likeCount + 1}
            }
            else {
                return {...prevPost, likedByMe, likeCount: prevPost.likeCount - 1}
            }
        })
    }
    function toggleLocalPostBookmark(bookmarkedByMe) {
        setPost((prevPost) => {
            if(bookmarkedByMe) {
                return { ...prevPost, bookmarkedByMe, bookmarkedByUsersCount: prevPost.bookmarkedByUsersCount + 1 };
            }
            else {
                return { ...prevPost, bookmarkedByMe, bookmarkedByUsersCount: prevPost.bookmarkedByUsersCount - 1 };
            }
        })
    }
   console.log(post);
  return (
    <PostContext.Provider
      value={{
        post,
        rootComments: getReplies(null),
      }}
    >
      <PostUpdateContext.Provider
        value={{
          toggleLocalPostLike,
          toggleLocalPostBookmark,
          getReplies,
          createLocalComment,
          editLocalComment,
          deleteLocalComment,
          toggleLocalCommentLike,
        }}
      >
        {loading ? (
          <PageLoading />
        ) : error ? (
          <Error message={error} onRefresh={refresh} />
        ) : (
          children
        )}
      </PostUpdateContext.Provider>
    </PostContext.Provider>
  );
}

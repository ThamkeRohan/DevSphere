import React from 'react'
import { useAsync } from '../../hooks/useAsync'
import { getBookmarkedPosts } from '../../services/user'
import { useAuth } from '../../contexts/AuthContext'
import PageLoading from '../../components/PageLoading'
import Error from "../../components/Error"
import PostCard from '../../components/PostCard'

export default function BookmarkedPosts() {
    const loggedInUser = useAuth()
    const {loading, error, value: posts} = useAsync(() => getBookmarkedPosts({userId: loggedInUser._id}), [loggedInUser._id])

    if(loading) {
        return <PageLoading/>
    }
    if(error) {
        return <Error message={error}/>
    }
  return (
    <div className='bookmarked-post container-lg'>
      <h1 className='page-heading'>Bookmarked posts</h1>
      {posts?.map(post => <PostCard key={post._id} post={post}/>)}
    </div>
  )
}

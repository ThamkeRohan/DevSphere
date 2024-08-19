import { makeRequest } from "./makeRequest";

export function getPosts({page, limit, selectedTags}) {
    return makeRequest("posts", {
        method: "GET",
        params: {
            page,
            limit,
            selectedTags
        }
    })
}

export function getPost({postId}) {
    return makeRequest(`posts/${postId}`, {
        method: "GET"
    })
}

export function togglePostLike({postId}) {
    return makeRequest(`posts/${postId}/toggleLike`, {
        method: "PATCH",
    })
}

export function createPost({ title, coverImageUrl, tags, content, description, author }) {
    
    return makeRequest('posts', {
        method: "POST",
        data: {
            title,
            coverImageUrl,
            tags,
            content, 
            description,
            author
        }
    })
}

export function editPost({ _id, title, coverImageUrl, tags, content, description, author }) {
    return makeRequest(`posts/${_id}`, {
        method: "PUT",
        data: {
            title,
            coverImageUrl,
            tags,
            content, 
            description,
            author
        }
    })
}

export function deletePost({postId}) {
    return makeRequest(`posts/${postId}`, {
        method: "DELETE"
    })
}
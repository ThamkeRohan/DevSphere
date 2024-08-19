import { makeRequest } from "./makeRequest";

export function getComments({postId}) {
    return makeRequest(`posts/${postId}/comments`, {
        method: "GET"
    })
}

export function createComment(comment) {
    return makeRequest(`posts/${comment.post}/comments`, {
        method: "POST",
        data: comment
    })
}

export function editComment({postId, commentId, content}) {
    return makeRequest(`posts/${postId}/comments/${commentId}`, {
        method: "PATCH",
        data: {content}
    })
}

export function deleteComment({postId, commentId}) {
    return makeRequest(`posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
    })
}

export function toggleCommentLike({postId, commentId}) {
    return makeRequest(`posts/${postId}/comments/${commentId}/toggleLike`, {
        method: "PATCH"
    })
}
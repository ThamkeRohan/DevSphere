import { makeRequest } from "./makeRequest";

export function getAuthUserProfile() {
  return makeRequest("users/authUserProfile", {
    method: "GET",
  });
}

export function getUserProfile({userId}) {
  return makeRequest(`users/${userId}`, {
    method: "GET"
  })
}

export function editUserProfile({userId, userProfile}) {
  return makeRequest(`users/${userId}`, {
    method: "PATCH",
    data: userProfile
  })
}

export function getSuggestedFollows({selectedTags}) {
  return makeRequest(`users/suggestedFollows?selectedTags=${selectedTags}`, {
    method: "GET"
  });
}

export function setFollowedTags({userId, followedTags}) {
  return makeRequest(`users/${userId}/setFollowedTags`, {
    method: "PATCH",
    data: {
      followedTags
    }
  })
}

export function toggleUserFollow({userId}) {
  return makeRequest(`users/${userId}/toggleUserFollow`, {
    method: "PATCH"
  })
}

export function getUserPosts({userId, page, limit}) {
  return makeRequest(`users/${userId}/posts?page=${page}&limit=${limit}`, {
    method: "GET"
  })
}

export function getUserComments({userId, page, limit}) {
  return makeRequest(`users/${userId}/comments?page=${page}&limit=${limit}`, {
    method: "GET"
  })
}

export function getBookmarkedPosts({userId}) {
  return makeRequest(`users/${userId}/bookmarkedPosts`, {
    method: "GET"
  })
}

export function togglePostBookmark({userId, postId}) {
  return makeRequest(`users/${userId}/togglePostBookmark`, {
    method: "PATCH",
    data: {postId}
  })
}

export function getRecommendedPosts({ userId, page, limit }) {
  return makeRequest(`users/${userId}/recommendedPosts`, {
    method: "GET",
    params: {
      page,
      limit,
    },
  });
}

export function getUserFollowedTags({ userId }) {
  return makeRequest(`users/${userId}/followedTags`, {
    method: "GET",
  });
}

export function getUserFollowers({userId}) {
  return makeRequest(`users/${userId}/followers`, {
    method: "GET"
  })
}

export function getUserFollowings({ userId }) {
  return makeRequest(`users/${userId}/followings`, {
    method: "GET",
  });
}

export function toggleTagFollow({userId, tagId}) {
  return makeRequest(`users/${userId}/toggleTagFollow`, {
    method: "PATCH",
    data: {tagId}
  })
}
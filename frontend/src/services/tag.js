import { makeRequest } from "./makeRequest"

export function getPopularTags() {
    return makeRequest("tags/popularTags", {
        method: "GET"
    })
}

export function getTags({search}) {
    return makeRequest(`tags?search=${search}`, {
        method: "GET"
    })
}


export function createTag({name}) {
    return makeRequest("tags", {
        method: "POST",
        data: {name}
    })
}


import { useEffect, useState } from "react";

export function useDebounce(search, delay) {
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), delay)
        return () => clearTimeout(handler)
    }, [search, delay])
    return debouncedSearch
}
import { useEffect, useState } from "react";

export function usePagination(service, pageSize, search) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [pages, setPages] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    

    useEffect(() => {
      console.log('second');
      setLoading(true);
      setError(false);
      service(pageNum, pageSize, search)
        .then((currentPage) => {
          setPages((prevPages) => [...prevPages, ...currentPage]);
          setHasMore(currentPage.length > 0);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => setLoading(false));
    }, [pageNum, search]);

    function next() {
        setPageNum(prevPageNum => prevPageNum + 1)
    }
    function reset() {
        setPages([])
        setPageNum(1)
    }

    return {loading, error, pages, hasMore, next, reset}
}
import { useCallback, useEffect, useState } from "react"

export function useAsync(func, dependencies=[]) {
    const {execute, ...state} = useAsyncInternal(func, dependencies, true)
    useEffect(() => {
        execute()
    }, [execute])
    return state
}

export function useAsyncFn(func, dependencies = []) {
    return useAsyncInternal(func, dependencies, false)
}

function useAsyncInternal(func, dependencies, initialLoading) {
    const [loading, setLoading] = useState(initialLoading)
    const [error, setError] = useState()
    const [value, setValue] = useState()
    const execute = useCallback((options) => {
        console.log(options);
        setLoading(true)
        return func(options)
        .then(data => {
            setValue(data);
            setError(null)
            return data
        })
        .catch(error => {
            setError(error)
            setValue(null)
            return Promise.reject(error)
        })
        .finally(() => {
            setLoading(false)
        })
    }, dependencies)
    function updateValue(newValue) {
      setValue(newValue);
    }
    function clearError() {
      setError(null);
    }
    function refresh() {
        execute()
    }

    return { loading, error, value, execute, clearError, updateValue, refresh };
}
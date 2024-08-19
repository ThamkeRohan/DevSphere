import { useEffect, useMemo, useState, useRef } from "react"
import { useDebounce } from "./useDebounce"
import {useAsync, useAsyncFn} from "../../hooks/useAsync"
import { createTag, getPopularTags, getTags } from "../../services/tag"
import Toast from "../../components/Toast"
import ActionLoading from "../ActionLoading"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmark} from "@fortawesome/free-solid-svg-icons"

function MultiSelect({selectedOptions, setSelectedOptions, placeholder, isCreatable}) {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 500)
    const [options, setOptions] = useState([])
    const {loading: getDefaultOptionsLoading, error: getDefaultOptionsError, value: defaultOptions, clearError: getDefaultOptionsClearError} = useAsync(getPopularTags, [])
    const getTagsFn = useAsyncFn(getTags)
    const createTagFn = useAsyncFn(createTag)
    const [showUnselectedOptions, setShowUnselectedOptions] = useState(false)
    const multiSelectRef = useRef(null)
    
    const unselectedOptions = useMemo(() => {
        return options?.filter(option => !selectedOptions.some(selectedOption => selectedOption._id === option._id))
    }, [options, selectedOptions])
    const createNewOptionCondition =
      isCreatable &&
      search === debouncedSearch &&
      debouncedSearch !== "" &&
      !getTagsFn.loading &&
      !getTagsFn.error &&
      !options.some((option) => option.name.toLowerCase() === debouncedSearch)

    useEffect(() => {
      setOptions(defaultOptions)
    }, [defaultOptions])

    useEffect(() => {
      if(debouncedSearch === "") {
        setOptions(defaultOptions)
        return
      }
      getTagsFn.execute({search: debouncedSearch})
      .then(options => setOptions(options) )
    }, [debouncedSearch, defaultOptions])

    // event is present only when the options are visible
    useEffect(() => {
      function hideUnselectedOptionsHandler(e) {
        if(!multiSelectRef.current.contains(e.target)) {
          setShowUnselectedOptions(false)
        }
      }
      if(showUnselectedOptions) {
        document.addEventListener("click", hideUnselectedOptionsHandler)
      }

      return () => document.removeEventListener("click", hideUnselectedOptionsHandler)
    }, [showUnselectedOptions])
    
    function selectOption(option) {
        setSearch("")
        setSelectedOptions(prevOptions => [...prevOptions, option])
    }
    function unselectOption(option) {
        setSelectedOptions(prevOptions => prevOptions.filter(prevOption => prevOption._id !== option._id))
    }
    function clearAllOptions() {
        setSearch("")
        setSelectedOptions([])
    }
    function createNewOptionByEnter(e){
      // console.log(e);
      if(e.code === "Enter" && createNewOptionCondition) {
        createNewOption()
      }
    }
    function createNewOption() {
      createTagFn.execute({name: debouncedSearch})
      .then(newOption => setSelectedOptions(prev => [...prev, newOption]))
      setSearch("")
      setShowUnselectedOptions(false)
    }

    return (
      <div
        className="multi-select"
        ref={multiSelectRef}
        onClick={() => setShowUnselectedOptions(true)}
      >
        {selectedOptions?.length > 0 && (
          <div className="selected-options-container">
            {selectedOptions.map((selectedOption) => (
              <button
                className="selected-option"
                key={selectedOption._id}
                onClick={(e) => {
                  e.stopPropagation();
                  unselectOption(selectedOption);
                }}
              >
                <span className="option-name">{selectedOption.name}</span>
                <span className="remove-selected-option">
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="main">
          <div>
            <div className="tag-entry">
              <input
                className="text-md"
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={createNewOptionByEnter}
                disabled={createTagFn.loading}
              />
              <button
                type="button"
                className="btn"
                disabled={selectedOptions.length === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllOptions();
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            {(getDefaultOptionsLoading ||
              getTagsFn.loading ||
              createTagFn.loading) && <ActionLoading />}

            {getDefaultOptionsError && (
              <Toast
                type="error"
                message={getDefaultOptionsError}
                onClose={getDefaultOptionsClearError}
              />
            )}

            {getTagsFn.error && (
              <Toast
                type="error"
                message={getTagsFn.error}
                onClose={getTagsFn.clearError}
              />
            )}

            {createTagFn.error && (
              <Toast
                type="error"
                message={createTagFn.error}
                onClose={createTagFn.clearError}
              />
            )}
          </div>

          {showUnselectedOptions &&
            !getDefaultOptionsLoading &&
            !getDefaultOptionsError &&
            !getTagsFn.loading &&
            !getTagsFn.error && (
              <div className="unselected-options-list">
                {unselectedOptions?.map((unselectedOption) => (
                  <div
                    className="unselected-option text-normal-bold"
                    key={unselectedOption._id}
                    onClick={() => selectOption(unselectedOption)}
                  >
                    <span className="option-name">{unselectedOption.name}</span>
                    <span className="option-count text-sm">
                      {`(${unselectedOption.postCount} posts)`}
                    </span>
                  </div>
                ))}
                {createNewOptionCondition && (
                  <div
                    className="unselected-option text-normal-bold"
                    onClick={createNewOption}
                  >{`Create "${debouncedSearch}"`}</div>
                )}
              </div>
            )}
        </div>
      </div>
    );
}

export default MultiSelect
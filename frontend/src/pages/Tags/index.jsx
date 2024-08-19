import React from 'react'
import {getPopularTags} from "../../services/tag"
import {useAsync} from "../../hooks/useAsync"
import PageLoading from "../../components/PageLoading"
import Error from "../../components/Error"
import TagCard from '../../components/TagCard'


export default function Tags() {
  const {loading, error, value: tags} = useAsync(getPopularTags, [])

  if(loading) {
    return <PageLoading/>
  }

  if(error) {
    return <Error message={error}/>
  }
    console.log(tags)
  return (
    <div className="tags container-lg">
      <h1 className='page-heading'>Tags</h1>
      <div className="tags-list">
        {tags?.map((tag) => (
          <TagCard key={tag._id} {...tag} />
        ))}
      </div>
    </div>
  );
}

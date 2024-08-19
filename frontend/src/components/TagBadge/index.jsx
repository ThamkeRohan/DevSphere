function TagBadge({tag}) {
  return (
    <div className="tag-badge" to={`/tags/${tag._id}`}>
      {tag.name}
    </div>
  )
}

export default TagBadge

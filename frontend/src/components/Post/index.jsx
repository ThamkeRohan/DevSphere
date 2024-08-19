import Markdown from 'markdown-to-jsx'
import Code from './Code'
import { Link } from 'react-router-dom'
import TagBadge from '../TagBadge';

export default function Post({coverImageUrl, author, title, tags, content, createdAt}) {
    return (
      <div className="post container-md">
        <div className="cover-image">
          <img src={coverImageUrl} alt="cover-image" className="cover-image" />
        </div>
        <div>
          <Link to={`/users/${author._id}/profile`}>
            <div className="author-info">
              <div className="author-profile-image">
                <img src={author.profileImageUrl} alt="profile-image" />
              </div>

              <div>
                <div className="text-normal-bold">{author.name}</div>
                <div className="text-sm">Posted on {createdAt}</div>
              </div>
            </div>
          </Link>
          <div className="tags-container">
            {tags.map((tag) => (
              <TagBadge key={tag._id} tag={tag} />
            ))}
          </div>

          <h1 className="post-title text-xxl-bold">{title}</h1>

          <div className="markdown">
            <Markdown
              options={{
                overrides: {
                  code: Code,
                },
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>
    );
}
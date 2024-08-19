import { Link } from "react-router-dom"
import TagBadge from "../../components/TagBadge"
import {forwardRef} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartFilled } from "@fortawesome/free-solid-svg-icons";
import { faComment, faHeart } from "@fortawesome/free-regular-svg-icons";

const PostCard = forwardRef(function PostCard({ post }, ref) {
  return (
    <div className="card post-card" ref={ref}>
      <Link to={`/posts/${post._id}`}>
        <div className="cover-image">
          <img src={post.coverImageUrl} alt="cover-image" />
        </div>
        <div>
          <div className="post-card-header">
            <div className="author-profile-image">
              <img
                src={post.author.profileImageUrl}
                alt="author-profile-image"
              />
            </div>
            <div>
              <div className="author-name text-sm-bold">{post.author.name}</div>
              <div className="created-at text-sm">{post.createdAt}</div>
            </div>
          </div>
          <div className="post-card-content">
            <div>
              <h3 className="post-title text-lg-bold">{post.title}</h3>
              <p className="post-description">{post.description}</p>
            </div>
            <div className="tag-list">
              {post.tags.map((tag) => (
                <TagBadge tag={tag} key={tag._id} />
              ))}
            </div>
            <div className="post-card-footer">
              <span>
                {post.likedByMe ? (
                  <FontAwesomeIcon icon={faHeartFilled} className="filled-heart"/>
                ) : (
                  <FontAwesomeIcon icon={faHeart} />
                )}
                <span>{post.likeCount} likes</span>
              </span>
              <span>
                <FontAwesomeIcon icon={faComment} />
                <span>{post.commentCount} comments</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});



export default PostCard

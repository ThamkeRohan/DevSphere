import ContributionCard from "./ContributionCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faBook, faHashtag } from "@fortawesome/free-solid-svg-icons";

export default function ContributionStats({postCount, commentCount, tagCount}) {
    return (
      <>
        <ul className="contributions">
          {postCount > 0 && (
            <ContributionCard
              icon={<FontAwesomeIcon icon={faBook} className="text-lg-bold" />}
              text={`${postCount} posts published`}
            />
          )}
          {commentCount > 0 && (
            <ContributionCard
              icon={
                <FontAwesomeIcon icon={faComment} className="text-lg-bold" />
              }
              text={`${commentCount} comments written`}
            />
          )}
          {tagCount > 0 && (
            <ContributionCard
              icon={
                <FontAwesomeIcon icon={faHashtag} className="text-lg-bold" />
              }
              text={`${tagCount} tags followed`}
            />
          )}
        </ul>
      </>
    );
}
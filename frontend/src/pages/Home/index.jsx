import ScrollBox from "./ScrollBox";
import SuggestedPosts from "./SuggestedPosts";

export default function Home() {
    return (
      <div className="home container-md">
        <ScrollBox/>
        <SuggestedPosts />
      </div>
    );
}
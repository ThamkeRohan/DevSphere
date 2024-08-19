import UserCommentsList from "./UserCommentList"
import UserPostsList from "./UserPostsList"
import UserDetail from "./UserDetail";
import { useLocation } from "react-router-dom";
import Toast from "../../components/Toast";

export default function ViewProfile() {
  const {state} = useLocation()
    return (
      <>
        {state?.message && <Toast type="success" message={state.message} />}
        <div className="view-profile container-md">
          {/* <div className="background"></div> */}
          <UserDetail />
          <div>
            <UserCommentsList />
            <UserPostsList />
          </div>
        </div>
      </>
    );
}
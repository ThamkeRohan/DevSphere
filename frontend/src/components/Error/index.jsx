import {useNavigate} from "react-router-dom"
import SAD_DOG from "../../assets/images/sad-dog.jpg"

export default function Error({message, onRefresh}) {
    const navigate = useNavigate()
    return (
      <div className="error">
        <header>
          <img src={SAD_DOG} alt="" />
          <h1>Oh nooo!</h1>
          <p>Something went wrong</p>
          <p>{message}</p>
        </header>
        <div>
          {/* <button onClick={onRefresh}>Try again</button> */}
          <button onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
}
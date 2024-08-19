import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faXmark} from "@fortawesome/free-solid-svg-icons"

export default function Toast({type, message, isClosable, onClose}) {
    return (
      <div className={`toast ${type} btn`}>
        <p>{message}</p>
        {isClosable && (
          <button type="button" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark}/>
          </button>
        )}
      </div>
    );
}
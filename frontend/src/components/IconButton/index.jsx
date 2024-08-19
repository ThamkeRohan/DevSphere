import Toast from "../Toast";

export function IconButton({icon, isActive, onClick, isDisabled, ariaLabel, error, closeError, children, styles = ""}) {
    return (
      <div>
        <button
          type="button"
          disabled={isDisabled}
          aria-label={ariaLabel}
          onClick={onClick}
          className={`${isActive ? "active" : ""} ${styles}`}
        >
          {icon}
          {children}
        </button>
        {error && (
          <Toast type="error" message={error} isClosable onClose={closeError} />
        )}
      </div>
    );
}
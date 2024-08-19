export default function FormWrapper({title, description, children}) {
    return (
        <div className="follow-tags">
            <h1>{title}</h1>
            <p>{description}</p>
            {children}
        </div>
    )
}
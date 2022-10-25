export default function UserForm({ onSubmitHandler }) {
    return (
        <form onSubmit={onSubmitHandler}>
            <input 
                type="text" 
                name="username" 
                placeholder="Enter Username" 
                autoComplete="on"
            />
            <input 
                type="password" 
                name="password" 
                placeholder="Enter Password"
                autoComplete="on" 
            />
            <input type="submit"/>
        </form>
    )
}
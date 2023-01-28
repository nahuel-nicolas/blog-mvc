import { Link } from "react-router-dom"

export default function UserForm({ onSubmitHandler }) {
    return (
        <>
        <form onSubmit={onSubmitHandler}>
            <input 
                role="usernameinput"
                type="text" 
                name="username" 
                placeholder="Enter Username" 
                autoComplete="on"
            />
            <input
                role="passwordinput" 
                type="password" 
                name="password" 
                placeholder="Enter Password"
                autoComplete="on" 
            />
            <input type="submit"/>
        </form>
        </>
    )
}
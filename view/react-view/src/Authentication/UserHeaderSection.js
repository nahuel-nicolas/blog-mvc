import { useContext } from 'react'
import { Link } from "react-router-dom"
import AuthContext from './AuthContext'

const UserHeaderSection = () => {
    const { user, logoutUser, loginUser } = useContext(AuthContext)

    if (!user) return <p><Link to='/'>Home</Link> <Link to='/login'>Login</Link></p>
    return (
        <div id="user_section">
            <span>Hello {user.username}! </span>
            <p><Link to='/'>Home</Link> <a href="" onClick={logoutUser}>Logout</a></p>
        </div>
    )
}

export default UserHeaderSection

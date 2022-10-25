import { useContext } from 'react'
import AuthContext from './AuthContext'

const UserHeaderSection = () => {
    const { user, logoutUser } = useContext(AuthContext)

    return (
        <div id="user_section">
            <span>Hello {user.username}</span>
            <a href="" onClick={logoutUser}>Logout</a>
        </div>
    )
}

export default UserHeaderSection

import { useContext } from 'react'
import Link from 'next/link';
import AuthContext from './AuthContext'

const UserHeaderSection = () => {
    const { user, logoutUser, loginUser } = useContext(AuthContext)

    if (!user) return <p><Link href='/'>Home</Link> <Link href='/login'>Login</Link></p>
    return (
        <div id="user_section">
            <span>Hello {user.username}! </span>
            <p><Link href='/'>Home</Link> <a href="" onClick={logoutUser}>Logout</a></p>
        </div>
    )
}

export default UserHeaderSection

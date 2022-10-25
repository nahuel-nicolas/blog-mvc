import { useContext } from 'react'
import AuthContext from './AuthContext'
import { Link } from 'react-router-dom'
import UserForm from './UserForm'

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)
    return (
        <div>
            <h2>Login</h2>
            <UserForm onSubmitHandler={loginUser} />
            <p>New here? <Link to='/register'>Register here</Link></p>
        </div>
    )
}

export default LoginPage

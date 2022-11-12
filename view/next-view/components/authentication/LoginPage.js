import { useContext } from 'react'
import AuthContext from './AuthContext'
import Link from 'next/link';
import UserForm from './UserForm'

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)
    return (
        <div>
            <h2>Login</h2>
            <UserForm onSubmitHandler={loginUser} />
            <p>New here? <Link href='/register'>Register here</Link> or <Link href='/'>Go home</Link></p>
        </div>
    )
}

export default LoginPage

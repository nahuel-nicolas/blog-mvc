import { useContext } from 'react'
import AuthContext from './AuthContext'
import Link from 'next/link';
import UserForm from './UserForm'

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext)
    return (
        <div>
            <h2>Register</h2>
            <UserForm onSubmitHandler={registerUser} />
            <p>Already an user? <Link href='/login'>Log in here</Link> or <Link href='/'>Go home</Link></p>
        </div>
    )
}

export default RegisterPage
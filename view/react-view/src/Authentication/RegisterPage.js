import { useContext } from 'react'
import AuthContext from './AuthContext'
import { Link } from 'react-router-dom'
import UserForm from './UserForm'

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext)
    return (
        <div>
            <h2>Register</h2>
            <UserForm onSubmitHandler={registerUser} />
            <p>Already an user? <Link to='/login'>Log in here</Link></p>
        </div>
    )
}

export default RegisterPage
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './AuthContext'

const PrivateComponent = ({ children }) => {
    const navigateTo = useNavigate()
    const { user } = useContext(AuthContext)

    if (user) {
        return <>{children}</>
    } else {
        navigateTo('/login')
    }
}

export default PrivateComponent;
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import AuthContext from './AuthContext'

const PrivateComponent = ({ children }) => {
    const navigateTo = useNavigate()
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!(user)) navigateTo('/login')
    }, [])

    if (user) return <>{children}</>
}

export default PrivateComponent;
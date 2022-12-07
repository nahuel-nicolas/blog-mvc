import { useRouter } from "next/router";
import { useContext, useEffect } from 'react'
import AuthContext from './AuthContext'

const PrivateComponent = ({ children }) => {
    const router = useRouter()
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!(user)) router.push('/login')
    }, [])

    if (user) return <>{children}</>
}

export default PrivateComponent;
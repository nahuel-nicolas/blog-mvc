import { createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import authentication_api_url from './authentication_api_url';

const getAuthTokens = () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;
const getUser = () => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null;

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    const [authTokens, setAuthTokens] = useState(null)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const verifyLocalStorageData = () => {
        setAuthTokens(getAuthTokens)
        setUser(getUser)
        if (authTokens) {
            fetch(authentication_api_url + `user/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
            })
            .then(response => response.json())
            .then(users => {
                if (!(user.user_id in users)) logoutUser()
            })
        } 
    }

    const registerUser = async (e) => {
        e.preventDefault()
        const response = await fetch(authentication_api_url + 'user/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username':e.target.username.value, 
                'password':e.target.password.value
            })
        })
        const data = await response.json()
        if (response.status < 400) {
            loginUser(e)
        } else {
            console.log([response, data])
            alert(data.username)
        }
    }

    const loginUser = async (e)=> {
        e.preventDefault()
        const response = await fetch(authentication_api_url + 'token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username':e.target.username.value, 
                'password':e.target.password.value
            })
        })
        const data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            router.push('/')
        }else{
            console.log([response, data])
            alert(data.detail)
        }
    }

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        // router.push('/login')
    }

    const updateToken = async () => {
        let tempAuthTokens = authTokens ? authTokens : getAuthTokens();
        const response = await fetch(authentication_api_url + 'token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':tempAuthTokens?.refresh})
        })
        const data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            console.log([response, data])
            logoutUser()
        }
        if(loading){
            setLoading(false)
        }
    }

    const contextData = {
        user:user,
        authTokens:authTokens,
        registerUser:registerUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }
    useEffect(() => verifyLocalStorageData(), [])
    useEffect(() => {
        if(loading) {
            updateToken()
        }
        const fourMinutes = 1000 * 60 * 10
        const interval =  setInterval(()=> {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)

        return () => clearInterval(interval)
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? <p>Checking credentials</p> : children}
        </AuthContext.Provider>
    )
}

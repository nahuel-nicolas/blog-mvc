import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from 'react-router-dom'

import AuthContext from './Authentication/AuthContext'

import Box from "./Box/Box"
import { post_api_url } from './settings'

function areSameObject(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const REST_request_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

const Post = () => {
    const navigateTo = useNavigate()
    const post_id = useParams()["post_id"]
    const isNewPost = 'new' === post_id
    const already_used_slugs = new Set()
    const current_post_api_url = post_api_url + post_id + "/"
    const { user, authTokens } = useContext(AuthContext)
    REST_request_headers.Authorization = 'Bearer ' + String(authTokens.access)
    const initPost = { body: "", title: "", slug: "", author: user.user_id }

    const [postData, setPostData] = useState(initPost)
    const [initialPostData, setInitialPostData] = useState(initPost)
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [isSavingChangesBoxVisible, setIsSavingChangesBoxVisible] = useState(false)
    const [posts, setPosts] = useState([])
    const [isSlugInUse, setIsSlugInUse] = useState(false)

    useEffect(() => {
        fetch(post_api_url)
        .then(res => res.json())
        .then(posts => {
            setPosts(posts)
            if (post_id != 'new') {
                const current_post = posts.find(post => post.id == post_id)
                setPostData(current_post);
                setInitialPostData(current_post);
            }
            posts.map(post => {
                if (post_id == post.id) return;
                already_used_slugs.add(post.slug)
            })
        });
    }, [])

    useEffect(() => {
        setIsSlugInUse(false)
        setIsSubmitButtonDisabled(true)
        if (already_used_slugs.has(postData.slug)) {
            setIsSlugInUse(true)
        } else if (postData.title && postData.body && postData.slug && !(areSameObject(postData, initialPostData))) {
            setIsSubmitButtonDisabled(false)
        }
    }, [postData, initialPostData])

    function textAreaChangeHandler(event) {
        setPostData((prevPostData) => ({
            ...prevPostData, 
            [event.target.name]: event.target.value
        }))
    }

    async function createPost() {
        await fetch(post_api_url, {
            method: "POST",
            headers: REST_request_headers,
            body: JSON.stringify(postData)
        })
    }

    async function updatePost() {
        await fetch(current_post_api_url, {
            method: "PUT",
            headers: REST_request_headers,
            body: JSON.stringify({
                title: postData.title,
                body: postData.body,
                slug: postData.slug,
                author: postData.author
            })
        })
    }

    async function deletePost() {
        await fetch(current_post_api_url, {
            method: "DELETE",
            headers: REST_request_headers
        })
    }

    async function submitButtonHandler() {
        setIsSavingChangesBoxVisible(true)
        if (isNewPost) {
            await createPost()
        } else {
            await updatePost()
        }
        navigateTo('/')
    }

    async function deleteButtonHandler() {
        setIsSavingChangesBoxVisible(true)
        await deletePost()
        navigateTo('/')
    }

    function GoBackButtonHandler() {
        if (isSubmitButtonDisabled) {
            navigateTo('/')
        } else {
            submitButtonHandler()
        }
    }

    return (
        <div id="post">
            <Box isBoxDisplayed={isSavingChangesBoxVisible}>Saving changes...</Box>
            <button id="back_button" onClick={GoBackButtonHandler}>
                <i className="fas fa-chevron-left" />
            </button>
            {isNewPost ? (<div id="date_field" />) : (
                <div id="date_field" >
                    <p>Created: {new Date(postData.created).toLocaleDateString()}</p>
                    <p>Last update: {new Date(postData.created).toLocaleDateString()}</p>
                </div>
            )}
            <input
                type="text" 
                onChange={(event) => textAreaChangeHandler(event)}
                // onBlur={({ target }) => target.focus()}
                name="title" 
                id="post_title" 
                value={postData.title} 
                // autoFocus={true}
                // cols="30" rows="10"
                // style={{"resize": "none"}}
            />
            <textarea 
                onChange={(event) => textAreaChangeHandler(event)}
                // onBlur={({ target }) => target.focus()}
                name="body" 
                id="post_body" 
                value={postData.body} 
                // autoFocus={true}
                cols="30" rows="10"
                style={{"resize": "none"}}
            />
            <input
                type="text" 
                onChange={(event) => textAreaChangeHandler(event)}
                // onBlur={({ target }) => target.focus()}
                name="slug" 
                id="post_slug" 
                value={postData.slug} 
                // autoFocus={true}
                // cols="30" rows="10"
                // style={{"resize": "none"}}
            />
            { isSlugInUse ? <span>Current slug is unavailable, please chose another.</span> : null }
            <div id="post_buttons_container">
                <button onClick={submitButtonHandler} disabled={isSubmitButtonDisabled}>
                    {isNewPost ? "Create" : "Update"}
                </button>
                <button onClick={deleteButtonHandler} disabled={isNewPost}>
                    <i className="fas fa-trash-alt" />
                </button>
            </div>
        </div>
    )
}

export default Post
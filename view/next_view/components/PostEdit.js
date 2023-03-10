import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/router";
import AuthContext from "./authentication/AuthContext";

import Box from "./Box"
import { post_api_url } from '../settings'
import { log } from '../utilities'

function areSameObject(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const REST_request_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

const PostEdit = () => {
    const router = useRouter()
    const post_slug = router.query.slug
    const isNewPost = 'undefined' === typeof post_slug
    
    const { user, authTokens } = useContext(AuthContext)
    REST_request_headers.Authorization = 'Bearer ' + String(authTokens.access)
    const initPost = { body: "", title: "", slug: "", author: user.user_id }

    const [current_post_api_url, set_current_post_api_url] = useState('')
    const [usedSlugs, setUsedSlugs] = useState(new Set())
    const [postData, setPostData] = useState(initPost)
    const [initialPostData, setInitialPostData] = useState(initPost)
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [isSavingChangesBoxVisible, setIsSavingChangesBoxVisible] = useState(false)
    const [posts, setPosts] = useState([])
    const [isSlugInUse, setIsSlugInUse] = useState(false)

    useEffect(() => {
        if(!router.isReady) return;
        fetch(post_api_url)
        .then(res => res.json())
        .then(posts => {
            setPosts(posts)
            if (!isNewPost) {
                log.debug(posts)
                const current_post = posts.find(post => post.slug == post_slug)
                log.debug([post_slug, current_post, posts])
                set_current_post_api_url(post_api_url + current_post.id + '/')
                setPostData(current_post);
                setInitialPostData(current_post);
            }
            setUsedSlugs(new Set(posts.map(post => {
                if (post_slug != post.slug) return post.slug;
            })))
        });
    }, [router.isReady])

    useEffect(() => {
        setIsSlugInUse(false)
        setIsSubmitButtonDisabled(true)
        if (usedSlugs.has(postData.slug)) {
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
        const res = await fetch(current_post_api_url, {
            method: "PUT",
            headers: REST_request_headers,
            body: JSON.stringify({
                title: postData.title,
                body: postData.body,
                slug: postData.slug,
                author: postData.author
            })
        })
        res.json().then(data => {
            log.debug(data)
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
        router.push('/')
    }

    async function deleteButtonHandler() {
        setIsSavingChangesBoxVisible(true)
        await deletePost()
        router.push('/')
    }

    function GoBackButtonHandler() {
        if (isSubmitButtonDisabled) {
            router.push('/')
        } else {
            submitButtonHandler()
        }
    }

    return (
        <div id="post" className="container">
            <Box isBoxDisplayed={isSavingChangesBoxVisible}>Saving changes...</Box>
            {isNewPost ? (<div id="date_field" />) : (
                <div id="date_field" >
                    <p>Created: {new Date(postData.created).toLocaleDateString()}</p>
                    <p>Last update: {new Date(postData.created).toLocaleDateString()}</p>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="post_title">Title</label>
                <input
                    className="form-control"
                    type="text" 
                    onChange={(event) => textAreaChangeHandler(event)}
                    name="title" 
                    id="post_title" 
                    value={postData.title} 
                />
            </div>
            <div className="form-group">
                <label htmlFor="post_body">Body</label>
                <textarea 
                    className="form-control"
                    onChange={(event) => textAreaChangeHandler(event)}
                    name="body" 
                    id="post_body" 
                    value={postData.body} 
                    cols="30" rows="10"
                    style={{"resize": "none"}}
                />
            </div>
            <div className={isSlugInUse ? "form-group has-error" : "form-group"}>
                {isSlugInUse ? <p className="control-label">Slug already in use.</p> : null}
                <label className="control-label" htmlFor="post_slug">Slug</label>
                <input
                    className="form-control"
                    type="text" 
                    onChange={(event) => textAreaChangeHandler(event)}
                    name="slug" 
                    id="post_slug" 
                    value={postData.slug} 
                />
            </div> 
            <div id="post_buttons_container">
                <button className="btn btn-default" onClick={submitButtonHandler} disabled={isSubmitButtonDisabled}>
                    {isNewPost ? "Create" : "Update"}
                </button>
                <button className="btn btn-default" id="back_button" onClick={GoBackButtonHandler}>
                    Cancel
                </button>
                <button className="btn btn-default" onClick={deleteButtonHandler} disabled={isNewPost}>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default PostEdit
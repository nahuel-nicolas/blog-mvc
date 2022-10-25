import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import Box from "./Box/Box"
import { post_api_url } from './settings'

function isPostBodyChanged(initialPostBody, currentPostBody) {
    return initialPostBody != currentPostBody
}

const Post = () => {
    const navigateTo = useNavigate()
    const post_id = useParams()["post_id"]
    const [postData, setPostData] = useState({"body": ""})
    const [initialPostBody, setInitialPostBody] = useState(postData.body)
    const [isNewPost, setIsNewPost] = useState(true)
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
    const [isSavingChangesBoxVisible, setIsSavingChangesBoxVisible] = useState(false)
    const current_post_api_url = post_api_url + post_id + "/"

    useEffect(() => {
        if (post_id != 'new') {
            setIsNewPost(false);
            fetch(current_post_api_url)
            .then(res => res.json())
            .then(post_data => {
                setPostData(post_data);
                setInitialPostBody(post_data.body);
            });
        }
    }, [])
    useEffect(() => {
        if (isPostBodyChanged(initialPostBody, postData.body)) {
            setIsSubmitButtonDisabled(false)
        } else {
            setIsSubmitButtonDisabled(true)
        }
    }, [postData, initialPostBody])

    function textAreaChangeHandler(event) {
        setPostData((prevPostData) => ({
            ...prevPostData, 
            "body": event.target.value
        }))
    }

    async function createPost() {
        await fetch(post_api_url, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
    }

    async function updatePost() {
        await fetch(current_post_api_url, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"body": postData.body})
        })
    }

    async function deletePost() {
        await fetch(current_post_api_url, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
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
            <textarea 
                onChange={(event) => textAreaChangeHandler(event)}
                onBlur={({ target }) => target.focus()}
                name="post_body" 
                id="post_body" 
                value={postData.body} 
                autoFocus={true}
                cols="30" rows="10"
                style={{"resize": "none"}}
            />
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
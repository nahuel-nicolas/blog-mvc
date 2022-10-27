import { useEffect, useContext, useState } from "react";

import AuthContext from './Authentication/AuthContext'
import { comment_api_url } from "./settings";

const AddComment = ({ post_id, setIsSavingChangesBoxVisible }) => {
    const { user, authTokens } = useContext(AuthContext) 
    
    const [headers, setHeaders] = useState({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    })

    const [newCommentData, setNewCommentData] = useState({
        author: null,
        post: post_id,
        body: ''
    })

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)

    useEffect(() => {
        if (user) {
            setHeaders((prevHeaders) => {
                const headers = JSON.parse(JSON.stringify(prevHeaders))
                headers.Authorization = 'Bearer ' + String(authTokens.access)
                return headers
            })
            setNewCommentData((prevData) => ({
                ...prevData,
                author: user.user_id
            }))
        }
    }, [])

    useEffect(() => {
        setIsSubmitButtonDisabled(true)
        if (newCommentData.body !== '') {
            setIsSubmitButtonDisabled(false)
        }
    }, [newCommentData])

    async function submitButtonHandler() {
        setIsSavingChangesBoxVisible(true)
        await createComment()
        setIsSavingChangesBoxVisible(false)
        window.location.reload();
    }

    function textAreaChangeHandler(event) {
        setNewCommentData((prevNewCommentData) => ({
            ...prevNewCommentData, 
            [event.target.name]: event.target.value
        }))
    }

    async function createComment() {
        await fetch(comment_api_url, {
            method: "POST",
            headers,
            body: JSON.stringify(newCommentData)
        })
    }

    if (!user) return;
    
    return (
        <>
        <h4>Add a comment</h4>
        <div className="form-group">
            <textarea 
                className="form-control"
                onChange={(event) => textAreaChangeHandler(event)}
                name="body" 
                id="comment-body" 
                value={newCommentData.body} 
                cols="30" rows="10"
                style={{"resize": "none"}}
            />
        </div>
        <button className="btn btn-default" onClick={submitButtonHandler} disabled={isSubmitButtonDisabled}>
            Create
        </button>
        <hr />
        </>
    )
}

export default AddComment
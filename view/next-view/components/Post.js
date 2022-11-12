import { useState, useEffect } from "react"
import { useRouter } from "next/router";

import Box from "./Box"
import { post_api_url, api_url, comment_api_url } from '../settings'
import AddComment from "./AddComment"

function areSameObject(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const REST_request_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
}

const Post = () => {
    const router = useRouter()
    const post_slug = router.query.slug
    const initPost = { body: "", title: "", slug: "", author: null }
    const [postData, setPostData] = useState(initPost)
    const [isSavingChangesBoxVisible, setIsSavingChangesBoxVisible] = useState(false)
    const [posts, setPosts] = useState([])
    const [comments, setComments] = useState([])
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        fetch(post_api_url)
        .then(res => res.json())
        .then(posts => {
            setPosts(posts)
            const current_post = posts.find(post => post.slug == post_slug)
            if (!current_post) return;
            setPostData(current_post);
            fetch(comment_api_url)
            .then(res => res.json())
            .then(comments_data => {
                setComments(comments_data.filter(comment => comment.post === current_post.id))
            })
        });
        fetch(api_url + 'authentication/user/')
        .then(res => res.json())
        .then(users_data => {
            setUsers(users_data)
        })
    }, [router.isReady])
    if (!postData.body) return <h1>ERROR 404</h1>;
    return (
        <div id="post" className="container">
            <Box isBoxDisplayed={isSavingChangesBoxVisible}>Saving changes...</Box>
            <h1>{postData.title}</h1>
            <div id="date_field" >
                <p>Created: {new Date(postData.created).toLocaleDateString()}</p>
                <p>Last update: {new Date(postData.created).toLocaleDateString()}</p>
            </div>
            <p>{postData.body}</p>
            <br />
            <hr />
            <AddComment post_id={postData.id} isSavingChangesBoxVisible={isSavingChangesBoxVisible} />
            <h4>Comments ({comments.length})</h4>
            <div className="container">
                {comments.map((comment, idx) => (
                    <div key={idx} className="container">
                        <p><b>{users[comment.author].username}</b></p>
                        <div className="container">
                            <p>{new Date(comment.created).toLocaleDateString()}</p>
                            <p>{comment.body}</p>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Post
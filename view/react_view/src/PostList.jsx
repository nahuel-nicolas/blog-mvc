import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PostListItem from "./PostListItem"
import { post_api_url } from './settings'

const PostList = () => {
    const [PostListData, setPostListData] = useState(null)
    useEffect(() => {
        fetch(post_api_url)
        .then(res => res.json())
        .then(res => {
            const posts = Array.isArray(res) ? res : [];
            setPostListData(posts)
        })
    }, [])
    
    let valueToReturn;
    if (PostListData == null) {
        valueToReturn = <h2>Loading...</h2>
    } else if (PostListData.length > 0) {
        valueToReturn = PostListData.map((currentPostData, currentPostIdx) => (
            <PostListItem postData={currentPostData} key={currentPostIdx} />
        ))
    } else {
        valueToReturn = <h2>No posts</h2>
    }
    return (
        <div id="post_list_app" className="container">
            <div id="posts">
                {valueToReturn}
            </div>
            <br />
            <Link to='post/new/edit'>
                <button id="add_post_button" className="btn btn-default">New Post</button>
            </Link>
        </div>
    )
}

export default PostList
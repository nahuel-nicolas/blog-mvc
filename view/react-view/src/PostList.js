import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PostListItem from "./PostListItem"
import { post_api_url } from './settings'

const PostList = () => {
    const [PostListData, setPostListData] = useState(null)
    useEffect(() => {
        fetch(post_api_url)
        .then(res => res.json())
        .then(data => {
            setPostListData(data)
        })
    }, [])
    let valueToReturn;
    if (PostListData == null) {
        valueToReturn = <h2>Loading...</h2>
    }
    else if (PostListData.length < 1) {
        valueToReturn = <h2>No posts</h2>
    } else {
        valueToReturn = PostListData.map((currentPostData, currentPostIdx) => (
            <PostListItem postData={currentPostData} key={currentPostIdx} />
        ))
    }
    return (
        <div id="post_list_app">
            <div id="posts">
                {valueToReturn}
            </div>
            <Link to='post/new'>
                <button id="add_post_button">+</button>
            </Link>
        </div>
    )
}

export default PostList
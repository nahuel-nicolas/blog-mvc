import { Link } from 'react-router-dom'

function get_post_id(postData) {
    let post_id = postData._id
    return post_id
}

let getTime = (post) => {
    return new Date(post.updated).toLocaleDateString()
}

let getTitle = (post) => {
    let title = post.body.split('\n')[0]
    if (title.length > 45) {
        return title.slice(0, 45)
    }
    return title
}


let getContent = (post) => {
    let title = getTitle(post)
    let content = post.body.replaceAll('\n', ' ')
    content = content.replaceAll(title, '')
    if (content.length > 45) {
        return content.slice(0, 45) + '...'
    } else {
        return content
    }
}


const PostListItem = ({ postData }) => {
    return (
        <Link to={`/post/${postData.id}`}>
            <div className="post-list-item" >
                <p>{postData.title}</p>
                <p><span>{getTime(postData)}</span>{getContent(postData)}</p>
            </div>
        </Link>
    )
}

export default PostListItem

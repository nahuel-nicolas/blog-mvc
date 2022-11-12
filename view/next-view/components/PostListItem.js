import Link from 'next/link';

function get_post_id(postData) {
    let post_id = postData.id
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
    return <>
            <div className="container" >
                <h3>{postData.title}</h3>
                <p><span>{getTime(postData)}</span>{getContent(postData)}</p>
                <Link href={`/post/${postData.slug}`}>Visit</Link>
                <span>  </span>
                <Link href={`/post/${postData.slug}/edit`}>Edit</Link>
            </div>
            <hr />
        </>
}

export default PostListItem

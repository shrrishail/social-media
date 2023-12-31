import { useUserContext } from '@/context/AuthContext'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import PostStats from './PostStats'
import { multiFormatDateString } from '@/lib/utils'
import LazyImage from './LazyImage'

type PostCardProps = {
    post: Models.Document
}

const PostCard = ({post}: PostCardProps) => {
    const {user} = useUserContext();

    if(!post.creator) return;

    return (
        <div className="post-card">
            <div className="flex-between px-3 pt-5">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}?ref=post&refId=${post.$id}`} className='relative overflow-hidden rounded-full'>
                        <LazyImage 
                            imageUrl={
                                post.creator?.imageUrl || 
                                "/assets/icons/profile-placeholder.svg"
                            }
                            alt='creator image'
                            className='w-12 lg:h-12 rounded-full'
                        />
                    </Link>

                    <Link to={`/profile/${post.creator.$id}?ref=post&refId=${post.$id}`}>
                        <div className="flex flex-col">
                            <p className="base-medium lg:body-bold text-light-2 tracking-tight">
                                {post.creator.name}
                            </p>
                            <div className="flex items-center h-fit gap-2 text-light-3">
                                <p className="subtle-semibold lg:small-regular">
                                    {multiFormatDateString(post.$createdAt)}
                                </p>
                                <span className='dot'></span>
                                <p className="subtle-semibold lg:small-regular">
                                    {post.location}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <Link
                    to={`/update-post/${post.$id}`}
                    className={`${user.id !== post.creator.$id && 'hidden'}`}
                >
                    <img 
                        src={'/assets/icons/edit.svg'}
                        alt="edit post button"
                        height={20}
                        width={20} 
                    />
                </Link>
            </div>

            <Link to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium p-3">
                    <div className='tracking-normal font-normal text-light-2'>
                        {post.caption.split('\n').map((line: string, index: number) => (<p key={index}>{line}</p>))}
                    </div>
                    <ul className="flex gap-1 mt-2 flex-wrap">
                        {
                            post.tags.map((tag: string, index: string) => (
                                <li key={index} className="text-light-3 small-regular">
                                    #{tag}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className='relative overflow-hidden'>
                    <LazyImage
                        imageUrl={post.imageUrl}
                        className='post-card_img'
                        alt='post image'
                    />
                </div>
            </Link>

            <PostStats 
                post={post} 
                userId={user.id} 
                enableComments={true}
                enableShare={true}
            />
        </div>
    )
}

export default PostCard
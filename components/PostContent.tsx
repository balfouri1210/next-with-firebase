import Link from 'next/link';
import ReactMakrdown from 'react-markdown';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PostContent = ({ post, path }) => {
  const createdAt = typeof post?.createdAt === 'number' ?
    new Date(post.createdAt)
    : post.createdAt.toDate();

  const postRef = doc(db, path);
  const [realtimePost] = useDocumentData(postRef);

  const updatedPost = realtimePost || post;

  return (
    <div className="card">
      <h1>{post?.title}</h1>

      <span className="text-sm">
        Written by {' '}
        <Link href={`/${updatedPost.username}`}>
          <a className="text-info">@{updatedPost.username}</a>
        </Link>{' '}
        on {createdAt.toISOString()}
      </span>
      <ReactMakrdown>{updatedPost?.content}</ReactMakrdown>
    </div>
  )
}

export default PostContent;
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { db, auth, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { doc, getDoc, getDocs, query, collectionGroup } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Metatags from '../../components/Metatags';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(db, 'users', userDoc.id, 'posts', slug);

    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return {
    props: {
      post, path
    },

    revalidate: 5000
  }
}

export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(db, 'posts'));

  const paths = snapshot.docs.map(doc => {
    const { username, slug } = doc.data();
    return {
      params: { username, slug }
    }
  });

  return {
    paths,
    fallback: 'blocking'
  }
}

const Post = ({ post, path }) => {
  const postRef = doc(db, path);
  const [realtimePost] = useDocumentData(postRef);
  const { user: currentUser } = useContext(UserContext);

  post = realtimePost || post;

  return (
    <main className={styles.container}>
      <Metatags />

      <section>
        <PostContent post={post} path={path} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ♥️</strong>
        </p>

        <AuthCheck fallback={<Link href="/enter">
            <button>💗 Sign Up</button>
          </Link>}>
          <HeartButton postRef={postRef} />
        </AuthCheck>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="btn-blue">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  )
}

export default Post;
import { useState } from 'react';
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { db, fromMillis, postToJSON } from '../lib/firebase';
import { collectionGroup, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = query(
    collectionGroup(db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: {
      posts
    }
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const cursor = typeof last.createdAt === 'number' ?
      fromMillis(last.createdAt)
      : last.createdAt

    const newPostsQuery = query(
      collectionGroup(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(newPostsQuery)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) setPostsEnd(true);
  }

  return (
    <main>
      <PostFeed posts={posts} admin={false} />
      {!loading && !postsEnd && <button onClick={getMorePosts}>Get more posts</button>}
      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}

      {/* <button onClick={() => {toast.success('hello toast!')}}>
        Toast Me
      </button> */}
    </main>
  )
}

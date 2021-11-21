import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import PostFeed from '../../components/PostFeed';
import { UserContext } from '../../lib/context';
import { db, auth } from '../../lib/firebase';
import { serverTimestamp, collection, query, orderBy, getDocs, doc, setDoc } from 'firebase/firestore';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';

const AdminPostsPage = (props) => {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
};

const PostList = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const postsRef = collection(db, 'users', auth.currentUser.uid, 'posts');
      const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
      setPosts((await getDocs(postsQuery)).docs.map(doc => doc.data()));
    }
    getPosts();
  }, []);

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  )
}

const CreateNewPost = () => {
  console.log('create new post called');
  
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    try {
      e.preventDefault();
      const uid = auth.currentUser.uid;
      const postRef = doc(db, 'users', uid, 'posts', slug);
  
      const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: '# hello world!',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        heartCount: 0
      };
  
      await setDoc(postRef, data);
  
      toast.success('Post created!');
      router.push(`/admin/${slug}`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={title}
        onChange={(e) => { setTitle(e.target.value) }}
        placeholder="My Awesome Article!"
        className={styles.input}
      />

      <p>
        <strong>Slug: </strong>{slug}
      </p>

      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}

export default AdminPostsPage;
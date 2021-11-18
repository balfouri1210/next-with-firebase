import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  // doc에 쓰이는 param은 string만 지원하는데,
  // useRouter의 리턴타입이 string | string[] 이라서 TS에러가 발생했다.
  // 이럴때 as 키워드로 타입을 캐스팅하여 에러를 피할 수 있다.
  const postRef = doc(db, 'users', auth.currentUser.uid, 'posts', slug as string);
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview} />
          </section>

          <aside>
          <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch, formState: { isValid, isDirty, errors } } = useForm({ defaultValues, mode: 'onChange' });

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp()
    });

    reset({ content, published });
    toast.success('Post updated successfully!');
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        {/* TS에서 ref를 등록하는 방법은 조금 달라서 숙지할 필요가 있다. */}
        {/* register로 등록후 submit 하면 지정한 이름으로 콜백에 파라미터가 삽입되는 시스템 */}
        {/* fm대로 구현하는 것 보다 간단하게 처리할 수 있다. */}
        <textarea {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required'}
          })}></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          <input className={styles.checkbox} type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  )
}

const AdminPostEdit = () => {
  return (
    <AuthCheck>
      <PostManager></PostManager>
    </AuthCheck>
  )
};

export default AdminPostEdit;
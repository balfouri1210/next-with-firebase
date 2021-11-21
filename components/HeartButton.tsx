import { db, auth } from '../lib/firebase';
import { doc, writeBatch, increment } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

const HeartButton = ({ postRef }) => {
  console.log('heart button rendered');
  
  const heartRef = doc(postRef, 'hearts', auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  const batch = writeBatch(db);

  const addHeart = async () => {
    const uid = auth.currentUser.uid;

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  }

  const removeHeart = async () => {
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  }

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  )
}

export default HeartButton;
import { useEffect, useState } from 'react';
// react용 google login 완료 훅
import { useAuthState } from 'react-firebase-hooks/auth'; 
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      // const ref = getUser();
      unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        setUsername(doc.data()?.username);
      })
    } else {
      setUsername(null);
    }

    // [중요] component가 demounted될때 firestore snapshot을 unsubscribe!
    return unsubscribe;
  }, [user]);

  return { user, username }
}
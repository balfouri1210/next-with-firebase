import '../styles/globals.css'
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';

function MyApp({ Component, pageProps }) {
  // 최상위 component에서 useUserData hook으로 userData: { user, username }을 생성하고,
  // 그걸 받아 UserContext의 초기값을 설정한다.
  // 그럼 모든 child component들은 userContext를 구독해서 값을 받아보기만 하면 된다.
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />

      {/* Invisible by default */}
      <Toaster /> 
    </UserContext.Provider>
  )
}

export default MyApp

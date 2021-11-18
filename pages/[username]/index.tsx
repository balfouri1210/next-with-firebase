import toast from "react-hot-toast";
import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { db, getUserWithUsername, getPosts, postToJSON } from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserWithUsername(username);

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    posts = await getPosts(userDoc.id);
  } else {
    return {
      notFound: true
    }
  }

  return {
    props: {
      user,
      posts
    }
  }
}

const UserProfilePage = ({ user, posts }) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin />
    </main>
  )
}

export default UserProfilePage;
import {useEffect, useState} from 'react';
import {useUser} from '../hooks/apiHooks';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const {getUserByToken} = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const result = await getUserByToken(token);
        setUser(result.user);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <h2>Profile</h2>

      {error && <p className="error">{error}</p>}

      {user ? (
        <dl>
          <dt>Username</dt>
          <dd>{user.username}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>User ID</dt>
          <dd>{user.user_id}</dd>
          <dt>Created</dt>
          <dd>
            {user.created_at
              ? new Date(user.created_at).toLocaleString('fi-FI')
              : '-'}
          </dd>
        </dl>
      ) : (
        <p>Log in to see your profile</p>
      )}
    </>
  );
};

export default Profile;

import {useEffect, useState} from 'react';
import {fetchData} from '../utils/fetchData';

const mediaApi = import.meta.env.VITE_MEDIA_API;
const authApi = import.meta.env.VITE_AUTH_API;

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const media = await fetchData(`${mediaApi}/media`);

        // Cache user requests so that each user is fetched only once
        const users = new Map();

        const mediaWithUsers = await Promise.all(
          media.map(async (item) => {
            if (!users.has(item.user_id)) {
              users.set(
                item.user_id,
                fetchData(`${authApi}/users/${item.user_id}`),
              );
            }

            try {
              const user = await users.get(item.user_id);
              return {...item, username: user.username};
            } catch {
              return {...item, username: 'Unknown'};
            }
          }),
        );

        setMediaArray(mediaWithUsers);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    getMedia();
  }, []);

  return {mediaArray, error};
};

const useAuthentication = () => {
  const postLogin = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/auth/login`, fetchOptions);
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token) => {
    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    return await fetchData(`${authApi}/users/token`, fetchOptions);
  };

  const postUser = async (inputs) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    return await fetchData(`${authApi}/users`, fetchOptions);
  };

  return {getUserByToken, postUser};
};

export {useMedia, useAuthentication, useUser};

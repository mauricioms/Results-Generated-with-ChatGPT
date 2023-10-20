import {ref} from 'vue';

import api from './api';

const authenticated = ref(false);

export const setAuthenticated = (value: boolean) => {
  authenticated.value = value;
};

export const isAuthenticated = () => {
  return authenticated.value;
};

export const login = async (email: string, password: string) => {
  try
  {
    const response = await api.post('/auth/login', {email, password});
    const token = response.data.token;

    if (token)
    {
      localStorage.setItem('authToken', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAuthenticated(true);
      const user = {email};
      localStorage.setItem('user', JSON.stringify(user));
    }

    return true;
  }
  catch (error)
  {
    console.error(error);
    return false;
  }
};

export const register = async (email: string, password: string) => {
  try
  {
    await api.post('/auth/register', {email, password});
    return true;
  }
  catch (error)
  {
    console.error(error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user'); // remove user
  delete api.defaults.headers.common['Authorization'];
  setAuthenticated(false);
};

// Check if there's a token in local storage and set the authentication state
const token = localStorage.getItem('authToken');
if (token)
{
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  setAuthenticated(true);
}

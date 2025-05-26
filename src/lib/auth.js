import Cookies from 'js-cookie';

export const login = async (email, password) => {
  const response = await fetch ('auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    Cookies.set('token', data.token, { expires: 7 }); // Store token in cookies for 7 days
    return data;
  } else {
    throw new Error(data.message || 'Login failed');
  }
}
export const getToken = () => Cookies.get('token');
export const logout = () => { Cookies.remove('token'); };
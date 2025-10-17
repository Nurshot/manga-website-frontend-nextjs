import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  if (isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  return children;
};

export default GuestRoute;
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, showAlert } = useContext(AuthContext);
  const router = useRouter();

  if (!isAuthenticated) {
    if (showAlert) {
      alert("Görüntülemek için giriş yapınız.");
    }
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;
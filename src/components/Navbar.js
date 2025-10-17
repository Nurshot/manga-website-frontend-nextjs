import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css'; // CSS Modülleri

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>
        <h1>Yet Manga</h1>
        <div className={styles['menu-icon']} onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={`${styles['navbar-menu']} ${isOpen ? styles.active : ''}`}>
          <li>
            <Link href="/" legacyBehavior>
              <a onClick={toggleMenu}>Anasayfa</a>
            </Link>
          </li>
          <li>
            <Link href="/manga" legacyBehavior>
              <a onClick={toggleMenu}>Tüm Mangalar</a>
            </Link>
          </li>
          <li>
            <Link href="/discord" legacyBehavior>
              <a onClick={toggleMenu}>Discord</a>
            </Link>
          </li>
        </ul>
        <input type="text" placeholder="Arama..." className={styles['search-input']} />
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles['auth-button']}>
            <FaSignOutAlt /> Çıkış Yap
          </button>
        ) : (
          <Link href="/login" legacyBehavior>
            <a className={styles['auth-button']}><FaSignInAlt /> Giriş Yap</a>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
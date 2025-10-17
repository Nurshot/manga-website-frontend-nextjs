import React, { useState, useContext, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/Auth.module.css'; // CSS Modülleri
import styleshome from '../styles/Homepage.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    recaptchaToken: '',
  });
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecaptchaChange = (token) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      recaptchaToken: token,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recaptchaToken) {
      alert('Please complete the reCAPTCHA.');
      return;
    }
    try {
      const response = await loginUser(formData);
      login(response.access_token);
      router.push('/');
    } catch (error) {
      recaptchaRef.current.reset(); // Reset reCAPTCHA
      setTimeout(() => {
        window.location.reload(); // Reload page after a brief delay
      }, 500);
    }
  };

  return (
    <div className={styleshome.home}>
    
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lcn9w8qAAAAAAauoSxI5Z5yPj_dNaCMhm5tf-Xp" // Replace with your site key
            onChange={handleRecaptchaChange}
          />
          <button type="submit">Login</button>
        </form>
        <Link href="/register" className={styles.link}>
            Don&apos;t have an account? Register
            </Link>


        
      </div>
    </div>
    </div>
  );
};

export default Login;
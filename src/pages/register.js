import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
import { registerUser } from '../services/api';
import styles from '../styles/Auth.module.css'; // CSS Modülleri

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    recaptchaToken: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
      await registerUser(formData);
      setSuccessMessage('Successfully registered! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || 'Registration failed');
      recaptchaRef.current.reset(); // Reset reCAPTCHA
      setTimeout(() => {
        window.location.reload(); // Reload page after a brief delay
      }, 500);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <div className={styles['auth-card']}>
        <h2>Register</h2>
        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
        {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
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
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <button type="submit">Register</button>
        </form>
        <Link href="/login" legacyBehavior>
          <a className={styles.link}>Already have an account? Login</a>
        </Link>
      </div>
    </div>
  );
};

export default Register;
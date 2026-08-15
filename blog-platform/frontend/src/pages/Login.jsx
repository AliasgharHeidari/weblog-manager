import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from '../components/Icon';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.is_admin ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.error || t('invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box glass-strong">
        <h2 className="auth-title">{t('welcomeBack')}</h2>
        <p className="auth-subtitle">{t('signIn')}</p>
        
        {error && (
          <div className="auth-error">
            <Icon name="info" style={{ width: "18px", height: "18px", flexShrink: 0 }} />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{width: '100%', justifyContent: 'center'}}>
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>
        
        <p className="auth-footer">
          {t('noAccount')}{' '}
          <Link to="/register" className="auth-link">{t('registerHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

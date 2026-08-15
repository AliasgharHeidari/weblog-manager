import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Icon from './Icon';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-strong">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">
            {language === 'en' ? 'B' : 'ب'}
          </span>
          <span className="navbar-title">{t('blogName')}</span>
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="btn-ghost" style={{color: 'var(--primary)'}}>
                  <Icon name="dashboard" className="w-5 h-5" />
                  <span>{t('dashboard')}</span>
                </Link>
              )}
              <Link to="/admin/profile" className="btn-ghost">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{color: '#ef4444'}}>
                <Icon name="logout" className="w-5 h-5" />
                <span>{t('logout')}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">{t('login')}</Link>
              <Link to="/register" className="btn-primary" style={{padding: '8px 16px', fontSize: '14px'}}>
                {t('register')}
              </Link>
            </>
          )}
          
          <button onClick={toggleLanguage} className="icon-btn" title={t('language')}>
            <Icon name="globe" className="w-5 h-5" />
            <span style={{fontSize: '12px'}}>{language.toUpperCase()}</span>
          </button>

          <button onClick={toggleTheme} className="icon-btn" title="Theme">
            <Icon name={darkMode ? 'sun' : 'moon'} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

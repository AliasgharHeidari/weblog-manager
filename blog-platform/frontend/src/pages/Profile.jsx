import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import Icon from '../components/Icon';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [githubURL, setGithubURL] = useState(user?.github_url || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar_url || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // آپدیت پروفایل
      const profileResponse = await api.put('/admin/profile', {
        username,
        email,
        github_url: githubURL,
        bio,
      });
      
      // آپلود آواتار اگر انتخاب شده
      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        const avatarResponse = await api.post('/admin/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updateUser({ ...profileResponse.data, avatar_url: avatarResponse.data.avatar_url });
      } else {
        updateUser(profileResponse.data);
      }
      
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', padding: '48px 24px'}}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: '800',
        marginBottom: '32px',
        color: 'var(--text)'
      }}>
        {t('profile')}
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--surface)',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{textAlign: 'center'}}>
          {preview ? (
            <img 
              src={preview} 
              alt="Avatar" 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 16px',
                border: '3px solid var(--primary)'
              }}
            />
          ) : (
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'var(--gradient)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              fontWeight: '800',
              margin: '0 auto 16px'
            }}>
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <label className="btn-secondary" style={{cursor: 'pointer'}}>
            <Icon name="image" className="w-5 h-5" />
            {t('uploadAvatar')}
            <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}} />
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="input-field"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input 
            type="url" 
            value={githubURL} 
            onChange={(e) => setGithubURL(e.target.value)} 
            className="input-field"
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="input-field"
            rows="3"
            placeholder="About yourself..."
          />
        </div>

        {error && (
          <div className="auth-error">
            <Icon name="info" className="w-5 h-5" />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary" style={{justifyContent: 'center'}}>
          {loading ? 'Saving...' : t('save')}
        </button>
      </form>
    </div>
  );
};

export default Profile;

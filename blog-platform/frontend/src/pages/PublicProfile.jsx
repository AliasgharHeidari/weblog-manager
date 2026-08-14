import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Icon from '../components/Icon';

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={handleBackdropClick}
    >
      <div style={{
        background: 'var(--surface)',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '420px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        position: 'relative',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid var(--border)',
        zIndex: 1001
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--surface-hover)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'all 0.2s',
            fontSize: '18px'
          }}
        >
          ✕
        </button>

        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.username}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 20px',
              border: '4px solid var(--primary)',
              boxShadow: '0 0 40px rgba(99,102,241,0.4)'
            }}
          />
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 auto 20px',
            boxShadow: '0 0 40px rgba(99,102,241,0.4)'
          }}>
            {profile?.username?.charAt(0).toUpperCase() || '?'}
          </div>
        )}

        <h2 style={{
          fontSize: '28px',
          fontWeight: '800',
          marginBottom: '8px',
          color: 'var(--text)'
        }}>
          {profile?.username}
        </h2>

        {profile?.bio && (
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '24px',
            fontSize: '15px',
            lineHeight: '1.7',
            maxWidth: '300px',
            margin: '0 auto 24px'
          }}>
            {profile.bio}
          </p>
        )}

        {profile?.github_url && (
          <a 
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'var(--surface-hover)',
              color: 'var(--text)',
              borderRadius: '12px',
              fontWeight: '600',
              transition: 'all 0.3s',
              border: '1px solid var(--border)',
              textDecoration: 'none'
            }}
          >
            <Icon name="github" className="w-5 h-5" />
            GitHub Profile
          </a>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;

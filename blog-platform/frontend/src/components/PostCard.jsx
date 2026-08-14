import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const PostCard = ({ post }) => {
  const { t } = useLanguage();
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const openProfile = async (e, authorId) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfile(true);
    try {
      const response = await api.get(`/users/${authorId}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const closeProfile = () => {
    setShowProfile(false);
    setProfileData(null);
  };

  return (
    <>
      <article className="card post-card">
        <Link to={`/post/${post.id}`}>
          <div className="post-card-image">
            {post.image_url ? (
              <img src={post.image_url} alt={post.title} />
            ) : (
              <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)'}}>
                <Icon name="image" className="w-12 h-12" style={{color: 'var(--text-secondary)'}} />
              </div>
            )}
            <div style={{position: 'absolute', top: '12px', right: '12px', zIndex: 10}}>
              <span style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--primary)',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(8px)'
              }}>
                {post.section}
              </span>
            </div>
          </div>
          <div className="post-card-body">
            <h3 className="post-card-title">{post.title}</h3>
            <p className="post-card-excerpt">{post.content.substring(0, 150)}...</p>
            <div className="post-card-footer" style={{borderTop: 'none'}}>
              <div 
                onClick={(e) => openProfile(e, post.author?.id)}
                style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}
              >
                {post.author?.avatar_url ? (
                  <img src={post.author.avatar_url} alt={post.author.username} className="avatar" style={{width: '28px', height: '28px'}} />
                ) : (
                  <div className="avatar-placeholder" style={{width: '28px', height: '28px', fontSize: '12px'}}>
                    {post.author?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <span style={{fontWeight: '600', color: 'var(--text)'}}>{post.author?.username || t('author')}</span>
              </div>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '14px'}}>
                <Icon name="calendar" className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </article>

      {/* Modal پروفایل - همون استایل PostView */}
      {showProfile && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(7, 7, 7, 0.22)',
          display: 'flex', 
          alignItems: 'center',
          backdropFilter: 'blur(3px)',
          justifyContent: 'center', 
          zIndex: 9999 
        }} onClick={closeProfile}>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px', 
            padding: '32px 24px', 
            maxWidth: '380px', 
            width: '90%', 
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)', 
            position: 'relative',
            animation: 'profileIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>

            <button onClick={closeProfile} style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>✕</button>

            {profileData ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt={profileData.username} style={{ width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', border: '3px solid #6366f1', display: 'block' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '800', margin: '0 auto 14px' }}>
                      {profileData.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#e2e5e9' }}>{profileData.username}</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#151616ce', borderRadius: '12px' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span style={{ fontSize: '14px', color: '#fcffffde', fontWeight: '500' }}>{profileData.email || '—'}</span>
                  </div>

                  <div style={{ padding: '12px 14px', background: '#151616ce', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#e9edf191' }}>Bio</span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#f7f9fcdc', lineHeight: '1.6', display: 'block' }}>{profileData.bio || '—'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#151616ce', borderRadius: '12px' }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#6366f1" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                    </svg>
                    {profileData.github_url ? (
                      <a href={profileData.github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
                        {profileData.github_url.replace('https://github.com/', '@')}
                      </a>
                    ) : (
                      <span style={{ fontSize: '14px', color: '#94a3b8' }}>—</span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center' }}>User not found</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;

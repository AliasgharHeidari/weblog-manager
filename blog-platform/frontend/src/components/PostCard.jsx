import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const detectDirection = (text) => {
  const persianCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
  return persianCount > englishCount ? 'rtl' : 'ltr';
};

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
            <h3 className="post-card-title" style={{
              direction: detectDirection(post.title),
              textAlign: detectDirection(post.title) === 'rtl' ? 'right' : 'left',
              unicodeBidi: 'plaintext'
            }}>
              {post.title}
            </h3>
            <p className="post-card-excerpt" style={{
              direction: detectDirection(post.content),
              textAlign: detectDirection(post.content) === 'rtl' ? 'right' : 'left',
              unicodeBidi: 'plaintext'
            }}>
              {post.content.substring(0, 150)}...
            </p>
            <div className="post-card-footer" style={{borderTop: 'none'}}>
              <div 
                className="post-card-author"
                onClick={(e) => openProfile(e, post.author?.id)}
                style={{cursor: 'pointer'}}
              >
                {post.author?.avatar_url ? (
                  <img src={post.author.avatar_url} alt={post.author.username} className="avatar" style={{width: '28px', height: '28px'}} />
                ) : (
                  <div className="avatar-placeholder" style={{width: '28px', height: '28px', fontSize: '12px'}}>
                    {post.author?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <span>{post.author?.username || t('author')}</span>
              </div>
              <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '14px'}}>
                <Icon name="calendar" className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      </article>

      {/* Modal پروفایل */}
      {showProfile && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={closeProfile}
        >
          <div 
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '420px',
              width: '90%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              position: 'relative',
              border: '1px solid var(--border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProfile}
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
                fontSize: '18px',
                color: 'var(--text-secondary)'
              }}
            >
              ✕
            </button>

            {profileData && (
              <div>
                <div style={{textAlign: 'center', marginBottom: '32px'}}>
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt={profileData.username} style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      margin: '0 auto 16px',
                      border: '4px solid var(--primary)'
                    }} />
                  ) : (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '40px',
                      fontWeight: '800',
                      margin: '0 auto 16px'
                    }}>
                      {profileData.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  <h2 style={{fontSize: '24px', fontWeight: '800', color: 'var(--text)'}}>
                    {profileData.username}
                  </h2>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--surface-hover)',
                    borderRadius: '12px'
                  }}>
                    <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', minWidth: '60px'}}>
                      Email:
                    </span>
                    <span style={{fontSize: '14px', color: 'var(--text)'}}>
                      {profileData.email || 'Not set'}
                    </span>
                  </div>

                  <div style={{
                    padding: '12px 16px',
                    background: 'var(--surface-hover)',
                    borderRadius: '12px'
                  }}>
                    <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px'}}>
                      Bio:
                    </span>
                    <span style={{fontSize: '14px', color: 'var(--text)', lineHeight: '1.6'}}>
                      {profileData.bio || 'No bio'}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'var(--surface-hover)',
                    borderRadius: '12px'
                  }}>
                    <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', minWidth: '60px'}}>
                      GitHub:
                    </span>
                    {profileData.github_url ? (
                      <a href={profileData.github_url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '14px',
                        color: 'var(--primary)',
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}>
                        {profileData.github_url.replace('https://github.com/', '@')}
                      </a>
                    ) : (
                      <span style={{fontSize: '14px', color: 'var(--text-secondary)'}}>Not set</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;

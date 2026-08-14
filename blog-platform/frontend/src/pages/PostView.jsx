import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostService from '../services/post.service';
import Icon from '../components/Icon';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
    const { t } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await PostService.getPost(id);
        setPost(postData);
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openProfile = async (authorId) => {
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-view-container" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>{t('postNotFound')}</p>
      </div>
    );
  }

  const renderContent = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        let code = part.replace(/^```/g, '').replace(/```$/g, '').trim();
        return (
          <div key={index} className="code-block-container">
            <div className="code-block-header">
              <div className="code-block-header-left">
                <span className="mac-dot mac-dot-red"></span>
                <span className="mac-dot mac-dot-yellow"></span>
                <span className="mac-dot mac-dot-green"></span>
              </div>
              <button className="code-block-copy-btn" onClick={() => handleCopy(code, index)}>
                {copiedCode === index ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre><code>{code}</code></pre>
          </div>
        );
      }
      return part.split('\n').map((paragraph, pIndex) => {
        if (!paragraph) return null;
        return <p key={`${index}-${pIndex}`} style={{ marginBottom: '20px' }}>{paragraph}</p>;
      });
    });
  };

  return (
    <div>
      <div className="post-view-container">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '24px', fontSize: '16px', fontWeight: '500', whiteSpace: 'nowrap' }}>
          <Icon name="arrow-left" style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap' }}>{t('back')}</span>
        </Link>

        {post.image_url && <img src={post.image_url} alt={post.title} className="post-view-image" />}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <span className="badge badge-primary">{post.section}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            <Icon name="calendar" className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <h1 className="post-view-title">{post.title}</h1>

        <div className="post-view-author" style={{ cursor: 'pointer' }} onClick={() => openProfile(post.author?.id)}>
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt={post.author.username} className="avatar" style={{ width: '48px', height: '48px' }} />
          ) : (
            <div className="avatar-placeholder" style={{ width: '48px', height: '48px', fontSize: '20px' }}>
              {post.author?.username?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p style={{ fontWeight: '600' }}>{post.author?.username || 'Unknown'}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{t('author')}</p>
          </div>
        </div>

        <div className="post-view-content">{renderContent(post.content)}</div>
      </div>

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
      position: 'relative' 
    }} onClick={(e) => e.stopPropagation()}>

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
    </div>
  );
};

export default PostView;

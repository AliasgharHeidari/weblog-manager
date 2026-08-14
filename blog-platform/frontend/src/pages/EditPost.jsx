import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostService from '../services/post.service';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [section, setSection] = useState('');
  const [published, setPublished] = useState(true);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await PostService.getPost(id);
        setTitle(post.title);
        setContent(post.content);
        setSection(post.section);
        setPublished(post.published);
        if (post.image_url) setImagePreview(post.image_url);
      } catch (err) {
        setError('Failed to fetch post');
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await PostService.updatePost(id, { title, content, section, published, image });
      navigate('/admin');
    } catch (err) {
      setError('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', padding: '48px 24px'}}>
      <h1 className="dashboard-title" style={{marginBottom: '32px'}}>{t('editPost')}</h1>

      {error && (
        <div className="auth-error">
          <Icon name="info" className="w-5 h-5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" style={{background: 'var(--surface)', padding: '32px', borderRadius: 'var(--radius-lg)'}}>
        <div className="form-group">
          <label className="form-label">{t('title')}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
        </div>
        <div className="form-group">
          <label className="form-label">{t('section')}</label>
          <input type="text" value={section} onChange={(e) => setSection(e.target.value)} className="input-field" required />
        </div>
        <div className="form-group">
          <label className="form-label">{t('content')}</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="10" className="input-field" required />
        </div>
        <div className="form-group">
          <label className="form-label">{t('image')}</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="input-field" />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" style={{width: '100%', maxWidth: '400px', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginTop: '16px'}} />
          )}
        </div>
        <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '8px'}}>
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} style={{width: '20px', height: '20px'}} />
          <label className="form-label">{t('published')}</label>
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
          <button type="button" onClick={() => navigate('/admin')} className="btn-secondary">{t('cancel')}</button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? t('saving') : t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;

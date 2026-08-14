import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import PostService from '../services/post.service';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await PostService.getSections();
        setSections(sectionsData);
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      }
    };
    fetchSections();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await PostService.getPosts(selectedSection);
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [selectedSection]);

  return (
    <div className="home-container">
      {/* Hero با تصویر عریض */}
      <div style={{
        width: '100%',
        height: '300px',
        borderRadius: '20px',
        overflow: 'hidden',
        marginBottom: '25px',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <img 
          src="./src/pics/image1.png"
          alt="Blog Hero"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Overlay برای خوانایی */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))'
        }} />
      </div>

      <div className="filter-container">
        <button
          onClick={() => setSelectedSection('')}
          className={`filter-btn ${selectedSection === '' ? 'active' : ''}`}
        >
          {t('allPosts')}
        </button>
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={`filter-btn ${selectedSection === section ? 'active' : ''}`}
          >
            {section}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '64px 0'}}>
          <p style={{color: 'var(--text-secondary)', fontSize: '18px'}}>{t('noPosts')}</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;

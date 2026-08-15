import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostService from '../services/post.service';
import Icon from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsData = await PostService.getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const updatedPost = await PostService.togglePublish(id);
      setPosts(posts.map(p => p.id === id ? updatedPost : p));
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await PostService.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 16px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          color: 'var(--text)',
          margin: 0
        }}>
          {t('dashboard')}
        </h1>
        <Link to="/admin/create" className="btn-primary" style={{padding: '10px 20px', fontSize: '14px'}}>
          <Icon name="plus" style={{width: '18px', height: '18px'}} />
          {t('createPost')}
        </Link>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          background: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}>
          <p style={{color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '16px'}}>
            {t('noPostsYet')}
          </p>
          <Link to="/admin/create" className="btn-primary">
            {t('createFirstPost')}
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div style={{
            display: 'none',
            '@media (minWidth: 768px)': { display: 'block' }
          }} className="desktop-table">
            <div style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr style={{background: 'var(--surface-hover)'}}>
                    <th style={{padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)'}}>
                      {t('title')}
                    </th>
                    <th style={{padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)'}}>
                      {t('section')}
                    </th>
                    <th style={{padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)'}}>
                      Status
                    </th>
                    <th style={{padding: '14px 16px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} style={{borderTop: '1px solid var(--border)'}}>
                      <td style={{padding: '14px 16px', fontWeight: '500', color: 'var(--text)', fontSize: '14px'}}>
                        {post.title}
                      </td>
                      <td style={{padding: '14px 16px'}}>
                        <span className="badge badge-primary">{post.section}</span>
                      </td>
                      <td style={{padding: '14px 16px'}}>
                        <button
                          onClick={() => handleTogglePublish(post.id)}
                          className={`badge ${post.published ? 'badge-success' : 'badge-muted'}`}
                          style={{
                            cursor: 'pointer',
                            border: 'none',
                            fontSize: '12px',
                            padding: '6px 12px'
                          }}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{padding: '14px 16px'}}>
                        <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center'}}>
                          <Link
                            to={`/admin/edit/${post.id}`}
                            style={{
                              color: 'var(--primary)',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              textDecoration: 'none'
                            }}
                          >
                            <Icon name="edit" style={{width: '14px', height: '14px'}} />
                            Edit
                          </Link>
                          {deleteConfirm === post.id ? (
                            <div style={{display: 'flex', gap: '6px'}}>
                              <button
                                onClick={() => handleDelete(post.id)}
                                style={{
                                  color: '#ef4444',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: 'transparent',
                                  fontWeight: '600'
                                }}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                  color: 'var(--text-secondary)',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '13px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: 'transparent'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(post.id)}
                              style={{
                                color: '#ef4444',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                border: 'none',
                                cursor: 'pointer',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Icon name="trash" style={{width: '14px', height: '14px'}} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: 'var(--surface)',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px'}}>
                  <h3 style={{fontSize: '15px', fontWeight: '600', color: 'var(--text)', margin: 0, flex: 1}}>
                    {post.title}
                  </h3>
                  <button
                    onClick={() => handleTogglePublish(post.id)}
                    className={`badge ${post.published ? 'badge-success' : 'badge-muted'}`}
                    style={{cursor: 'pointer', border: 'none', fontSize: '11px', flexShrink: 0}}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </div>
                
                <div style={{marginBottom: '12px'}}>
                  <span className="badge badge-primary" style={{fontSize: '11px'}}>{post.section}</span>
                </div>
                
                <div style={{display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px'}}>
                  <Link
                    to={`/admin/edit/${post.id}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      color: 'var(--primary)',
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      background: 'var(--surface-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Icon name="edit" style={{width: '14px', height: '14px'}} />
                    Edit
                  </Link>
                  {deleteConfirm === post.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(post.id)}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          color: '#fff',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          background: '#ef4444',
                          fontWeight: '600'
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          color: 'var(--text-secondary)',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'var(--surface-hover)'
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(post.id)}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        color: '#ef4444',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'var(--surface-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <Icon name="trash" style={{width: '14px', height: '14px'}} />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

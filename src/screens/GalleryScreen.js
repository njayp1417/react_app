import React, { useState, useEffect } from 'react';
import { supabase } from '../firebase.config';
import GalaxyBackground from '../components/GalaxyBackground';
import { processSecureFile } from '../utils/security';
import './GalleryScreen.css';

export default function GalleryScreen() {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');

  // Initial media from Nife folder
  const initialMedia = [
    { id: 1, type: 'image', url: '/nife-images/beauty_4.jpg', title: 'Beautiful Moments', category: 'memories' },
    { id: 2, type: 'image', url: '/nife-images/beauty_5.jpg', title: 'Sweet Times', category: 'memories' },
    { id: 3, type: 'image', url: '/nife-images/beauty_6.jpg', title: 'Love Captured', category: 'memories' },
    { id: 4, type: 'image', url: '/nife-images/dont_play_1.jpg', title: 'Fun Moments', category: 'fun' },
    { id: 5, type: 'image', url: '/nife-images/dont_play.jpg', title: 'Playful Times', category: 'fun' },
    { id: 6, type: 'image', url: '/nife-images/memory_1.jpg', title: 'Memory Lane', category: 'memories' },
    { id: 7, type: 'image', url: '/nife-images/memory_2.jpg', title: 'Precious Moments', category: 'memories' },
    { id: 8, type: 'image', url: '/nife-images/memory_3.jpg', title: 'Together Forever', category: 'memories' },
    { id: 9, type: 'image', url: '/nife-images/memory_4.jpg', title: 'Love Story', category: 'memories' },
    { id: 10, type: 'video', url: '/nife-videos/gangstar.mp4', title: 'Gangstar Vibes', category: 'videos' },
    { id: 11, type: 'video', url: '/nife-videos/hero.mp4', title: 'Hero Moments', category: 'videos' },
    { id: 12, type: 'video', url: '/nife-videos/swagger.mp4', title: 'Swagger Mode', category: 'videos' }
  ];

  useEffect(() => {
    setMedia(initialMedia);
    loadSupabaseMedia();
  }, []);

  const loadSupabaseMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const supabaseMedia = data.map(item => ({
          id: `sb_${item.id}`,
          type: item.url.includes('.mp4') ? 'video' : 'image',
          url: item.url,
          title: item.caption || 'Uploaded Media',
          category: item.category || 'uploads',
          uploadedBy: item.uploaded_by
        }));
        setMedia(prev => [...prev, ...supabaseMedia]);
      }
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Process file securely (validation + watermark + compression)
      const secureFile = await processSecureFile(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, secureFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      await supabase.from('photos').insert({
        url: publicUrl,
        uploaded_by: 'user',
        caption: file.name,
        category: 'uploads'
      });

      const newMedia = {
        id: `new_${Date.now()}`,
        type: file.type.startsWith('video') ? 'video' : 'image',
        url: publicUrl,
        title: file.name,
        category: 'uploads'
      };

      setMedia(prev => [newMedia, ...prev]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredMedia = media.filter(item => 
    filter === 'all' || item.category === filter
  );

  const categories = [
    { key: 'all', label: 'All Media', count: media.length },
    { key: 'memories', label: 'Memories', count: media.filter(m => m.category === 'memories').length },
    { key: 'videos', label: 'Videos', count: media.filter(m => m.category === 'videos').length },
    { key: 'fun', label: 'Fun Times', count: media.filter(m => m.category === 'fun').length },
    { key: 'uploads', label: 'Uploads', count: media.filter(m => m.category === 'uploads').length }
  ];

  return (
    <div className="gallery-container">
      <GalaxyBackground />
      
      <div className="gallery-header">
        <h1 className="gallery-title">
          <span className="title-nelson">OUR</span>
          <span className="title-heart">◆</span>
          <span className="title-juliana">GALLERY</span>
        </h1>
        <p className="gallery-subtitle">Memories Across Continents</p>
      </div>

      <div className="gallery-controls">
        <div className="filter-tabs">
          {categories.map(category => (
            <button
              key={category.key}
              className={`filter-tab ${filter === category.key ? 'active' : ''}`}
              onClick={() => setFilter(category.key)}
            >
              <span className="tab-label">{category.label}</span>
              <span className="tab-count">{category.count}</span>
            </button>
          ))}
        </div>

        <div className="upload-section">
          <input
            type="file"
            id="file-upload"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="upload-btn">
            {uploading ? '◇ Uploading...' : '◆ Add Media'}
          </label>
        </div>
      </div>

      <div className="media-grid">
        {filteredMedia.map(item => (
          <div 
            key={item.id} 
            className="media-item"
            onClick={() => setSelectedMedia(item)}
          >
            <div className="media-thumbnail">
              {item.type === 'video' ? (
                <video 
                  src={item.url} 
                  className="media-preview"
                  muted
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => e.target.pause()}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="media-preview"
                  loading="lazy"
                />
              )}
              <div className="media-overlay">
                <div className="media-type">
                  {item.type === 'video' ? '▶' : '◉'}
                </div>
              </div>
            </div>
            <div className="media-info">
              <h4 className="media-title">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <h3>No media found</h3>
          <p>Upload some photos or videos to get started</p>
        </div>
      )}

      {/* Media Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedMedia(null)}>
              ✕
            </button>
            <div className="modal-media">
              {selectedMedia.type === 'video' ? (
                <video 
                  src={selectedMedia.url} 
                  controls
                  className="modal-video"
                  autoPlay
                />
              ) : (
                <img 
                  src={selectedMedia.url} 
                  alt={selectedMedia.title}
                  className="modal-image"
                />
              )}
            </div>
            <div className="modal-info">
              <h3>{selectedMedia.title}</h3>
              <p className="media-category">{selectedMedia.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
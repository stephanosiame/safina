import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import '../styles/pages.css';

const Home = () => {
  const navigate = useNavigate();
  
  // Sample recommendation blocks
  const recommendationBlocks = [
    { id: 'A', title: 'Block A' },
    { id: 'B', title: 'Block B' },
    { id: 'C', title: 'Block C' }
  ];

  const handleBlockClick = (blockId) => {
    console.log(`Clicked block ${blockId}`);
    // Navigate to specific content or action based on block
    navigate(`/content/${blockId}`);
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <div className="content-area">
          <div className="content-header">
            <h2>Recommendation AREA</h2>
          </div>
          
          <div className="recommendation-blocks">
            {recommendationBlocks.map((block) => (
              <div 
                key={block.id} 
                className="recommendation-block"
                onClick={() => handleBlockClick(block.id)}
              >
                <div className="block-content">
                  {/* Placeholder for block content */}
                </div>
                <div className="block-title">
                  {block.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="navigation-controls">
        <div className="nav-arrows">
          <div className="nav-arrow up">↑</div>
          <div className="nav-arrow left">←</div>
          <div className="nav-arrow right">→</div>
          <div className="nav-arrow down">↓</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
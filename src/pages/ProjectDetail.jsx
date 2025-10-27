// src/pages/ProjectDetail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import AdvancedFooter from '../components/AdvancedFooter';
import { getProjectBySlug } from '../data/projectsData';
import './ProjectDetail.css';

// Individual Image Component with separate Intersection Observer
const GalleryImage = ({ image, alt, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animate in when 60% of the image is visible
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setIsVisible(true);
        } 
        // Animate out when less than 20% is visible (scrolling up)
        else if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
          setIsVisible(false);
        }
      },
      {
        threshold: [0, 0.2, 0.6, 1],
        rootMargin: '-50px 0px -50px 0px'
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={imageRef}
      className={`gallery-image ${className} ${isVisible ? 'animated' : ''}`}
      style={{ transitionDelay: isVisible ? `${delay}s` : '0s' }}
    >
      <img 
        src={image} 
        alt={alt}
        loading="lazy"
      />
    </div>
  );
};

// CrossGallery Component with individual image observers
const CrossGallery = ({ images, projectTitle }) => {
  // Ensure we have exactly 5 images for the cross layout
  const galleryImages = images.slice(0, 5);

  return (
    <section className="cross-gallery">
      <div className="cross-gallery-container">
        {/* Top Left Image - appears first when scrolling down */}
        <GalleryImage 
          image={galleryImages[0]} 
          alt={`${projectTitle} - View 1`}
          className="image-top-left"
          delay={0.1}
        />

        {/* Top Right Image - appears second */}
        <GalleryImage 
          image={galleryImages[1]} 
          alt={`${projectTitle} - View 2`}
          className="image-top-right"
          delay={0.2}
        />

        {/* Center Image - appears third */}
        <GalleryImage 
          image={galleryImages[4]} 
          alt={`${projectTitle} - Center View`}
          className="image-center"
          delay={0.3}
        />

        {/* Bottom Left Image - appears fourth */}
        <GalleryImage 
          image={galleryImages[2]} 
          alt={`${projectTitle} - View 3`}
          className="image-bottom-left"
          delay={0.4}
        />

        {/* Bottom Right Image - appears last */}
        <GalleryImage 
          image={galleryImages[3]} 
          alt={`${projectTitle} - View 4`}
          className="image-bottom-right"
          delay={0.5}
        />
      </div>
    </section>
  );
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar opacity
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Add project detail class and scrolled class based on scroll
    document.body.classList.add('project-detail-page');
    if (scrolled) {
      document.body.classList.add('project-nav-scrolled');
    } else {
      document.body.classList.remove('project-nav-scrolled');
    }

    const foundProject = getProjectBySlug(slug);
    
    if (!foundProject) {
      setLoading(false);
      return;
    }

    setProject(foundProject);

    // Auto-rotate images
    const interval = setInterval(() => {
      if (foundProject?.images) {
        setCurrentImageIndex(prev => 
          prev === foundProject.images.length - 1 ? 0 : prev + 1
        );
      }
    }, 4000);

    setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => {
      clearInterval(interval);
      document.body.classList.remove('project-detail-page', 'project-nav-scrolled');
    };
  }, [slug, scrolled]);

  if (loading) {
    return (
      <div className="project-detail">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <div style={{ padding: '100px 20px', textAlign: 'center', color: '#fff' }}>
          <h1>Project Not Found</h1>
          <Link to="/projects" style={{ color: '#fff', textDecoration: 'none' }}>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Simple content variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      className="project-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="project-hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="project-hero-bg"
            style={{ backgroundImage: `url(${project.images[currentImageIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        
        <div className="project-hero-content">
          <motion.div
            className="hero-text"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <h1>{project.title}</h1>
            <p className="hero-subtitle">{project.description}</p>
          </motion.div>

          <motion.div 
            className="project-meta-hero"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="meta-grid">
              <div className="meta-item">
                <span className="meta-label">YEAR</span>
                <span className="meta-value">{project.year}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">LOCATION</span>
                <span className="meta-value">{project.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">CATEGORY</span>
                <span className="meta-value">{project.category.toUpperCase()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">AREA</span>
                <span className="meta-value">{project.area}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Content */}
      <section className="project-content-detailed">
        <div className="content-grid">
          {/* Main Content */}
          <div className="main-content">
            <motion.div 
              className="content-section"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
            >
              <h2>PROJECT OVERVIEW</h2>
              <p>{project.fullDescription}</p>
            </motion.div>

            <motion.div 
              className="content-section"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <h2>THE CHALLENGE</h2>
              <p>{project.challenge}</p>
            </motion.div>

            <motion.div 
              className="content-section"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
            >
              <h2>OUR SOLUTION</h2>
              <p>{project.solution}</p>
              
              <div className="project-tech">
                <h3>KEY FEATURES</h3>
                <div className="tech-tags">
                  {project.tags.map((tag, index) => (
                    <motion.span 
                      key={index} 
                      className="tech-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="project-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="sidebar-section">
              <h3>PROJECT DETAILS</h3>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">CLIENT</span>
                  <span className="detail-value">{project.client}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">DURATION</span>
                  <span className="detail-value">{project.duration}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">AREA</span>
                  <span className="detail-value">{project.area}</span>
                </div>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>PROJECT TEAM</h3>
              <div className="team-list">
                {project.team.map((member, index) => (
                  <div key={index} className="team-member">
                    {member}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cross-Shaped Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 style={{
            textAlign: 'center',
            fontSize: '1.8rem',
            marginBottom: '40px',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            PROJECT GALLERY
          </h2>
          <CrossGallery images={project.images} projectTitle={project.title} />
        </motion.div>

        {/* Single Back to Projects Button at Bottom */}
        <motion.div 
          className="project-navigation"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link to="/projects" className="back-to-projects-btn">
            <span className="btn-arrow">←</span>
            BACK TO PROJECTS
          </Link>
        </motion.div>
      </section>

      <AdvancedFooter />
    </motion.div>
  );
};

export default ProjectDetail;
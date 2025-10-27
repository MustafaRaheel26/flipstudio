import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AdvancedFooter from "../components/AdvancedFooter";
import {
  PROJECTS_DATA,
  getProjectsByCategory,
  CATEGORIES,
} from "../data/projectsData";
import "./ProjectsPage.css";

const ProjectsPage = () => {
  const [activeCategory, setActiveCategory] = useState("restaurants");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProjects, setCurrentProjects] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    setCurrentProjects(getProjectsByCategory(activeCategory));
  }, []);

  const handleCategoryChange = (categoryId) => {
    setIsLoading(true);
    setActiveCategory(categoryId);

    setTimeout(() => {
      const projects = getProjectsByCategory(categoryId);
      setCurrentProjects(projects);
      setIsLoading(false);
    }, 400);
  };

  return (
    <motion.div
      className="projects-main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Sticky Category Slider (No Arrows) */}
      <section className="categories-section">
        <div className="categories-container" ref={sliderRef}>
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              className={`category-btn ${
                activeCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="btn-text">
                {category.name.split("").map((letter, i) => (
                  <span key={i} className="btn-letter">
                    {letter}
                  </span>
                ))}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Projects Gallery */}
      <section className="projects-grid-section">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-spinner"
            >
              <div className="spinner"></div>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              className="projects-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <AdvancedFooter />
    </motion.div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/projects/${project.slug}`} className="project-card-link">
        <div className="project-image-container">
          <img src={project.image} alt={project.title} className="project-image" />
          <div className="project-overlay">
            <div className="project-info">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-meta">
                <span className="project-year">{project.year}</span>
                <span className="project-location">{project.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectsPage;
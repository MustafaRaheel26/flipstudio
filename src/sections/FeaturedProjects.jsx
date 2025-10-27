import React, { useRef } from "react";
import { motion, useScroll, useTransform, easeInOut } from "framer-motion";
import "./FeaturedProjects.css";

import project1 from "../assets/caliberplaza-waresquare.png";
import project2 from "../assets/gaf-salesexperiencecenter.png";
import project3 from "../assets/mubadala-businesslifestylecorporateoffice.png";
import project4 from "../assets/taj-tajresidencies.png";

const projects = [
  { id: 1, title: "CALIBER PLAZA - WARESQUARE", image: project1 },
  { id: 2, title: "GAF - SALES EXPERIENCE CENTER", image: project2 },
  { id: 3, title: "MUBADALA - BUSINESS LIFESTYLE CORPORATE OFFICE", image: project3 },
  { id: 4, title: "TAJ - TAJ RESIDENCES", image: project4 },
];

export default function FeaturedProjects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const total = projects.length + 1;

  // Intro fade-in/out timing
  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0], {
    ease: easeInOut,
  });

  return (
    <section className="featured-projects-section" ref={containerRef}>
      {/* Intro black screen */}
      <motion.div className="intro-layer" style={{ opacity: introOpacity }}>
        <h1 className="intro-title">FEATURED PROJECTS</h1>
      </motion.div>

      {/* Projects scroll */}
      <div className="featured-projects-container">
        {projects.map((project, index) => {
          const start = (index + 1) / total;
          const end = (index + 2) / total;

          // Controls for image fade (fixed screen time)
          const imageOpacity = useTransform(
            scrollYProgress,
            [start - 0.04, start + 0.02, end - 0.05, end + 0.02],
            [0, 1, 1, 0],
            { ease: easeInOut }
          );

          // Keep images still
          const imageY = useTransform(scrollYProgress, [start, end], ["0%", "0%"]);

          // Text fade slightly delayed to feel natural
          const textOpacity = useTransform(
            scrollYProgress,
            [start + 0.03, start + 0.08, end - 0.12, end - 0.07],
            [0, 1, 1, 0],
            { ease: easeInOut }
          );

          const textY = useTransform(scrollYProgress, [start, end], ["0%", "0%"]);

          return (
            <motion.div
              key={project.id}
              className="project-layer"
              style={{
                opacity: imageOpacity,
                zIndex: total - index,
              }}
            >
              <motion.div
                className="project-background"
                style={{
                  backgroundImage: `url(${project.image})`,
                  y: imageY,
                }}
              />

              <div className="project-content">
                <motion.div
                  className="text-content"
                  style={{
                    y: textY,
                    opacity: textOpacity,
                  }}
                >
                  <h2 className="project-title">{project.title}</h2>
                  <p className="explore-text">EXPLORE</p>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

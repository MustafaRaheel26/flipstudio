// src/sections/ServicesSlider.jsx - UPDATED BUTTON TEXT
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./ServicesSlider.css";

import project1 from "../assets/Projects-1.jpeg";
import project2 from "../assets/Projects-2.jpeg";
import project3 from "../assets/Projects-3.jpeg";
import project4 from "../assets/Projects-4.jpeg";
import project5 from "../assets/Projects-5.jpeg";

const SERVICES = [
  {
    id: 1,
    title: "BRAND & IDENTITY",
    image: project1,
    description: "Complete brand development including logo design, visual identity, and brand guidelines.",
    features: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy"],
  },
  {
    id: 2,
    title: "UX/UI DESIGN",
    image: project2,
    description: "User-centered design solutions for intuitive, engaging digital experiences.",
    features: ["User Research", "Wireframing", "Prototyping", "UI Design"],
  },
  {
    id: 3,
    title: "WEB DEVELOPMENT",
    image: project3,
    description: "Modern, responsive web development with cutting-edge technologies.",
    features: ["React/Next.js", "Responsive Design", "Performance", "Modern CSS"],
  },
  {
    id: 4,
    title: "PRODUCT STRATEGY",
    image: project4,
    description: "Strategic planning that aligns business goals with user needs.",
    features: ["Product Discovery", "Roadmapping", "User Stories", "MVP Planning"],
  },
  {
    id: 5,
    title: "MOTION DESIGN",
    image: project5,
    description: "Dynamic motion graphics and video content for brand storytelling.",
    features: ["Motion Graphics", "Video Production", "Animation", "Visual Effects"],
  },
];

export default function ServicesSlider() {
  const [currentFace, setCurrentFace] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cube rotation every 2.5s
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentFace((prev) => (prev + 1) % SERVICES.length);
      setFlippedCards({});
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const getCubeRotation = () => `rotateY(${currentFace * -72}deg)`;

  // Flip logic
  const handleCardFlip = (index, forceState) => {
    if (index !== currentFace) return;
    setFlippedCards((prev) => ({
      ...prev,
      [index]:
        typeof forceState === "boolean" ? forceState : !prev[index],
    }));
  };

  // Pause rotation on mobile when flipped
  useEffect(() => {
    if (isMobile) {
      const anyFlipped = Object.values(flippedCards).some(Boolean);
      setIsPaused(anyFlipped);
    }
  }, [flippedCards, isMobile]);

  return (
    <section className="services-section">
      <div className="services-inner">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          OUR SERVICES
        </motion.h2>

        <div
          className="services-cube-container"
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
        >
          <div className="cube-scene">
            <div
              className="cube"
              style={{
                transform: getCubeRotation(),
                transition: "transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)",
              }}
            >
              {SERVICES.map((service, index) => {
                const isActive = index === currentFace;
                const isFlipped = flippedCards[index];
                return (
                  <div key={service.id} className={`cube-face cube-face-${index}`}>
                    <div
                      className={`flip-card ${isActive ? "active-face" : ""} ${
                        isFlipped ? "flipped" : ""
                      }`}
                      onMouseEnter={() =>
                        !isMobile && isActive && handleCardFlip(index, true)
                      }
                      onMouseLeave={() =>
                        !isMobile && isActive && handleCardFlip(index, false)
                      }
                      onClick={() =>
                        isMobile && isActive && handleCardFlip(index)
                      }
                    >
                      <div className="flip-card-inner">
                        <div className="flip-card-front">
                          <img src={service.image} alt={service.title} />
                          <div className="service-title-overlay">
                            <h3>{service.title}</h3>
                            <div className="hint">
                              {isMobile ? "TAP FOR DETAILS" : "HOVER FOR DETAILS"}
                            </div>
                          </div>
                        </div>

                        <div className="flip-card-back">
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                          <ul>
                            {service.features.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                          {/* UPDATED: Button with consistent styling */}
                          <button className="cta-button">VIEW DETAILS →</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <motion.div 
            className="interaction-guide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {isMobile
              ? "TAP THE FRONT CARD TO SEE DETAILS"
              : "HOVER OVER THE FRONT CARD TO SEE DETAILS"}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
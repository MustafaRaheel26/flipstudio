// src/components/Cursor.jsx
import React, { useEffect, useRef } from "react";
import "./Cursor.css";

export default function Cursor() {
  const positionRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.classList.add("fs-cursor");
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let lastTarget = null;
    let rafId = null;

    // Smooth movement function
    const smoothMove = () => {
      // Smooth interpolation
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }
      rafId = requestAnimationFrame(smoothMove);
    };

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      positionRef.current = { x: e.clientX, y: e.clientY };
    }

    function onEnter(e) {
      const el = e.currentTarget;
      lastTarget = el;
      
      // Compute scaled size based on link width but clamp to [1, 1.6]
      const rect = el.getBoundingClientRect();
      const base = 44;
      const target = Math.min(Math.max(rect.width / base, 1.0), 1.6);
      cursor.style.setProperty("--fs-cursor-scale", target.toFixed(2));
      
      // Add hover class to cursor
      cursor.classList.add("fs-cursor--hover");
      
      // Special handling for logo
      if (el.classList.contains('fs-brand')) {
        el.classList.add("fs-brand--hovered");
        cursor.classList.add("fs-cursor--clickable");
      } 
      // For nav links
      else if (el.classList.contains('fs-link')) {
        el.classList.add("fs-link--hovered");
      }
      // For other clickable elements
      else if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('button')) {
        cursor.classList.add("fs-cursor--clickable", "fs-cursor--button");
      } else if (el.tagName === 'A' && !el.classList.contains('fs-link') && !el.classList.contains('fs-brand')) {
        cursor.classList.add("fs-cursor--clickable", "fs-cursor--link");
      } else if (el.classList.contains('project-card') || el.classList.contains('card')) {
        cursor.classList.add("fs-cursor--clickable");
      }
    }

    function onLeave(e) {
      const el = e.currentTarget;
      lastTarget = null;
      
      // Reset cursor scale
      cursor.style.setProperty("--fs-cursor-scale", 1);
      
      // Remove all hover classes from cursor
      cursor.classList.remove(
        "fs-cursor--hover", 
        "fs-cursor--clickable", 
        "fs-cursor--button", 
        "fs-cursor--link"
      );
      
      // Remove hover classes from elements
      if (el.classList.contains('fs-brand')) {
        el.classList.remove("fs-brand--hovered");
      } else if (el.classList.contains('fs-link')) {
        el.classList.remove("fs-link--hovered");
      }
    }

    function onMouseDown() {
      cursor.classList.add("fs-cursor--click");
    }

    function onMouseUp() {
      cursor.classList.remove("fs-cursor--click");
    }

    // Attach event listeners
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Hoverable elements
    const navLinks = document.querySelectorAll(".fs-link, .fs-hamburger, .fs-brand, .fs-mobile__link");
    const clickableElements = document.querySelectorAll(
      "button:not(.fs-hamburger), .btn, .button, a:not(.fs-link):not(.fs-brand):not(.fs-mobile__link), .project-card, .card, [data-cursor-hover]"
    );

    navLinks.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    clickableElements.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Start smooth animation
    smoothMove();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      
      navLinks.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      
      clickableElements.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      
      if (rafId) cancelAnimationFrame(rafId);
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
    };
  }, []);

  return null;
}
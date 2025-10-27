import React from "react";
import { motion } from "framer-motion";
import "./ContactPage.css";

export default function ContactPage() {
  return (
    <motion.div
      className="contact-sheet"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="contact-container">
        {/* Left Section */}
        <div className="contact-left">
          <h1 className="contact-heading">
            LET’S
            <br />
            CONNECT
          </h1>
        </div>

        {/* Right Section */}
        <div className="contact-right">
          <h2 className="contact-subtitle">
            Tell us a little bit about yourself and we’ll get back to you as soon as we can.
          </h2>

          <form className="contact-form">
            <div className="form-group">
              <input type="text" id="name" required placeholder=" " />
              <label htmlFor="name">Name*</label>
            </div>

            <div className="form-group">
              <input type="email" id="email" required placeholder=" " />
              <label htmlFor="email">Email*</label>
            </div>

            <div className="form-group">
              <textarea id="message" rows="4" required placeholder=" "></textarea>
              <label htmlFor="message">Message*</label>
            </div>

            <motion.button
              type="submit"
              className="contact-submit"
              whileHover={{
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="send-text">Send</span>
              <motion.span
                className="send-line"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                  delay: 1
                }}
              ></motion.span>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

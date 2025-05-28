// src/components/PageLoader.jsx
import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/pageloader.json"; // rename or match your filename

export default function PageLoader() {
  return (
    <div
      style={{
        background: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie
        animationData={animationData}
        style={{ width: 600, height: 600 }}
        loop
        autoplay
      />
      <p style={{ marginTop: "1rem", fontSize: "1.2rem", color: "#333" }}>
        Laddar Project Streamline...
      </p>
    </div>
  );
}

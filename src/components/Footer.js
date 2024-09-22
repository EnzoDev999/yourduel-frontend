import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white h-20">
      <div className="max-w-screen-xl mx-auto px-4 flex justify-center items-center h-full space-x-8">
        <a href="/" className="hover:underline">
          Conditions d’utilisation
        </a>
        <a href="/" className="hover:underline">
          Politique et confidentialité
        </a>
        <a href="/" className="hover:underline">
          À propos
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Twitter
        </a>
        <a href="mailto:contact@yourduel.fr" className="hover:underline">
          contact@yourduel.fr
        </a>
      </div>
    </footer>
  );
};

export default Footer;

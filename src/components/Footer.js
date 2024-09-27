import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white h-auto md:h-20 flex-shrink-0 py-4 md:py-0">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center h-full space-y-4 md:space-y-0 md:space-x-8">
        <a href="/" className="hover:underline text-center md:text-left">
          Conditions d’utilisation
        </a>
        <a href="/" className="hover:underline text-center md:text-left">
          Politique et confidentialité
        </a>
        <a href="/" className="hover:underline text-center md:text-left">
          À propos
        </a>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-center md:text-left"
        >
          Twitter
        </a>
        <a
          href="mailto:contact@yourduel.fr"
          className="hover:underline text-center md:text-left"
        >
          contact@yourduel.fr
        </a>
      </div>
    </footer>
  );
};

export default Footer;

// src/components/layout/Footer.jsx

import React from "react";
import { Facebook, Github, Linkedin, Twitter } from "lucide-react";

// STEP 1: Yahan component ko batayein ke woh 'setActiveTab' prop receive karega
const Footer = ({ setActiveTab }) => {
  const currentYear = new Date().getFullYear();

  // STEP 2: Yahan 'handleLinkClick' function ko define karein
  const handleLinkClick = (tabName) => {
    // Check karein ke function call ho raha hai ya nahi (optional)
    if (typeof setActiveTab === "function") {
      setActiveTab(tabName);
      // Main content area ko select kar ke top par scroll karein
      document.querySelector("main")?.scrollTo(0, 0);
    } else {
      console.error(
        "setActiveTab is not a function. Make sure you are passing it as a prop from App.jsx"
      );
    }
  };

  return (
    // mt-auto zyada behtar hai mt-40 se, taake yeh hamesha neeche rahe
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-40">
      <div className="max-w-7xl mx-auto py-8 px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <img
                src="https://i.ibb.co/ZphbmwRs/Chat-GPT-Image-Sep-13-2025-08-08-12-PM.png"
                alt="Project Logo"
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Project Management
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Streamlining your projects from start to finish.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <button
                      onClick={() => handleLinkClick("dashboard")}
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLinkClick("projects")}
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left"
                    >
                      Projects
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLinkClick("tasks")}
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left"
                    >
                      Tasks
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLinkClick("about")}
                      className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left"
                    >
                      About Us
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mt-8 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-2">
                  {/* YAHAN TABDEELI KI GAYI HAI */}
                  <li>
                    <button onClick={() => handleLinkClick('contact')} className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left">Contact</button>
                  </li>
                  <li>
                    <button onClick={() => handleLinkClick('faq')} className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left">FAQ</button>
                  </li>
                  <li>
                    <button onClick={() => handleLinkClick('privacy')} className="text-base text-gray-500 dark:text-gray-400 hover:text-blue-600 text-left">Privacy Policy</button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                  Follow Us
                </h3>
                <div className="flex space-x-6 mt-4">
                  <a
                    href="https://github.com/wasiqzahoor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="http://linkedin.com/in/wasiq-zahoor-bbab952b0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Project Management, Inc. All rights reserved by Chaudhary Wasiq Zahoor.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

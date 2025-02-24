# Project Title

A scalable web application built with React and TypeScript.

## Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

## Overview

This project is a modern web application developed using React and TypeScript, designed to control the functionalities of Resolume Arena through the provided Resolume API. The application leverages various packages and tools such as Vite for bundling, Tailwind CSS for styling, and React Router for client-side routing. The main goal is to create a maintainable and scalable codebase that makes it easy to manage and extend the control capabilities for Resolume Arena.

## Technologies

- **TypeScript**: v5.7.2
- **React**: v19.0.0
- **React DOM**: v19.0.0
- **React Router**: v7.1.5 (and related packages)
- **Vite**: v5.4.11
- **Tailwind CSS**: v4.0.5
- **Additional Packages**: `@tailwindcss/vite`, `vite-tsconfig-paths`, `isbot`, etc.
- **Package Manager**: npm

## Installation

Before running the project, ensure you have Node.js installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

- **Development Server**  
  Runs the app in development mode.
  ```bash
  npm run dev
  ```

- **Build**  
  Builds the app for production to the `dist` folder.
  ```bash
  npm run build
  ```

- **Preview**  
  Serves the production build locally.
  ```bash
  npm run preview
  ```

## Project Structure

A typical structure of the project might look like this:

your-repo/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   ├── pages/           # Pages for routing
│   ├── App.tsx          # Main React component
│   ├── index.tsx        # Entry point of the application
│   └── styles/          # Styles and Tailwind configuration
├── package.json         # Project configuration and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file

## Usage

After installing the dependencies and starting the development server, open your browser and navigate to [http://localhost:3000](http://localhost:3000) (or the port specified by the development server). Edit the code in the `src` folder and the browser will automatically refresh with your changes.

This application is intended to control various functionalities of Resolume Arena using the provided Resolume API. Customize the API endpoints and control logic as needed for your specific requirements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
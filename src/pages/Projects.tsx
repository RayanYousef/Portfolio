
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@components/ProjectCard';
import projectsContent from '@content/projects.json';

const Projects = () => {
  const { projects, pageTitle, pageDescription } = projectsContent;
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
            {pageTitle}
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as string)}
            className={`px-6 py-2 rounded-full font-orbitron text-sm transition-all duration-300 border ${
              selectedCategory === category
                ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(5,217,232,0.3)]'
                : 'bg-void/50 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

import { Link } from 'react-router-dom';

interface ProjectCardProps {
  id: string; // Added id prop
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: {
    demo?: string;
    github?: string;
  };
  delay: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, image, tags, links, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group glass-panel rounded-xl overflow-hidden hover:border-neon-pink/50 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <Link to={`/projects/${id}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-void/80 backdrop-blur-md rounded-full text-white hover:text-neon-cyan transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {links.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-void/80 backdrop-blur-md rounded-full text-white hover:text-neon-pink transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <Link to={`/projects/${id}`} className="block">
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2 group-hover:text-neon-pink transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-400 mb-4 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-neon-cyan"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

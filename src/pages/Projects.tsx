
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import projectsContent from '../content/projects.json';

const Projects = () => {
  const projects = projectsContent.projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    tags: project.tags,
    links: {
      demo: project.demoLink || "#",
      github: project.githubLink || "#"
    }
  }));

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
            {projectsContent.pageTitle}
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {projectsContent.pageDescription}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            {...project}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;

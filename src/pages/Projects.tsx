
import { motion } from 'framer-motion';
import ProjectCard from '@components/ProjectCard';
import projectsContent from '@content/projects.json';

const Projects = () => {
  const { projects, pageTitle, pageDescription } = projectsContent;

  const recentProjects = projects.filter(p => !p.category || p.category === 'Recent Projects');
  const toolsProjects = projects.filter(p => p.category === 'Tools');


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const Section = ({ title, items }: { title: string, items: typeof projects }) => (
    <div className="mb-20">
      <h2 className="text-3xl font-orbitron font-bold mb-8 text-white border-b border-white/10 pb-4 inline-block">
        {title}
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {items.map((project) => (
          <motion.div key={project.id} variants={item}>
            <ProjectCard
              project={project}
              delay={0}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

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
            {pageTitle}
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {pageDescription}
        </p>
      </motion.div>

      <Section title="Recent Projects" items={recentProjects} />
      <Section title="Tools & Systems" items={toolsProjects} />



    </div>
  );
};

export default Projects;

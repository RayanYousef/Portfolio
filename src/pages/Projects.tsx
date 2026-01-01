
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const projects = [
    {
      title: "Neon Racer 2077",
      description: "A high-speed endless runner set in a cyberpunk city. Features procedural generation and dynamic lighting.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Unity", "C#", "HDRP"],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Void Explorer",
      description: "Space exploration RPG with resource management and tactical combat.",
      image: "https://images.unsplash.com/photo-1614728853913-1e32005e3020?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Unreal Engine 5", "Blueprints", "C++"],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Pixel Quest",
      description: "A retro-style 2D platformer with metroidvania elements and challenging boss fights.",
      image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Godot", "GDScript", "Pixel Art"],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Cyber Defense",
      description: "Tower defense game where you protect the mainframe from viral attacks.",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["React", "WebGL", "Three.js"],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Echoes of the Past",
      description: "Narrative-driven puzzle game exploring memory and time.",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Unity", "C#", "Dialogue System"],
      links: {
        demo: "#",
        github: "#"
      }
    },
    {
      title: "Mecha Arena",
      description: "Multiplayer turn-based strategy game featuring customizable mechs.",
      image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Unity", "Mirror", "Multiplayer"],
      links: {
        demo: "#",
        github: "#"
      }
    }
  ];

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
            PROJECT_DATABASE
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A collection of my recent game development projects, prototypes, and experiments.
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

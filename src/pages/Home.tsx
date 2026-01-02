
import { motion } from 'framer-motion';
import { ArrowRight, Code, Gamepad, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import homeContent from '@content/home.json';

const iconMap: Record<string, React.ReactNode> = {
  gamepad: <Gamepad className="w-10 h-10 text-neon-pink" />,
  code: <Code className="w-10 h-10 text-neon-cyan" />,
  cpu: <Cpu className="w-10 h-10 text-purple-500" />,
};

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-neon-cyan font-orbitron tracking-widest text-lg md:text-xl mb-4 uppercase">
              {homeContent.subtitle}
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
              <span className="block text-white">{homeContent.titleLine1}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan animate-gradient-x">
                {homeContent.titleLine2}
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 font-light">
              {homeContent.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/projects"
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-300 bg-transparent border-2 border-neon-cyan hover:bg-neon-cyan/10 hover:box-shadow-neon overflow-hidden"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-neon-cyan rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative flex items-center gap-2">
                View Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-gray-300 transition-all duration-300 hover:text-white border-2 border-transparent hover:border-neon-pink/50"
            >
              Contact Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeContent.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="glass-panel p-8 rounded-xl hover:border-neon-cyan/50 transition-colors duration-300"
              >
                <div className="mb-4 p-3 bg-white/5 rounded-lg inline-block">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-xl font-orbitron font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

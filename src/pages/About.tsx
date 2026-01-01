
import { motion } from 'framer-motion';
import { Terminal, Database, Cpu, Layers } from 'lucide-react';

const About = () => {
  const skills = [
    { name: "Game Engines", items: ["Unity", "Unreal Engine 5", "Godot"], icon: <Layers className="w-6 h-6 text-neon-pink" /> },
    { name: "Languages", items: ["C#", "C++", "TypeScript", "Python"], icon: <Terminal className="w-6 h-6 text-neon-cyan" /> },
    { name: "Graphics", items: ["HLSL/GLSL", "Blender", "Photoshop"], icon: <Cpu className="w-6 h-6 text-purple-500" /> },
    { name: "Backend", items: ["Node.js", "Firebase", "PlayFab"], icon: <Database className="w-6 h-6 text-green-400" /> },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6">
            <span className="text-white">PLAYER</span>
            <span className="text-neon-cyan">_PROFILE</span>
          </h1>

          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <Cpu className="w-32 h-32 text-neon-pink animate-pulse" />
             </div>

             <p className="text-gray-300 text-lg leading-relaxed mb-6 relative z-10">
               Hi, I'm a passionate Game Developer with a knack for creating immersive digital experiences.
               My journey began with modding classic games, which eventually led me to dive deep into engine architecture and gameplay programming.
             </p>
             <p className="text-gray-300 text-lg leading-relaxed mb-6 relative z-10">
               I specialize in <span className="text-neon-cyan font-bold">gameplay mechanics</span>, <span className="text-neon-pink font-bold">AI systems</span>, and <span className="text-purple-400 font-bold">graphics programming</span>.
               When I'm not coding, you can find me analyzing level design in retro platformers or experimenting with procedural generation algorithms.
             </p>

             <div className="flex gap-4 mt-8">
               <div className="text-center">
                 <h3 className="text-3xl font-bold text-white">5+</h3>
                 <p className="text-xs text-gray-400 uppercase tracking-wider">Years Exp</p>
               </div>
               <div className="w-px bg-white/10"></div>
               <div className="text-center">
                 <h3 className="text-3xl font-bold text-white">12+</h3>
                 <p className="text-xs text-gray-400 uppercase tracking-wider">Shipped Games</p>
               </div>
               <div className="w-px bg-white/10"></div>
               <div className="text-center">
                 <h3 className="text-3xl font-bold text-white">∞</h3>
                 <p className="text-xs text-gray-400 uppercase tracking-wider">Coffee Consumed</p>
               </div>
             </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-right">
            <span className="text-white">SKILL</span>
            <span className="text-neon-pink">_TREE</span>
          </h2>

          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-void/50 border border-white/5 rounded-xl p-6 hover:border-neon-cyan/30 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-white/5 rounded-lg">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-white">{skill.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan text-sm font-medium rounded-full border border-neon-cyan/20">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;

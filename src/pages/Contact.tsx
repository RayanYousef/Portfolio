
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-4rem)] flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">INITIATE</span>
            <span className="block text-neon-pink">COMMUNICATION</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md">
            Interested in collaborating on a project or just want to talk about game design?
            My inbox is always open for new quests.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-4 group">
              <div className="p-4 glass-panel rounded-full group-hover:border-neon-cyan transition-colors">
                <Mail className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Email</p>
                <a href="mailto:rayanyoussef1993@gmail.com" className="text-xl text-white font-orbitron hover:text-neon-cyan transition-colors">
                  rayanyoussef1993@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-4 glass-panel rounded-full group-hover:border-neon-pink transition-colors">
                <MapPin className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider">Base</p>
                <p className="text-xl text-white font-orbitron">
                  Egypt
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex gap-6">
            <a href="https://github.com/RayanYousef" target="_blank" rel="noopener noreferrer" className="p-3 glass-panel rounded-lg hover:bg-white/10 hover:text-neon-cyan transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com/in/rayan-yousef" target="_blank" rel="noopener noreferrer" className="p-3 glass-panel rounded-lg hover:bg-white/10 hover:text-neon-pink transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-void/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-400">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-void/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-400">Quest Type</label>
              <select
                id="subject"
                className="w-full bg-void/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
              >
                <option>General Inquiry</option>
                <option>Freelance Project</option>
                <option>Job Opportunity</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-400">Transmission</label>
              <textarea
                id="message"
                rows={4}
                className="w-full bg-void/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-neon-pink to-neon-cyan text-void font-bold py-4 rounded-lg hover:shadow-[0_0_20px_rgba(5,217,232,0.5)] transition-shadow duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              SEND TRANSMISSION
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

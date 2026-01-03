
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

const Resume = () => {
    return (
        <div className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-24 h-24 bg-neon-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-neon-cyan/20">
                    <FileText className="w-12 h-12 text-neon-cyan" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    My Resume
                </h1>

                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                    Passionate Game Developer and Educational Application Engineer with over 7 years of experience in Unity, C#, and AI integration.
                </p>

                <a
                    href="/resume.pdf"
                    target="_blank"
                    className="inline-flex items-center px-8 py-4 bg-neon-pink hover:bg-neon-pink/80 rounded-full text-white font-bold text-lg transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)] hover:shadow-[0_0_30px_rgba(255,0,128,0.5)]"
                >
                    <Download className="w-6 h-6 mr-2" />
                    Download Resume
                </a>
            </motion.div>
        </div>
    );
};

export default Resume;

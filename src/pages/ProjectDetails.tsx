import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import projectsData from '@content/projects.json';
import type { Project } from '../types/index';

const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const project = projectsData.projects.find((p) => p.id === id) as Project | undefined;

    if (!project) {
        return (
            <div className="min-h-screen pt-32 text-center text-white">
                <h1 className="text-2xl">Project not found: {id}</h1>
                <p>Available IDs: {projectsData.projects.map((p) => p.id).join(', ')}</p>
            </div>
        );
    }

    const videoUrl = project.videoUrl;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Link
                to="/projects"
                className="inline-flex items-center text-neon-cyan hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Projects
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
                        {project.title}
                    </h1>

                    <div className="flex flex-wrap gap-3 mb-8">
                        {project.tags.map((tag: string) => (
                            <span
                                key={tag}
                                className="px-4 py-2 text-sm font-medium rounded-full bg-white/5 border border-white/10 text-neon-cyan"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
                        {project.description}
                    </p>
                </div>

                {/* Video / Main Display */}
                <div className="glass-panel p-2 rounded-2xl overflow-hidden mb-12 aspect-video bg-black/40">
                    {videoUrl ? (
                        <div className="w-full h-full relative">
                            {/* Check if it's a Google Drive URL */}
                            {videoUrl.includes('drive.google.com') ? (
                                <iframe
                                    src={videoUrl}
                                    width="100%"
                                    height="100%"
                                    className="w-full h-full"
                                    allow="autoplay; fullscreen"
                                    title={project.title}
                                ></iframe>
                            ) : (
                                // @ts-ignore
                                <ReactPlayer
                                    {...{
                                        url: videoUrl,
                                        width: "100%",
                                        height: "100%",
                                        controls: true,
                                        playing: true,
                                        muted: true
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-xl opacity-80"
                        />
                    )}
                </div>

                {/* Links */}
                <div className="flex gap-6 mb-16">
                    {project.githubLink && project.githubLink !== "#" && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all border border-white/10 hover:border-neon-cyan/50"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            View Source
                        </a>
                    )}
                    {project.demoLink && project.demoLink !== "#" && (
                        <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-neon-pink/20 hover:bg-neon-pink/30 rounded-lg text-white transition-all border border-neon-pink/20 hover:border-neon-pink/50"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Play Demo
                        </a>
                    )}
                </div>

                {/* Markdown Content */}
                {project.readme && (
                    <div className="glass-panel p-8 rounded-2xl mb-12">
                        <article className="prose prose-invert prose-lg max-w-none
                            prose-headings:text-neon-cyan prose-headings:font-orbitron
                            prose-a:text-neon-pink prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-white prose-code:text-neon-cyan
                            prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {project.readme}
                            </ReactMarkdown>
                        </article>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ProjectDetails;

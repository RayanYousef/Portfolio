import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
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

    // Helper to process markdown content
    let processedContent = project.readmeContent || project.description;

    // Fix relative image paths if githubLink is available
    if (project.githubLink && project.readmeContent) {
        // Extract repo info from githubLink
        // Expected formats:
        // https://github.com/Username/Repo/tree/Branch
        // https://github.com/Username/Repo

        let rawBaseUrl = '';
        const ghUrl = project.githubLink;

        if (ghUrl.includes('/tree/')) {
            // e.g. .../My-Learning-Voyage/tree/Neural-Dominion
            rawBaseUrl = ghUrl.replace('github.com', 'raw.githubusercontent.com').replace('/tree/', '/');
        } else {
            // e.g. .../MVVM-Unity -> defaults to main usually, but let's assume main
            rawBaseUrl = ghUrl.replace('github.com', 'raw.githubusercontent.com') + '/main';
        }

        // Replace src="Images/..." with src="rawBaseUrl/Images/..."
        // Handling both double and single quotes
        processedContent = processedContent.replace(/src="Images\//g, `src="${rawBaseUrl}/Images/`);
        processedContent = processedContent.replace(/src='Images\//g, `src='${rawBaseUrl}/Images/`);

        // Also handle standard markdown images ![alt](Images/...)
        processedContent = processedContent.replace(/\]\(Images\//g, `](${rawBaseUrl}/Images/`);
    }

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
                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
                {/* Left Column: Media & Quick Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video">
                        {videoUrl ? (
                            <div className="w-full h-full relative">
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
                                    <ReactPlayer
                                        url={videoUrl}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                        playing={false}
                                        muted={false}
                                    />
                                )}
                            </div>
                        ) : (
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {project.githubLink && project.githubLink !== "#" && (
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all border border-white/10 hover:border-neon-cyan/50"
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
                                className="flex items-center justify-center px-6 py-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 rounded-lg text-white transition-all border border-neon-cyan/20 hover:border-neon-cyan/50"
                            >
                                <ExternalLink className="w-5 h-5 mr-2" />
                                Live Demo
                            </a>
                        )}
                        {project.downloadUrl && (
                            <a
                                href={project.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-6 py-3 bg-neon-pink/10 hover:bg-neon-pink/20 rounded-lg text-white transition-all border border-neon-pink/20 hover:border-neon-pink/50"
                            >
                                <ExternalLink className="w-5 h-5 mr-2" />
                                Download PDF
                            </a>
                        )}
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 text-sm font-medium rounded bg-white/5 border border-white/10 text-gray-200"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="lg:col-span-2">
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        {project.title}
                    </h1>
                    <div className="h-1 w-20 bg-neon-cyan mb-8"></div>

                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-orbitron prose-headings:text-white prose-h1:text-neon-pink prose-h2:text-neon-cyan prose-a:text-neon-cyan hover:prose-a:text-white prose-strong:text-white prose-img:rounded-xl prose-img:border prose-img:border-white/10">
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                img: ({ node, ...props }) => <img {...props} style={{ maxWidth: '100%', height: 'auto' }} />
                            }}
                        >
                            {processedContent}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectDetails;

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Palette,
  Coins,
  BookOpen,
  Star,
  X,
  Heart,
  MessageCircle,
} from "lucide-react";

function SpotlightHeader() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  };

  return (
    <motion.div
      className="relative py-32 text-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div
        className="absolute pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15) 0%, transparent 60%)`,
        }}
      />
      <motion.div
        initial={{ letterSpacing: "0px" }}
        animate={{ letterSpacing: "2px" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        <h1 className="text-7xl font-display font-bold text-white mb-6 tracking-wide relative overflow-hidden p-10">
          {"StoryWeave".split("").map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="inline-block relative"
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </motion.div>
      <motion.p
        className="text-2xl text-gray-300 font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        Bring your story to life — frame by frame
      </motion.p>
    </motion.div>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: BookOpen,
      title: "Enter Your Story",
      description:
        "Share your vision in words, and watch as our AI brings it to life in Ghibli-inspired style.",
    },
    {
      icon: Palette,
      title: "Magic Happens",
      description:
        "Our AI transforms your words into a sequence of stunning, interconnected visual frames.",
    },
    {
      icon: Coins,
      title: "Make It Yours",
      description:
        "Mint your story as an NFT and share your creation with the world.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="text-center p-8 bg-gray-800/30 rounded-2xl backdrop-blur-sm border border-purple-500/10"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className="w-10 h-10 text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-display font-semibold mb-4 text-white">
              {step.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

interface Story {
  id: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  compositeImage: string;
}

interface CommentModalProps {
  story: Story;
  onClose: () => void;
}

function CommentModal({ story, onClose }: CommentModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800/90 rounded-2xl p-6 max-w-lg w-full backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-display font-bold text-white">
            Comments
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Placeholder comments */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alice Dreams</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <p className="text-gray-300">
              This story reminds me of my childhood adventures. Beautiful work!
            </p>
          </div>
        </div>
        <div className="mt-6">
          <textarea
            placeholder="Add a comment..."
            className="w-full bg-gray-700/30 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            rows={3}
          />
          <button className="mt-3 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Post Comment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-7xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <motion.img
          src={story.compositeImage}
          alt={story.title}
          className="w-full h-auto rounded-lg shadow-2xl"
          layoutId={`story-image-${story.id}`}
        />
      </motion.div>
    </motion.div>
  );
}

function FeaturedStories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [commentStory, setCommentStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>([
    {
      id: "1",
      title: "The Whispering Forest",
      author: "Luna Dreams",
      likes: 142,
      comments: 23,
      isLiked: false,
      compositeImage:
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=400&fit=crop",
    },
    {
      id: "2",
      title: "Ocean's Lullaby",
      author: "Star Weaver",
      likes: 89,
      comments: 15,
      isLiked: false,
      compositeImage:
        "https://images.unsplash.com/photo-1579546929518-9e5c6d19f350?w=1200&h=400&fit=crop",
    },
    {
      id: "3",
      title: "Cloud Castle Journey",
      author: "Sky Walker",
      likes: 234,
      comments: 42,
      isLiked: false,
      compositeImage:
        "https://images.unsplash.com/photo-1490750967977-5f4c98d0f91c?w=1200&h=400&fit=crop",
    },
    {
      id: "4",
      title: "Moonlight Symphony",
      author: "Night Singer",
      likes: 167,
      comments: 31,
      isLiked: false,
      compositeImage:
        "https://images.unsplash.com/photo-1516339901601-2e1aad495297?w=1200&h=400&fit=crop",
    },
  ]);

  const handleLike = (e: React.MouseEvent, storyId: string) => {
    e.stopPropagation();
    setStories(
      stories.map((story) => {
        if (story.id === storyId) {
          return {
            ...story,
            likes: story.isLiked ? story.likes - 1 : story.likes + 1,
            isLiked: !story.isLiked,
          };
        }
        return story;
      })
    );
  };

  const handleCommentClick = (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    setCommentStory(story);
  };

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -5 }}
            className="bg-gray-800/30 rounded-xl overflow-hidden backdrop-blur-sm border border-purple-500/10 glow-border"
          >
            <motion.div
              className="relative cursor-pointer group"
              onClick={() => setSelectedStory(story)}
              whileHover="hover"
            >
              <motion.img
                layoutId={`story-image-${story.id}`}
                src={story.compositeImage}
                alt={story.title}
                className="w-full h-48 object-cover"
              />
              <motion.div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            </motion.div>
            <div className="p-6">
              <h4 className="text-xl font-display font-semibold text-white mb-2">
                {story.title}
              </h4>
              <p className="text-gray-400 text-sm flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-purple-400" />
                {story.author}
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleLike(e, story.id)}
                  className={`flex items-center gap-2 ${
                    story.isLiked ? "text-red-500" : "text-gray-400"
                  } transition-colors`}
                >
                  <motion.div
                    animate={
                      story.isLiked
                        ? {
                            scale: [1, 1.2, 1],
                            transition: { duration: 0.3 },
                          }
                        : {}
                    }
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={story.isLiked ? "currentColor" : "none"}
                    />
                  </motion.div>
                  {story.likes}
                </motion.button>
                <button
                  className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
                  onClick={(e) => handleCommentClick(e, story)}
                >
                  <MessageCircle className="w-5 h-5" />
                  {story.comments}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <StoryModal
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
        {commentStory && (
          <CommentModal
            story={commentStory}
            onClose={() => setCommentStory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array(30)
        .fill(null)
        .map((_, i) => (
          <motion.div
            key={i}
            className="firefly absolute"
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <FloatingParticles />

      <div className="relative z-10">
        <SpotlightHeader />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-32">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-10 py-5 rounded-full text-xl font-semibold flex items-center gap-3 mx-auto hover:bg-purple-700 transition-colors shadow-xl shadow-purple-500/20"
            >
              Start Your Story <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* How It Works Section */}
          <section className="mb-32">
            <motion.h2
              className="text-4xl font-display font-bold text-center mb-16 flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
              How It Works
            </motion.h2>
            <HowItWorks />
          </section>

          {/* Featured Stories Section */}
          <section className="mb-32">
            <motion.h2
              className="text-4xl font-display font-bold text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Featured Stories
            </motion.h2>
            <FeaturedStories />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, ArrowUp, AlignVerticalJustifyStart, FlipVertical } from "lucide-react"

export default function Footer() {
    const socialLinks = [
        { name: "GitHub", icon: Github, href: "https://github.com/Centurykoshi" },
        { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/piyush-yadav-5181ba268/" },
        { name: "Email", icon: Mail, href: "mailto:koshijeager@gmail.com" },
        { name: "Artstation", icon: AlignVerticalJustifyStart, href: "https://www.artstation.com/koshimia" },
        { name: "Fiverr", icon: FlipVertical, href: "https://www.fiverr.com/sellers/koshikatsumi/" }
    ]

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    return (
        <motion.footer
            className="border-t border-border mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* Brand Section */}
                    <motion.div
                        className="lg:col-span-2"

                    >
                        <Link href="/" target="_blank" className="inline-block group">
                            <motion.h3
                                className="text-2xl font-bold mb-4 bg-linear-to-r from-secondary-foreground to-primary/60 bg-clip-text text-transparent"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                Century Blog
                            </motion.h3>
                        </Link>
                        <p className="text-muted-foreground mb-6 max-w-sm">
                            Sharing insights, stories, and knowledge. Join our community of readers and writers.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    className="relative group"
                                    target="_blank"
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.3 }}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <div className="relative z-10 p-2 rounded-lg bg-background border border-border group-hover:border-primary transition-colors duration-200">
                                        <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                    </div>
                                    <motion.div
                                        className="absolute inset-0 bg-primary/20 rounded-lg blur -z-10 opacity-0 group-hover:opacity-100"
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Footer Links */}

                </motion.div>

                {/* Divider */}
            </div>
        </motion.footer>
    )
}

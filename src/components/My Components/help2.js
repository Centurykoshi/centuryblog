"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Link2, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Blogs = {
    id: string;
    slug: string;
    title: string;
    contentHTML: string;
    featuredImg: string | null;
    createdAt?: string | null;
    published?: string | null;
    excerpt?: string | null;
    tag?: string | null;
    author?: {
        name: string;
        image?: string | null;
        bio?: string | null;
    } | null;

}

type RelatedPost = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    featuredImg?: string | null;
    published?: string | null;
    author?: { name: string; image?: string | null } | null;
}

export default function BlogViewer({
    intialBlogs,
    relatedPosts = [],
}: {
    intialBlogs: Blogs;
    relatedPosts?: RelatedPost[];
}) {

    const router = useRouter();
    const blogdetail = intialBlogs;

    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);

    const readingTimeMinutes = useMemo(() => {
        const text = blogdetail.contentHTML
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const words = text.length ? text.split(" ").length : 0;
        return Math.max(1, Math.round(words / 200));
    }, [blogdetail.contentHTML]);

    const heroImgUrl = blogdetail.featuredImg?.trim() || null;

    const publishedLabel = useMemo(() => {
        const dateStr = blogdetail.published || blogdetail.createdAt;
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return null;
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, [blogdetail.createdAt, blogdetail.published]);

    useEffect(() => {
        let rafId = 0;
        const update = () => {
            const doc = document.documentElement;
            const scrollTop = doc.scrollTop;
            const scrollHeight = doc.scrollHeight - doc.clientHeight;
            const next = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
            setProgress(Math.min(1, Math.max(0, next)));
        };

        const onScroll = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch {
            // ignore
        }
    }

    function shareTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(blogdetail.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
    }

    function shareWhatsApp() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(blogdetail.title);
        window.open(`https://wa.me/?text=${text}%20${url}`, "_blank", "noopener,noreferrer");
    }






    return (
        <>
            <div className="min-h-screen bg-muted/30 text-foreground dark:bg-background">
                {/* Reading progress bar */}
                <div className="fixed left-0 top-0 z-50 h-0.5 w-full bg-transparent">
                    <div
                        className="h-full bg-primary transition-[width] duration-150"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>

                {/* Top bar */}
                <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
                        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={copyLink} className="gap-2">
                                <Link2 className="h-4 w-4" />
                                {copied ? "Copied" : "Copy link"}
                            </Button>
                            <Button variant="outline" onClick={shareTwitter} className="gap-2 hidden sm:inline-flex">
                                <Twitter className="h-4 w-4" />
                                Tweet
                            </Button>
                            <Button variant="outline" onClick={shareWhatsApp} className="gap-2 hidden sm:inline-flex">
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="relative">
                    {heroImgUrl ? (
                        <div className="relative h-80 w-full md:h-[420px]">
                            <img
                                src={heroImgUrl}
                                alt={blogdetail.title}
                                className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-700"
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/35 to-black/70" />
                            <div className="absolute inset-0">
                                <div className="mx-auto flex h-full w-full max-w-5xl flex-col justify-end px-4 pb-10">
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                                        <div className="text-sm text-white/80 flex flex-wrap items-center gap-x-3 gap-y-1">
                                            {publishedLabel && <span>{publishedLabel}</span>}
                                            <span className="opacity-70">•</span>
                                            <span>{readingTimeMinutes} min read</span>
                                            {blogdetail.author?.name && (
                                                <>
                                                    <span className="opacity-70">•</span>
                                                    <span>By {blogdetail.author.name}</span>
                                                </>
                                            )}
                                        </div>
                                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">
                                            {blogdetail.title}
                                        </h1>
                                        {blogdetail.excerpt && (
                                            <p className="mt-4 max-w-3xl text-base text-white/85 md:text-lg leading-relaxed">
                                                {blogdetail.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border-b bg-background">
                            <div className="mx-auto w-full max-w-5xl px-4 py-10">
                                <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {publishedLabel && <span>{publishedLabel}</span>}
                                    <span className="opacity-70">•</span>
                                    <span>{readingTimeMinutes} min read</span>
                                    {blogdetail.author?.name && (
                                        <>
                                            <span className="opacity-70">•</span>
                                            <span>By {blogdetail.author.name}</span>
                                        </>
                                    )}
                                </div>
                                <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-6xl">
                                    {blogdetail.title}
                                </h1>
                                {blogdetail.excerpt && (
                                    <p className="mt-4 max-w-3xl text-base text-muted-foreground md:text-lg leading-relaxed">
                                        {blogdetail.excerpt}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Article */}
                <main className="mx-auto w-full max-w-5xl px-4 py-10">
                    <Card className="border-border/60 shadow-sm">
                        <CardContent className="px-6 py-10 md:px-12">
                            {/* Typography */}
                            <article
                                className="prose prose-lg dark:prose-invert max-w-3xl mx-auto text-lg leading-relaxed
                                    prose-headings:font-bold prose-headings:tracking-tight
                                    prose-h2:mt-12 prose-h3:mt-10
                                    prose-p:my-6
                                    prose-li:my-2
                                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                    prose-strong:font-semibold
                                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                    prose-pre:bg-muted prose-pre:border prose-pre:border-border
                                    prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                                    prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-sm"
                                dangerouslySetInnerHTML={{ __html: blogdetail.contentHTML }}
                            />

                            {/* Author card */}
                            <div className="mx-auto mt-14 max-w-3xl">
                                <Separator className="my-10" />
                                <div className="flex items-start gap-4 rounded-xl border bg-background p-5">
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border bg-muted flex items-center justify-center">
                                        {blogdetail.author?.image ? (
                                            <img
                                                src={blogdetail.author.image}
                                                alt={blogdetail.author.name}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-sm font-semibold text-muted-foreground">
                                                {(blogdetail.author?.name || "A").slice(0, 1).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm text-muted-foreground">Written by</div>
                                        <div className="text-base font-semibold truncate">
                                            {blogdetail.author?.name || "Unknown author"}
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                            {blogdetail.author?.bio || "Thanks for reading — more posts coming soon."}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Related posts */}
                            {relatedPosts.length > 0 && (
                                <div className="mx-auto mt-14 max-w-3xl">
                                    <h2 className="text-xl font-bold tracking-tight">Related posts</h2>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {relatedPosts.slice(0, 3).map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blog/${post.slug}`}
                                                className="group rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40"
                                            >
                                                <div className="flex gap-4">
                                                    {post.featuredImg ? (
                                                        <img
                                                            src={post.featuredImg}
                                                            alt={post.title}
                                                            className="h-20 w-28 rounded-lg object-cover border"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-28 rounded-lg border bg-muted" />
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-semibold leading-snug group-hover:underline">
                                                            {post.title}
                                                        </div>
                                                        {post.excerpt && (
                                                            <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                                {post.excerpt}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    )
}
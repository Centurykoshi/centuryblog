"use client";

import Image from "next/image";
import { useState } from "react";

type Blogs = {
  id: string;
  slug: string;
  title: string;
  contentHTML: string;
  featuredImg: string | null;
  Author: string | null;
  published: Date | null;
  contentJSON: any;
};

export default function BlogViewer({ intialBlogs }: { intialBlogs: Blogs }) {
  const [blogdetail] = useState(intialBlogs);

  // ---------- FORMAT DATE ----------
  const DatePublished = blogdetail.published
    ? new Date(blogdetail.published).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Published";

  // ---------- PARSE JSON FOR IMAGES ----------
  const content =
    typeof blogdetail.contentJSON === "string"
      ? JSON.parse(blogdetail.contentJSON)
      : blogdetail.contentJSON;

  function groupImages(nodes: any[]) {
    const result: any[] = [];
    let imageGroup: string[] = [];

    for (const node of nodes) {
      if (node.type === "imageWithDelete") {
        imageGroup.push(node.attrs.src);
      } else {
        if (imageGroup.length) {
          result.push({ type: "image-group", images: imageGroup });
          imageGroup = [];
        }
      }
    }

    if (imageGroup.length) {
      result.push({ type: "image-group", images: imageGroup });
    }

    return result;
  }

  const groupedImages = groupImages(content.content);

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen flex flex-col items-center">

      {/* HERO / Featured Image */}
      <div className="w-full h-[600px] relative overflow-hidden rounded-lg flex flex-col justify-end items-center">
        {blogdetail.featuredImg && (
          <Image
            src={blogdetail.featuredImg}
            alt={blogdetail.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10 text-sm font-medium mb-4">
          {DatePublished}
        </div>
        <h1 className="relative z-10 text-6xl font-semibold text-center px-6 mb-10">
          {blogdetail.title}
        </h1>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl w-full px-4 py-10">

        {/* Render HTML content normally */}
        <div
          className="blog-Content prose prose-lg prose-indigo"
          dangerouslySetInnerHTML={{ __html: blogdetail.contentHTML }}
        />

        {/* Render images from JSON only */}
        {groupedImages.map((group, i) => {
          if (group.type === "image-group") {
            if (group.images.length === 1) {
              return (
                <img
                  key={i}
                  src={group.images[0]}
                  className="w-[40%] h-[420px] object-cover rounded-xl my-8"
                />
              );
            }

            return (
              <div key={i} className="grid grid-cols-3 gap-3 my-8">
                {group.images.map((src: string, j: number) => (
                  <img
                    key={j}
                    src={src}
                    className="h-[180px] w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}


import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { title } from "process";
import z from "zod";

function generateSlug(title?: string) {
    if (!title) {
        return "untitled-page";
    }
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').replace(/--+/g, '-').trim();
}


function generateExcerpt(contentHTML?: string, length = 150) {

    if (!contentHTML || contentHTML.trim() === "") {
        return undefined;
    }
    return contentHTML
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .slice(0, length)
        .trim() + "... ";
}


export const CreatingPage = createTRPCRouter({

    createpage: baseProcedure
        .input(
            z.object({
                title: z.string().default("Untitled Page"),
                contentJSON: z.string().optional(),
                slug: z.string().optional(),
                featuredImg: z.string().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to create a page."
                });
            }

            let slug = input.slug || generateSlug(input.title);

            let uniqueSlug = slug;
            let counter = 1;
            while (await prisma.document.findUnique({ where: { slug: uniqueSlug } })) {
                uniqueSlug = `${slug}-${counter}`;
                counter++;
            }

            const newPage = await prisma.document.create({
                data: {
                    title: input.title,
                    contentJSON: input.contentJSON || "{}",
                    contentHTML: "",
                    slug: uniqueSlug,
                    userId: userId,
                    featuredImg: input.featuredImg,
                },
            });

            return {
                success: true,
                page: newPage,
                url: `/dashboard/edit/${newPage.id}`

            };

        }),

    getDocument: baseProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to view a page."
                });
            }

            const document = await prisma.document.findFirst({
                where: {
                    id: input.id,

                },
            });

            if (!document) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Document not found."
                });
            }

            return {
                success: true,
                document: document
            };
        }),


    updateDocument: baseProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                contentJSON: z.string().optional(),
                contentHTML: z.string().optional(),
                excerpt: z.string().optional(),
                featuredImg: z.string().optional(),
                Tag: z.enum(["All", "Travel", "LifeStyle", "Games", "Tech"]).optional(),
                status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISH"]).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to update a page."
                });
            }

            const existingDocument = await prisma.document.findFirst({
                where: {
                    id: input.id,

                }
            });

            const pxcerpt = generateExcerpt(input.contentHTML);


            let finalSlug = existingDocument?.slug;
            if (input.title && input.title !== existingDocument?.title) {
                let newSlug = generateSlug(input.title);
                let uniqueSlug = newSlug;
                let counter = 1

                while (await prisma.document.findFirst({
                    where: {
                        slug: uniqueSlug,
                        id: { not: existingDocument?.id }
                    }
                })) {
                    uniqueSlug = `${newSlug}-${counter}`;
                    counter++;
                }
                finalSlug = uniqueSlug;
            }

            if (!existingDocument) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Document not found."
                });
            }

            const updateDocument = await prisma.document.update({
                where: {
                    id: existingDocument.id
                },
                data: {
                    title: input.title || existingDocument.title,
                    contentJSON: input.contentJSON || existingDocument.contentJSON || "{}",
                    contentHTML: input.contentHTML || existingDocument.contentHTML,
                    excerpt: pxcerpt,
                    featuredImg: input.featuredImg || existingDocument.featuredImg,
                    status: input.status || existingDocument.status,
                    updatedAt: new Date(),
                    slug: finalSlug,
                    Tag: input.Tag || existingDocument.Tag,
                }
            });

            return {
                success: true,
                document: updateDocument,
                newSlug: updateDocument.slug, // it's just final slug we don't even have to write this 
                urlChanged: finalSlug !== existingDocument.slug
            };
        }),

    deletepage: baseProcedure
        .input(z.object({
            slug: z.string()
        }))
        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to delete a page "

                });
            }

            const document = await prisma.document.findFirst({
                where: {
                    slug: input.slug,

                }
            });

            if (!document) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Document not found get better and find it "
                });
            }

            await prisma.document.delete({
                where: { id: document.id }
            });

            return {
                success: true,
                message: "Page deleted successfully."
            }
        }),





})
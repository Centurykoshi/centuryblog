
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { title } from "process";
import z from "zod";

function generateSlug(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').replace(/--+/g, '-').trim();
}

export const CreatingPage = createTRPCRouter({

    createpage: baseProcedure
        .input(
            z.object({
                title: z.string("Untitled Page"),
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
                url: `/dashboard/edit/${newPage.slug}`

            };

        }),

    getDocument: baseProcedure
        .input(
            z.object({
                slug: z.string(),
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
                    slug: input.slug,
                    userId: userId,
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
                slug: z.string() , 
                title: z.string().optional(),
                contentJSON: z.string().optional(),
                contentHTML: z.string().optional(),
                excerpt: z.string().optional(),
                featuredImg: z.string().optional(),
                status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
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
                    slug: input.slug,
                    userId: userId,
                }
            });

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
                    excerpt: input.excerpt || existingDocument.excerpt,
                    featuredImg: input.featuredImg || existingDocument.featuredImg,
                    status: input.status || existingDocument.status,
                    updatedAt: new Date(),
                }
            });

            return {
                success: true,
                document: updateDocument,
            };
        }),


})
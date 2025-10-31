model Post {
  id           String    @id @default(cuid())
  title        String
  slug         String    @unique
  contentJSON  Json
  contentHTML  String
  featuredImg  String?    // optional thumbnail
  status       PostStatus @default(DRAFT)
  author       User       @relation(fields: [authorId], references: [id])
  authorId     String
  tags         PostTag[]
  comments     Comment[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  publishedAt  DateTime?
}

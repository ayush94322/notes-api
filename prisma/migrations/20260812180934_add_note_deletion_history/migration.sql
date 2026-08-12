-- CreateTable
CREATE TABLE "NoteDeletion" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoteDeletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NoteDeletion_noteId_idx" ON "NoteDeletion"("noteId");

-- CreateIndex
CREATE INDEX "NoteDeletion_userId_idx" ON "NoteDeletion"("userId");

-- AddForeignKey
ALTER TABLE "NoteDeletion" ADD CONSTRAINT "NoteDeletion_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteDeletion" ADD CONSTRAINT "NoteDeletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Note_full_text_search_idx"
ON "Note"
USING GIN (
  to_tsvector(
    'english',
    coalesce("title", '') || ' ' || coalesce("content", '')
  )
)
WHERE "deletedAt" IS NULL;
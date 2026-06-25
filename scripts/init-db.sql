-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
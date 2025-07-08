# 🌿 Willow RAG Weaver

A full-stack RAG (Retrieval-Augmented Generation) document chat application that lets you upload documents and have intelligent conversations about their content using OpenAI and vector search.

## ✨ Features

- 📄 **Document Upload & Processing**: Upload `.txt`, `.md`, and `.pdf` files
- 🧠 **Vector Embeddings**: Automatic text embedding using OpenAI's `text-embedding-3-small`
- 🔍 **Semantic Search**: Advanced vector similarity search with pgvector
- 💬 **Streaming Chat**: Real-time conversations powered by GPT-4
- 📚 **Document Library**: Manage uploaded documents and chat sessions
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase PostgreSQL with pgvector extension
- **AI**: OpenAI GPT-4 and text-embedding-3-small
- **Deployment**: Lovable platform with auto-deployment

## 🚀 Quick Start

### Prerequisites

- OpenAI API key
- Supabase project (already configured in this Lovable project)

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd willow-rag-weaver
   npm install
   ```

2. **Configure OpenAI API Key**
   - The OpenAI API key needs to be configured in your Supabase project secrets
   - Use the secret form in Lovable to add `OPENAI_API_KEY`

3. **Database Setup**
   - The database schema is already configured with:
     - `documents` table for storing uploaded files
     - `embeddings` table with vector search capabilities
     - `chat_history` table for conversation tracking
   - pgvector extension is enabled for similarity search

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🏗 Architecture

### Database Schema

```sql
-- Documents table
documents (
  id UUID PRIMARY KEY,
  filename TEXT,
  content TEXT,
  content_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Embeddings table with vector search
embeddings (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  content_chunk TEXT,
  embedding VECTOR(1536),
  chunk_index INTEGER,
  created_at TIMESTAMP
)

-- Chat history
chat_history (
  id UUID PRIMARY KEY,
  session_id UUID,
  message TEXT,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  metadata JSONB,
  created_at TIMESTAMP
)
```

### API Endpoints (Edge Functions)

- **POST `/api/embed`**: Upload and process documents
  - Accepts file uploads
  - Extracts text content
  - Generates embeddings via OpenAI
  - Stores in Supabase with vector indexing

- **POST `/api/query`**: Conversational queries
  - Performs vector similarity search
  - Retrieves relevant document context
  - Streams GPT-4 responses
  - Stores conversation history

- **GET `/api/history`**: Retrieve chat sessions
  - Fetches conversation history by session ID
  - Returns chronologically ordered messages

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── FileUpload.tsx      # Document upload interface
│   ├── ChatBox.tsx         # Streaming chat interface
│   └── Sidebar.tsx         # Document/session management
├── pages/
│   └── Index.tsx           # Main application page
├── integrations/
│   └── supabase/           # Supabase client & types
└── hooks/                  # Custom React hooks

supabase/
├── functions/
│   ├── embed/              # Document processing endpoint
│   ├── query/              # Chat query endpoint
│   └── history/            # Chat history endpoint
└── migrations/             # Database schema migrations
```

## 🔧 Configuration

### Environment Variables

The following environment variables are configured in Supabase:

```env
SUPABASE_URL=https://ykldcfioxyarulwzaxua.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<configured-in-supabase>
OPENAI_API_KEY=<add-via-lovable-secret-form>
```

## 🚀 Deployment

This project is designed for seamless deployment on the Lovable platform:

1. **Auto-Deployment**: Changes are automatically deployed when pushed
2. **Environment**: All secrets are managed through Supabase
3. **Scaling**: Serverless edge functions handle backend processing
4. **CDN**: Frontend assets are globally distributed

### Custom Domain Setup

1. Go to Project Settings in Lovable
2. Navigate to Domains section  
3. Add your custom domain
4. Update DNS records as instructed

## 🔍 Usage Guide

1. **Upload Documents**: Use the file upload component to add `.txt`, `.md`, or `.pdf` files
2. **Start Chatting**: Ask questions about your uploaded documents
3. **View History**: Access previous conversations through the sidebar
4. **Manage Documents**: View and delete uploaded documents from the library

## 🛡 Security & Privacy

- All documents are stored securely in Supabase
- Vector embeddings are generated using OpenAI's API
- Chat history is session-based for privacy
- Files are processed server-side for security

## 🎯 Roadmap

- [ ] PDF text extraction improvements
- [ ] User authentication and multi-tenancy
- [ ] Document preview functionality  
- [ ] Usage analytics and quotas
- [ ] Feedback system for responses
- [ ] Multiple file format support
- [ ] Batch document processing

## 🤝 Contributing

This project was built with Lovable. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙋‍♂️ Support

For support and questions:
- Check the [Lovable documentation](https://docs.lovable.dev)
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using Lovable, React, Supabase, and OpenAI
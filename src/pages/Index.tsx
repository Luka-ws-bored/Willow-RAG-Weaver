import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-backend.example.com/api/v6';
async function ragQuery(prompt: string) {
  const res = await fetch(`${API_BASE_URL}/rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: prompt }),
  });
  if (!res.ok) throw new Error('RAG request failed');
  return res.json(); // { answer: string, sourceDocs?: [...] }
}

async function uploadFile(file: File) {
  const data = new FormData();
  data.append('document', file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: data,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

const Index = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'bot', text: string }>>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  async function send() {
    if (!prompt.trim()) return;
    setMessages(m => [...m, { from: 'user', text: prompt }]);
    setPrompt('');
    try {
      const { answer } = await ragQuery(prompt);
      setMessages(m => [...m, { from: 'bot', text: answer }]);
    } catch (err: any) {
      setMessages(m => [...m, { from: 'bot', text: 'Error: ' + err.message }]);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploadStatus('Uploading...');
    try {
      await uploadFile(file);
      setUploadStatus('Uploaded successfully ✅');
    } catch (err: any) {
      setUploadStatus('Upload failed ❌');
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="text-3xl font-bold">🌿 Willow v6-Beta</header>

      {/* Chat Interface */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">💬 Ask Willow</h2>
        {messages.map((m, i) => (
          <Card key={i} className={m.from === 'bot' ? 'bg-muted/50' : 'bg-card'}>
            <CardContent className="p-3">{m.text}</CardContent>
          </Card>
        ))}
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </section>

      {/* Upload Interface */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">📄 Upload Document</h2>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={!file}>Upload</Button>
        {uploadStatus && <p className="text-sm text-muted-foreground">{uploadStatus}</p>}
      </section>
    </div>
  );
};

export default Index;

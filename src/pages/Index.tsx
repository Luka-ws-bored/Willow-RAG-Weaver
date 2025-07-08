import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { FileUpload } from '@/components/FileUpload';
import { ChatBox } from '@/components/ChatBox';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Github } from 'lucide-react';

const Index = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string>('default');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  const handleUploadComplete = () => {
    // Optionally refresh sidebar or show success message
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🌿</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Willow RAG Weaver
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <FileUpload onUploadComplete={handleUploadComplete} />
              <Sidebar 
                onSessionSelect={handleSessionSelect}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <ChatBox sessionId={currentSessionId} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built with React, Tailwind CSS, Supabase, and OpenAI • 
            <a href="#" className="text-primary hover:underline ml-1">
              Deploy to Vercel
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

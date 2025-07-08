import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  filename: string;
  created_at: string;
}

interface ChatSession {
  session_id: string;
  message_count: number;
  last_message: string;
  created_at: string;
}

interface SidebarProps {
  onDocumentSelect?: (documentId: string) => void;
  onSessionSelect?: (sessionId: string) => void;
}

export const Sidebar = ({ onDocumentSelect, onSessionSelect }: SidebarProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'chats'>('documents');
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
    loadChatSessions();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const docs = await response.json();
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const loadChatSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const sessions = await response.json();
        setChatSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    }
  };

  const deleteDocument = async (documentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
        toast({
          title: "Document deleted",
          description: `${filename} has been removed.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-80 h-[600px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle>Library</CardTitle>
        <div className="flex space-x-1">
          <Button
            variant={activeTab === 'documents' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('documents')}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-1" />
            Documents
          </Button>
          <Button
            variant={activeTab === 'chats' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('chats')}
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Chats
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2">
        {activeTab === 'documents' ? (
          <div className="space-y-2">
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No documents uploaded yet
              </p>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => onDocumentSelect?.(doc.id)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDocument(doc.id, doc.filename);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {chatSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No chat sessions yet
              </p>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.session_id}
                  className="p-2 rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => onSessionSelect?.(session.session_id)}
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {session.last_message || 'New conversation'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(session.created_at)} • {session.message_count} messages
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
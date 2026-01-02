import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export const ChatMessage = ({ message, onSpeak, isSpeaking }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-3 mb-4 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
        }`}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      <div
        className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}
      >
        <div
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-card border border-border rounded-tl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>

        {!isUser && (
          <div className="mt-2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(message.content)}
              className="h-8 px-2 text-muted-foreground hover:text-primary"
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-primary' : ''}`} />
              <span className="ml-1 text-xs">Listen</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

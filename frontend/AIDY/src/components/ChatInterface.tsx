import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, MicOff, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from "@/components/ui/sonner";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

console.log(import.meta.env.VITE_APP_URL);

const systemPrompt = `You are Aidy, a friendly and knowledgeable AI travel assistant dedicated to helping users with any travel-related question or planning task—from suggesting destinations and attractions to offering practical advice on transportation, accommodations, visas, budgets, and local customs; you'll ask for key details like destination, dates, and interests, offer clear and concise recommendations and itineraries, ask follow-up questions to clarify missing information, and when unsure, acknowledge your limits and suggest official resources, all while maintaining a warm, conversational, and helpful tone.`;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: systemPrompt,
      sender: 'system',
      timestamp: new Date()
    },
    {
      id: '1',
      content: `Hello! I'm your tourist guide assistant. How can I help you today?`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [convertingDots, setConvertingDots] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Animate dots for converting to text
  useEffect(() => {
    if (!isConverting) {
      setConvertingDots('');
      return;
    }
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setConvertingDots('.'.repeat(count));
    }, 400);
    return () => clearInterval(interval);
  }, [isConverting]);

  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/gemini/text-to-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          // Include chat history for context
          context: messages
            .map(msg => `${msg.sender === 'user' ? 'user' : msg.sender === 'assistant' ? 'assistant' : 'system'}: ${msg.content}`)
            .join('\n')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      return data.response || "I'm sorry, I couldn't process that request right now.";

    } catch (error) {
      console.error('Error fetching AI response:', error);
      toast.error("Failed to connect to AI service.");
      return error.message;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to send user message and get AI response
  const sendMessageAndGetAIResponse = async (userText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    setIsLoading(true);
    const aiResponse = await fetchAIResponse(userText);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: aiResponse,
      sender: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    setInput('');
    await sendMessageAndGetAIResponse(input.trim());
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new window.MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        mediaRecorder.onstop = async () => {
          setIsRecording(false);
          setIsConverting(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          // Send audioBlob to backend
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          try {
            const response = await fetch(`${import.meta.env.VITE_APP_URL}/gemini/speech-to-text`, {
              method: 'POST',
              body: formData,
            });
            if (!response.ok) {
              throw new Error('Failed to transcribe audio');
            }
            const data = await response.json();
            setIsConverting(false);
            if (data.text) {
              // Immediately append user message to chat
              const userMessage: Message = {
                id: Date.now().toString(),
                content: data.text,
                sender: 'user',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, userMessage]);
              // Then get AI response and append
              setIsLoading(true);
              const aiResponse = await fetchAIResponse(data.text);
              const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: aiResponse,
                sender: 'assistant',
                timestamp: new Date()
              };
              setMessages(prev => [...prev, assistantMessage]);
              setIsLoading(false);
            }
          } catch (error) {
            setIsConverting(false);
            toast.error('Failed to transcribe audio.');
          }
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      } catch (err) {
        setIsRecording(false);
        toast.error('Could not access microphone.');
      }
    } else {
      // Stop recording
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const fetchAndPlayAudio = async (text: string, messageId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/openai/text-to-speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to fetch audio');
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setPlayingMessageId(messageId);
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    } catch (err) {
      toast.error('Failed to play audio.');
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  // Typing indicator for assistant
  const TypingBubble: React.FC = () => (
    <Card className="max-w-[80%] p-3 bg-card border border-border flex items-center">
      <span className="dot-flashing dot1" />
      <span className="dot-flashing dot2" />
      <span className="dot-flashing dot3" />
      <span className="ml-2 text-sm text-muted-foreground">Assistant is typing...</span>
      <style>
        {`
          .dot-flashing {
            display: inline-block;
            width: 0.5em;
            height: 0.5em;
            border-radius: 50%;
            background: #888;
            margin-right: 0.2em;
            animation: dotFlashing 1s infinite linear alternate;
          }
          .dot1 { animation-delay: 0s; }
          .dot2 { animation-delay: 0.2s; }
          .dot3 { animation-delay: 0.4s; }
          @keyframes dotFlashing {
            0% { opacity: 0.2; }
            50%, 100% { opacity: 1; }
          }
        `}
      </style>
    </Card>
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <div className="flex flex-col items-center">
            {/* Microphone animation */}
            <div className="animate-pulse rounded-full bg-red-500 p-6 mb-4">
              <Mic size={48} className="text-white" />
            </div>
            <p className="text-white text-lg mb-4">Recording... Speak now!</p>
            <Button
              type="button"
              variant="destructive"
              size="lg"
              className="text-lg"
              onClick={toggleRecording}
            >
              Stop Recording
            </Button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter(msg => msg.sender !== 'system').map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-[80%] p-3 ${message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : message.sender === 'assistant'
                  ? 'bg-card border border-border'
                  : 'bg-system text-white'
                } flex items-center`}
            >
              <div className="flex-1">
                {message.sender === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : message.sender === 'system' ? (
                  <p>{message.content}</p>
                ) : (
                  <p>{message.content}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {/* Play button for assistant messages */}
              {message.sender === 'assistant' && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className={`ml-2 ${playingMessageId === message.id ? 'animate-pulse text-blue-500' : ''}`}
                  onClick={() => fetchAndPlayAudio(message.content, message.id)}
                >
                  <Volume2 size={18} />
                </Button>
              )}
            </Card>
          </div>
        ))}
        {/* User-side loading bubble for converting audio */}
        {isConverting && (
          <div className="flex justify-end">
            <Card className="max-w-[80%] p-3 bg-blue-600 text-white flex items-center">
              <span className="animate-pulse mr-2">
                <Mic size={18} />
              </span>
              <span>Converting to text{convertingDots}</span>
            </Card>
          </div>
        )}
        {isLoading && (
          <div className="flex justify-start">
            <TypingBubble />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={isRecording ? "bg-red-500 text-white border-red-500" : ""}
            onClick={toggleRecording}
            disabled={isRecording || isConverting}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a tourist attraction..."
            className="flex-1"
            disabled={isLoading || isRecording || isConverting}
          />
          <Button type="submit" disabled={!input.trim() || isLoading || isRecording || isConverting}>
            <Send size={18} />
          </Button>
        </form>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onEnded={() => {
            setAudioUrl(null);
            setPlayingMessageId(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatInterface;

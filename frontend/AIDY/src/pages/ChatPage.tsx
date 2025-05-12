import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto min-h-screen pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Tourist Guide Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized advice and real-time information about attractions while you travel.
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg h-[600px] shadow-sm">
        <ChatInterface />
      </div>
      <p className="text-xs text-center text-muted-foreground mt-8">
        Speech processing features are unavailable in the hosted version due to server environment restrictions on FFmpeg installation.<br />
        You can clone the GitHub repo and run the backend locally with FFmpeg installed to enable these features.
      </p>
    </div>
  );
};

export default ChatPage;


import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tourist Guide Assistant</h1>
        <p className="text-muted-foreground">
          Get real-time advice and information about attractions while you travel.
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-lg h-[600px] shadow-sm">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage;

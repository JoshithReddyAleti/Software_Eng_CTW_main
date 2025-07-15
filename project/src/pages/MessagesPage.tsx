// This part of the code ensures the messaging works properly for the seller and buyer. 

import React, { useState } from 'react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Property } from '../types';
import { mockUsers } from '../data/mockData';

interface MessagesPageProps {
  contactProperty?: Property;
  onBack?: () => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ contactProperty, onBack }) => {
  const { user } = useAuth();
  const { messages, addMessage, properties } = useData();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    contactProperty?.id || null
  );
  const [newMessage, setNewMessage] = useState('');

  // User has to be logged in to view and send messages.
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Please login to view messages</h2>
        </div>
      </div>
    );
  }

  // Get conversations for the current user
  const userMessages = messages.filter(msg => 
    msg.senderId === user.id || msg.receiverId === user.id
  );

  // Group messages by property
  const conversations = userMessages.reduce((acc, msg) => {
    const propertyId = msg.propertyId;
    if (!acc[propertyId]) {
      acc[propertyId] = [];
    }
    acc[propertyId].push(msg);
    return acc;
  }, {} as Record<string, typeof messages>);

  // Sort conversations by latest message
  const sortedConversations = Object.entries(conversations).sort(([, a], [, b]) => {
    const latestA = Math.max(...a.map(msg => msg.timestamp.getTime()));
    const latestB = Math.max(...b.map(msg => msg.timestamp.getTime()));
    return latestB - latestA;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const property = properties.find(p => p.id === selectedConversation);
    if (!property) return;

    const receiverId = user.role === 'buyer' ? property.sellerId : 
      conversations[selectedConversation].find(msg => msg.senderId !== user.id)?.senderId;

    if (!receiverId) return;

    addMessage({
      senderId: user.id,
      receiverId,
      propertyId: selectedConversation,
      content: newMessage,
      read: false,
    });

    setNewMessage('');
  };

  const selectedMessages = selectedConversation ? 
    (conversations[selectedConversation] || []).sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    ) : [];

  const selectedProperty = selectedConversation ? 
    properties.find(p => p.id === selectedConversation) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contactProperty && onBack && (
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Properties</span>
          </button>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-96 md:h-[600px]">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              </div>
              <div className="overflow-y-auto h-full">
                {sortedConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  sortedConversations.map(([propertyId, msgs]) => {
                    const property = properties.find(p => p.id === propertyId);
                    const lastMessage = msgs[msgs.length - 1];
                    const otherUserId = lastMessage.senderId === user.id ? 
                      lastMessage.receiverId : lastMessage.senderId;
                    const otherUser = mockUsers.find(u => u.id === otherUserId);
                    
                    return (
                      <div
                        key={propertyId}
                        onClick={() => setSelectedConversation(propertyId)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                          selectedConversation === propertyId ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={property?.image}
                            alt={property?.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {property?.title}
                            </div>
                            <div className="text-xs text-gray-600">
                              {otherUser?.name} • {user.role === 'buyer' ? 'Seller' : 'Buyer'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {lastMessage.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedProperty?.image}
                        alt={selectedProperty?.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {selectedProperty?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {selectedProperty?.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedMessages.map((message) => {
                      const isOwnMessage = message.senderId === user.id;
                      const sender = mockUsers.find(u => u.id === message.senderId);
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {!isOwnMessage && (
                              <div className="text-xs font-medium mb-1">
                                {sender?.name}
                              </div>
                            )}
                            <div>{message.content}</div>
                            <div
                              className={`text-xs mt-1 ${
                                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
                    <p className="text-gray-500">Choose a property to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

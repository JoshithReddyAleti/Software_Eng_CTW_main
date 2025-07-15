import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import MessagesPage from './MessagesPage';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { User, Property, Message } from '../types';

// Mock data
const mockBuyer: User = {
  id: 'buyer-1',
  name: 'John Buyer',
  email: 'buyer@example.com',
  role: 'buyer'
};

const mockSeller: User = {
  id: 'seller-1',
  name: 'Jane Seller',
  email: 'seller@example.com',
  role: 'seller'
};

const mockProperty: Property = {
  id: 'property-1',
  title: 'Beautiful 3BR House',
  location: 'New York, NY',
  price: 450000,
  image: 'https://example.com/house.jpg',
  sellerId: 'seller-1',
  bedrooms: 3,
  bathrooms: 2,
  sqft: 1200,
  yearBuilt: 2020,
  description: 'A beautiful house',
  features: ['parking', 'garden']
};

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'buyer-1',
    receiverId: 'seller-1',
    propertyId: 'property-1',
    content: 'Hi, I\'m interested in this property',
    timestamp: new Date('2024-01-01T10:00:00'),
    read: false
  },
  {
    id: 'msg-2',
    senderId: 'seller-1',
    receiverId: 'buyer-1',
    propertyId: 'property-1',
    content: 'Thank you for your interest! Would you like to schedule a viewing?',
    timestamp: new Date('2024-01-01T10:30:00'),
    read: false
  }
];

// Mock contexts
const createMockAuthContext = (user: User | null) => ({
  user,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn()
});

const createMockDataContext = (messages: Message[] = [], addMessageMock = vi.fn()) => ({
  properties: [mockProperty],
  messages,
  addMessage: addMessageMock,
  addProperty: vi.fn(),
  updateProperty: vi.fn(),
  deleteProperty: vi.fn()
});

// Test wrapper component
const TestWrapper: React.FC<{
  user: User | null;
  messages?: Message[];
  addMessageMock?: vi.fn();
  children: React.ReactNode;
}> = ({ user, messages = [], addMessageMock = vi.fn(), children }) => (
  <AuthContext.Provider value={createMockAuthContext(user)}>
    <DataContext.Provider value={createMockDataContext(messages, addMessageMock)}>
      {children}
    </DataContext.Provider>
  </AuthContext.Provider>
);

describe('MessagesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should show login prompt when user is not authenticated', () => {
      render(
        <TestWrapper user={null}>
          <MessagesPage />
        </TestWrapper>
      );

      expect(screen.getByText('Please login to view messages')).toBeInTheDocument();
      expect(screen.queryByText('Conversations')).not.toBeInTheDocument();
    });
  });

  describe('Conversations List', () => {
    it('should display "No conversations yet" when there are no messages', () => {
      render(
        <TestWrapper user={mockBuyer}>
          <MessagesPage />
        </TestWrapper>
      );

      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    });

    it('should display conversations for authenticated buyer', () => {
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      expect(screen.getByText('Conversations')).toBeInTheDocument();
      expect(screen.getByText('Beautiful 3BR House')).toBeInTheDocument();
      expect(screen.getByText('Jane Seller • Seller')).toBeInTheDocument();
      expect(screen.getByText('Thank you for your interest! Would you like to schedule a viewing?')).toBeInTheDocument();
    });

    it('should display conversations for authenticated seller', () => {
      render(
        <TestWrapper user={mockSeller} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      expect(screen.getByText('Conversations')).toBeInTheDocument();
      expect(screen.getByText('Beautiful 3BR House')).toBeInTheDocument();
      expect(screen.getByText('John Buyer • Buyer')).toBeInTheDocument();
    });

    it('should highlight selected conversation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      expect(conversationItem).toHaveClass('bg-blue-50');
    });
  });

  describe('Message Display', () => {
    it('should show conversation selection prompt when no conversation is selected', () => {
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      expect(screen.getByText('Select a conversation')).toBeInTheDocument();
      expect(screen.getByText('Choose a property to start messaging')).toBeInTheDocument();
    });

    it('should display messages when a conversation is selected', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Check if messages are displayed
      expect(screen.getByText('Hi, I\'m interested in this property')).toBeInTheDocument();
      expect(screen.getByText('Thank you for your interest! Would you like to schedule a viewing?')).toBeInTheDocument();
    });

    it('should display property header when conversation is selected', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Check property header
      expect(screen.getAllByText('Beautiful 3BR House')).toHaveLength(2); // One in list, one in header
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });

    it('should style own messages differently from other messages', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Check message styling
      const ownMessage = screen.getByText('Hi, I\'m interested in this property').closest('div');
      const otherMessage = screen.getByText('Thank you for your interest! Would you like to schedule a viewing?').closest('div');

      expect(ownMessage).toHaveClass('bg-blue-600', 'text-white');
      expect(otherMessage).toHaveClass('bg-gray-100', 'text-gray-900');
    });
  });

  describe('Sending Messages', () => {
    it('should allow buyer to send message to seller', async () => {
      const user = userEvent.setup();
      const addMessageMock = vi.fn();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages} addMessageMock={addMessageMock}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Type and send message
      const messageInput = screen.getByPlaceholderText('Type a message...');
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(messageInput, 'When can I schedule a viewing?');
      await user.click(sendButton);

      expect(addMessageMock).toHaveBeenCalledWith({
        senderId: 'buyer-1',
        receiverId: 'seller-1',
        propertyId: 'property-1',
        content: 'When can I schedule a viewing?',
        read: false
      });
    });

    it('should allow seller to send message to buyer', async () => {
      const user = userEvent.setup();
      const addMessageMock = vi.fn();
      
      render(
        <TestWrapper user={mockSeller} messages={mockMessages} addMessageMock={addMessageMock}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Type and send message
      const messageInput = screen.getByPlaceholderText('Type a message...');
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(messageInput, 'How about tomorrow at 2 PM?');
      await user.click(sendButton);

      expect(addMessageMock).toHaveBeenCalledWith({
        senderId: 'seller-1',
        receiverId: 'buyer-1',
        propertyId: 'property-1',
        content: 'How about tomorrow at 2 PM?',
        read: false
      });
    });

    it('should send message when Enter key is pressed', async () => {
      const user = userEvent.setup();
      const addMessageMock = vi.fn();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages} addMessageMock={addMessageMock}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Type message and press Enter
      const messageInput = screen.getByPlaceholderText('Type a message...');
      await user.type(messageInput, 'Quick question about the property{enter}');

      expect(addMessageMock).toHaveBeenCalledWith({
        senderId: 'buyer-1',
        receiverId: 'seller-1',
        propertyId: 'property-1',
        content: 'Quick question about the property',
        read: false
      });
    });

    it('should clear input after sending message', async () => {
      const user = userEvent.setup();
      const addMessageMock = vi.fn();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages} addMessageMock={addMessageMock}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Type and send message
      const messageInput = screen.getByPlaceholderText('Type a message...');
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(messageInput, 'Test message');
      await user.click(sendButton);

      expect(messageInput).toHaveValue('');
    });

    it('should disable send button when message is empty', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      const sendButton = screen.getByRole('button', { name: /send/i });
      
      expect(sendButton).toBeDisabled();
    });

    it('should not send empty or whitespace-only messages', async () => {
      const user = userEvent.setup();
      const addMessageMock = vi.fn();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages} addMessageMock={addMessageMock}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Try to send empty message
      const messageInput = screen.getByPlaceholderText('Type a message...');
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(messageInput, '   '); // Only whitespace
      await user.click(sendButton);

      expect(addMessageMock).not.toHaveBeenCalled();
    });
  });

  describe('Contact Property Flow', () => {
    it('should show back button when contactProperty is provided', () => {
      const onBackMock = jest.fn();
      
      render(
        <TestWrapper user={mockBuyer}>
          <MessagesPage contactProperty={mockProperty} onBack={onBackMock} />
        </TestWrapper>
      );

      const backButton = screen.getByText('Back to Properties');
      expect(backButton).toBeInTheDocument();
    });

    it('should call onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      const onBackMock = vi.fn();
      
      render(
        <TestWrapper user={mockBuyer}>
          <MessagesPage contactProperty={mockProperty} onBack={onBackMock} />
        </TestWrapper>
      );

      const backButton = screen.getByText('Back to Properties');
      await user.click(backButton);

      expect(onBackMock).toHaveBeenCalled();
    });

    it('should auto-select conversation when contactProperty is provided', () => {
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage contactProperty={mockProperty} />
        </TestWrapper>
      );

      // Should show the property header (indicating conversation is selected)
      expect(screen.getAllByText('Beautiful 3BR House')).toHaveLength(2);
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
    });
  });

  describe('Message Timestamps', () => {
    it('should display message timestamps', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper user={mockBuyer} messages={mockMessages}>
          <MessagesPage />
        </TestWrapper>
      );

      // Select conversation
      const conversationItem = screen.getByText('Beautiful 3BR House').closest('div');
      await user.click(conversationItem!);

      // Check if timestamps are displayed
      const timestamps = screen.getAllByText(/AM|PM/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  describe('Conversation Sorting', () => {
    it('should sort conversations by latest message timestamp', () => {
      const messagesWithDifferentTimes: Message[] = [
        {
          id: 'msg-1',
          senderId: 'buyer-1',
          receiverId: 'seller-1',
          propertyId: 'property-1',
          content: 'Older message',
          timestamp: new Date('2024-01-01T09:00:00'),
          read: false
        },
        {
          id: 'msg-2',
          senderId: 'buyer-1',
          receiverId: 'seller-1',
          propertyId: 'property-2',
          content: 'Newer message',
          timestamp: new Date('2024-01-01T11:00:00'),
          read: false
        }
      ];

      const additionalProperty: Property = {
        ...mockProperty,
        id: 'property-2',
        title: 'Another Property'
      };

      render(
        <TestWrapper user={mockBuyer} messages={messagesWithDifferentTimes}>
          <DataContext.Provider value={{
            ...createMockDataContext(messagesWithDifferentTimes),
            properties: [mockProperty, additionalProperty]
          }}>
            <MessagesPage />
          </DataContext.Provider>
        </TestWrapper>
      );

      const conversations = screen.getAllByText(/Property/);
      // The conversation with newer message should appear first
      expect(conversations[0]).toHaveTextContent('Another Property');
    });
  });
});

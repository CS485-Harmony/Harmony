import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestMessageSearch } from '@/components/channel/GuestMessageSearch';
import { searchPublicChannelMessages } from '@/services/publicMessageSearchService';

jest.mock('@/services/publicMessageSearchService', () => ({
  searchPublicChannelMessages: jest.fn(),
}));

const mockSearchPublicChannelMessages = searchPublicChannelMessages as jest.MockedFunction<
  typeof searchPublicChannelMessages
>;

describe('GuestMessageSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens guest search and displays author, timestamp, and context for matching messages', async () => {
    mockSearchPublicChannelMessages.mockResolvedValue({
      query: 'launch',
      limit: 20,
      results: [
        {
          id: 'msg-1',
          content: 'We are ready to launch guest search.',
          context: 'We are ready to launch guest search.',
          createdAt: '2026-05-01T12:00:00.000Z',
          editedAt: null,
          author: { id: 'user-1', username: 'alice' },
        },
      ],
    });

    render(<GuestMessageSearch channelId='channel-1' channelName='general' />);

    await userEvent.click(screen.getByRole('button', { name: /search messages/i }));
    await userEvent.type(screen.getByPlaceholderText('Search messages in #general'), 'launch');

    await waitFor(() =>
      expect(mockSearchPublicChannelMessages).toHaveBeenCalledWith('channel-1', 'launch'),
    );
    expect(await screen.findByText('alice')).toBeInTheDocument();
    expect(screen.getByText('We are ready to launch guest search.')).toBeInTheDocument();
    expect(screen.getByText(/May 1, 2026/)).toBeInTheDocument();
  });
});

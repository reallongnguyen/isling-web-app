import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import EmotionLand from '../EmotionLand';
import { useEmotionSelection } from '@/modules/emotion/hooks';
import { Profile } from '@/modules/user/models/profile.model';

// Mock the useEmotionSelection hook
jest.mock('@/modules/emotion/hooks', () => ({
  useEmotionSelection: jest.fn(),
}));

describe('EmotionLand', () => {
  // Mock profile data
  const mockProfile: Profile = {
    id: 'test-id',
    authId: 'auth-id',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'test-avatar.jpg',
    role: ['user'],
    isActive: true,
    email: 'test@example.com',
    phone: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock emotion selection hook implementation
  const mockHandleEmotionChange = jest.fn();
  const mockIsLoading = jest.fn().mockImplementation(() => false);

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    (useEmotionSelection as jest.Mock).mockReturnValue({
      emotion: 'neutral',
      handleEmotionChange: mockHandleEmotionChange,
      isLoading: mockIsLoading,
    });
  });

  it('renders correctly with profile avatar', () => {
    const { getByText } = render(<EmotionLand profile={mockProfile} />);

    // Check if the component renders the question text
    expect(getByText('How are you feeling today?')).toBeInTheDocument();

    // Check if all emotion buttons are rendered
    expect(getByText('😊')).toBeInTheDocument();
    expect(getByText('😢')).toBeInTheDocument();
    expect(getByText('😡')).toBeInTheDocument();
    expect(getByText('😨')).toBeInTheDocument();
    expect(getByText('🤡')).toBeInTheDocument();
  });

  it('renders correctly without profile avatar', () => {
    const profileWithoutAvatar = {
      ...mockProfile,
      avatar: '', // Empty string instead of null since the type doesn't allow null
    };
    const { container } = render(
      <EmotionLand profile={profileWithoutAvatar} />
    );

    // Check if the component renders the fallback icon when no avatar is provided
    const fallbackIcon = container.querySelector('.text-5xl.text-white');
    expect(fallbackIcon).toBeInTheDocument();
  });

  it('calls handleEmotionChange when an emotion button is clicked', async () => {
    const { getByText } = render(<EmotionLand profile={mockProfile} />);
    const user = userEvent.setup();

    // Click on the joy emotion button
    await user.click(getByText('😊'));

    // Check if handleEmotionChange was called with the correct emotion
    expect(mockHandleEmotionChange).toHaveBeenCalledWith('joy');
  });

  it('shows loading state when an emotion is being saved', () => {
    // Mock the isLoading function to return true for 'joy' emotion
    mockIsLoading.mockImplementation((emotion: string) => emotion === 'joy');

    (useEmotionSelection as jest.Mock).mockReturnValue({
      emotion: 'joy',
      handleEmotionChange: mockHandleEmotionChange,
      isLoading: mockIsLoading,
    });

    const { container, getByText } = render(
      <EmotionLand profile={mockProfile} />
    );

    // Check if the joy button is in loading state (has loading class)
    const loadingButton = container.querySelector('.adm-button-loading');
    expect(loadingButton).toBeInTheDocument();

    // Other emotion buttons should still be visible
    expect(getByText('😢')).toBeInTheDocument();
    expect(getByText('😡')).toBeInTheDocument();
    expect(getByText('😨')).toBeInTheDocument();
    expect(getByText('🤡')).toBeInTheDocument();
  });

  it('highlights the selected emotion', () => {
    // Mock the selected emotion as 'joy'
    (useEmotionSelection as jest.Mock).mockReturnValue({
      emotion: 'joy',
      handleEmotionChange: mockHandleEmotionChange,
      isLoading: mockIsLoading,
    });

    const { getAllByRole } = render(<EmotionLand profile={mockProfile} />);

    // Get all emotion buttons
    const buttons = getAllByRole('button');

    // The first button (joy) should have the selected class
    expect(buttons[0].className).toContain('bg-blue-400/40');

    // Other buttons should not have the selected class
    expect(buttons[1].className).not.toContain('bg-blue-400/40');
    expect(buttons[2].className).not.toContain('bg-blue-400/40');
    expect(buttons[3].className).not.toContain('bg-blue-400/40');
    expect(buttons[4].className).not.toContain('bg-blue-400/40');
  });

  it('calls onClick prop when the component is clicked', async () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <EmotionLand profile={mockProfile} onClick={onClickMock} />
    );
    const user = userEvent.setup();

    // Click on the component (not on any button)
    await user.click(getByText('How are you feeling today?'));

    // Check if onClick was called
    expect(onClickMock).toHaveBeenCalled();
  });

  it('prevents event propagation when clicking on emotion buttons', async () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <EmotionLand profile={mockProfile} onClick={onClickMock} />
    );
    const user = userEvent.setup();

    // Click on an emotion button (using the sadness button since joy might be loading in some tests)
    await user.click(getByText('😢'));

    // Check that the emotion change handler was called
    expect(mockHandleEmotionChange).toHaveBeenCalledWith('sadness');

    // Check that the onClick prop was not called (event propagation was stopped)
    expect(onClickMock).not.toHaveBeenCalled();
  });
});

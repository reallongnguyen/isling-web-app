import { renderHook, act } from '@testing-library/react';
import { useEmotionSelection } from '../hooks/useEmotionSelection';
import { useEmotionService } from '../hooks/useEmotionService';
import { Toast } from 'antd-mobile';

// Mock dependencies
jest.mock('../hooks/useEmotionService', () => ({
  useEmotionService: jest.fn(),
}));

// Mock Jotai
jest.mock('jotai', () => {
  const mockAtom = <T,>(initialValue: T) => ({
    init: initialValue,
  });

  return {
    atom: mockAtom,
    useAtom: jest.fn(),
  };
});

// Mock the emotion store to avoid direct dependency on atom
jest.mock('../store/emotion', () => ({
  emotionTypeAtom: { init: 'neutral' },
}));

jest.mock('antd-mobile', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

describe('useEmotionSelection', () => {
  // Mock implementations
  const mockSetEmotion = jest.fn();
  const mockCreateEmotion = jest.fn();
  const useAtomMock = jest.requireMock('jotai').useAtom;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock useAtom implementation
    useAtomMock.mockReturnValue(['neutral', mockSetEmotion]);

    // Mock useEmotionService implementation
    (useEmotionService as jest.Mock).mockReturnValue({
      createEmotion: mockCreateEmotion,
      isCreating: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set emotion state when handleEmotionChange is called', () => {
    const { result } = renderHook(() => useEmotionSelection());

    act(() => {
      result.current.handleEmotionChange('joy');
    });

    expect(mockSetEmotion).toHaveBeenCalledWith('joy');
  });

  it('should reset to neutral when clicking the same emotion', () => {
    // Set current emotion to 'joy'
    useAtomMock.mockReturnValue(['joy', mockSetEmotion]);

    const { result } = renderHook(() => useEmotionSelection());

    act(() => {
      result.current.handleEmotionChange('joy');
    });

    expect(mockSetEmotion).toHaveBeenCalledWith('neutral');
  });

  it('should debounce API calls when changing emotions', async () => {
    const { result } = renderHook(() => useEmotionSelection());

    // Change emotion
    act(() => {
      result.current.handleEmotionChange('joy');
    });

    // API should not be called immediately
    expect(mockCreateEmotion).not.toHaveBeenCalled();

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now API should be called
    expect(mockCreateEmotion).toHaveBeenCalledWith({ type: 'joy' });
  });

  it('should not make duplicate API calls for the same emotion change', async () => {
    mockCreateEmotion.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const { result } = renderHook(() => useEmotionSelection());

    // Change emotion
    act(() => {
      result.current.handleEmotionChange('joy');
    });

    // Fast-forward past debounce time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // API should be called once
    expect(mockCreateEmotion).toHaveBeenCalledTimes(1);

    // Change emotion again while first request is still in progress
    act(() => {
      result.current.handleEmotionChange('sadness');
    });

    // Fast-forward past debounce time again
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Second emotion should be set in state
    expect(mockSetEmotion).toHaveBeenCalledWith('sadness');

    // But API should still only be called once until first request completes
    expect(mockCreateEmotion).toHaveBeenCalledTimes(1);
  });

  it('should show error toast when API call fails', async () => {
    // Mock error in useEmotionService
    (useEmotionService as jest.Mock).mockReturnValue({
      createEmotion: mockCreateEmotion,
      isCreating: false,
      error: new Error('API error'),
    });

    renderHook(() => useEmotionSelection());

    // Error toast should be shown
    expect(Toast.show).toHaveBeenCalledWith({
      content: 'Failed to save emotion. Please try again.',
      position: 'bottom',
    });
  });

  it('should correctly report loading state', () => {
    const { result } = renderHook(() => useEmotionSelection());

    // Initially no emotions should be loading
    expect(result.current.isLoading('joy')).toBe(false);

    // Change emotion to trigger loading state
    act(() => {
      result.current.handleEmotionChange('joy');
    });

    // Joy should now be in loading state
    expect(result.current.isLoading('joy')).toBe(true);

    // Other emotions should not be loading
    expect(result.current.isLoading('sadness')).toBe(false);
  });
});

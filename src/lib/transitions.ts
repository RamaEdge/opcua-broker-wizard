
import { useEffect, useState } from 'react';

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export const useTransition = (
  mounted: boolean,
  enterTimeout: number = 300,
  exitTimeout: number = 200
): [boolean, TransitionState] => {
  const [currentState, setCurrentState] = useState<TransitionState>(
    mounted ? 'entered' : 'exited'
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (mounted && (currentState === 'exiting' || currentState === 'exited')) {
      setCurrentState('entering');
      timeoutId = setTimeout(() => {
        setCurrentState('entered');
      }, enterTimeout);
    } else if (!mounted && (currentState === 'entering' || currentState === 'entered')) {
      setCurrentState('exiting');
      timeoutId = setTimeout(() => {
        setCurrentState('exited');
      }, exitTimeout);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [mounted, currentState, enterTimeout, exitTimeout]);

  const isDisplayed = currentState !== 'exited';

  return [isDisplayed, currentState];
};

export const getTransitionClasses = (
  state: TransitionState,
  styles: {
    entering: string;
    entered: string;
    exiting: string;
    exited: string;
  }
): string => {
  return styles[state];
};

import { useState, useCallback } from 'react';

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing modal/dialog state
 * 
 * @param initialState Initial open/closed state
 * @returns Modal state and control functions
 * 
 * @example
 * ```typescript
 * const modal = useModal();
 * 
 * <Button onPress={modal.open}>Open Modal</Button>
 * <Modal visible={modal.isOpen} onClose={modal.close}>
 *   ...
 * </Modal>
 * ```
 */
export function useModal(initialState: boolean = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * Modal — a centered overlay dialog with title bar and close button.
 *
 * Locks body scroll while open and closes when clicking the overlay backdrop.
 *
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Expense">
 *   <form>…</form>
 * </Modal>
 * ```
 */

import React, { useEffect } from 'react';
import './Modal.css';
import { X } from 'lucide-react';

/** Props for the {@link Modal} component. */
export interface ModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Callback fired when the user requests to close the modal. */
  onClose: () => void;
  /** Heading text rendered in the modal header bar. */
  title: string;
  /** Content rendered inside the modal body. */
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

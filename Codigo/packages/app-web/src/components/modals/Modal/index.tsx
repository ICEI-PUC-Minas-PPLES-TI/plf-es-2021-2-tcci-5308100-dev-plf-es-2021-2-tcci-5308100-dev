import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal as ModalBootstrap } from 'react-bootstrap';

interface ModalSimpleProps {
  children?: JSX.Element | JSX.Element[];
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalProps extends ModalSimpleProps {
  show: boolean;
  handleClose: () => void;
}

export interface ModalMethods {
  showModal: () => void;
  closeModal: () => void;
  getStates: () => {
    show: boolean;
  };
}

export type ModalPattern = { ref: React.RefObject<ModalMethods> } & ModalSimpleProps;

const Modal: React.FunctionComponent<ModalProps> = ({ children, title, size = 'md', show, handleClose }) => {
  return (
    <ModalBootstrap show={show} onHide={handleClose} size={size === 'md' ? undefined : size}>
      <ModalBootstrap.Header closeButton>
        <ModalBootstrap.Title>{title}</ModalBootstrap.Title>
      </ModalBootstrap.Header>
      {children}
      {/* <div className='modal-body'></div>
          <div className='modal-footer'></div> */}
    </ModalBootstrap>
  );
};

export const ModalWithMethods = forwardRef<ModalMethods, ModalSimpleProps>((props, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useImperativeHandle(ref, () => ({
    showModal: () => setShow(true),
    closeModal: handleClose,
    getStates: () => ({ show }),
  }));

  return Modal({ show: show, handleClose: handleClose, ...props });
});

export default Modal;

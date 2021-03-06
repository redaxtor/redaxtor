import React from 'react';
import i18n from '../i18n';

export interface IPanelHandlerProps {
  isCollapsable: boolean,
  onMouseDown: (e: React.MouseEvent) => void,
  toggleOpen: (e: React.MouseEvent) => void,
  isOpen: boolean,
  message?: {
    content: string,
    type: string,
  }
}

export const PanelHandler = (
  {
    isCollapsable, toggleOpen, onMouseDown, isOpen, message,
  }: IPanelHandlerProps,
) => (
  <div role="button" tabIndex={-1} className="r_bar-header" onMouseDown={onMouseDown} onClick={toggleOpen}>
    <span>{i18n.bar.title}</span>
    {isCollapsable
    && (
    <button className="r_bar-header-button" type="button">
      {isOpen ? <i className="rx_icon rx_icon-keyboard_arrow_down" />
        : <i className="rx_icon rx_icon-keyboard_arrow_up" />}
    </button>
    )}
    {message ? <div className={`"r_message r_message-${message.type}"`}>{message.content}</div> : ''}
  </div>
);

export default PanelHandler;

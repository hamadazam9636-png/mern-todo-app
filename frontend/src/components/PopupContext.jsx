import React, { createContext, useState, useContext } from 'react';
import Popup from '../components/Popup'

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [popupConfig, setPopupConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
  });

  const showPopup = (title, message, type = 'info', onConfirm = null) => {
    setPopupConfig({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        closePopup();
      },
    });
  };

  const closePopup = () => {
    setPopupConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}

      <Popup
        isOpen={popupConfig.isOpen}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
        onConfirm={popupConfig.onConfirm}
        onCancel={closePopup}
      />
    </PopupContext.Provider>
  );
}

export const usePopup = () => useContext(PopupContext);
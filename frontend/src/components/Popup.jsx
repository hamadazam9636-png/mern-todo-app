import React from 'react';
import '../style/popup.css';

function Popup({ isOpen, title, message, onConfirm, onCancel, type = "danger" }) {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card animate-pop">
        <div className="popup-header">
          <div className={`popup-icon-wrapper ${type}`}>
            {type === "danger" ? "⚠️" : "ℹ️"}
          </div>
          <h3 className="popup-title">{title}</h3>
        </div>
        
        <div className="popup-body">
          <p>{message}</p>
        </div>

        <div className="popup-actions">
          <button className="popup-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className={`popup-btn-confirm ${type}`} onClick={onConfirm}>
            {type === "danger" ? "Delete" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
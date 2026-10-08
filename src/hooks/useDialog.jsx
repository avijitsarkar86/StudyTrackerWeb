import { useCallback, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export function useDialog() {
  const [dialog, setDialog] = useState(null);
  const [toastState, setToastState] = useState(null);

  const confirm = useCallback(
    (message, { title = 'Confirm action', dangerous = false } = {}) =>
      new Promise((resolve) => setDialog({ message, title, dangerous, resolve })),
    [],
  );

  const showToast = useCallback((message, variant = 'success') => {
    setToastState({ message, variant });
    setTimeout(() => setToastState(null), 3000);
  }, []);

  const handleConfirm = () => { dialog?.resolve(true); setDialog(null); };
  const handleCancel = () => { dialog?.resolve(false); setDialog(null); };

  const Dialog = (
    <>
      {dialog && (
        <div className="overlay" onClick={handleCancel}>
          <div className="modal confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <AlertTriangle size={28} color={dialog.dangerous ? '#e53e3e' : '#d69e2e'} />
            </div>
            <h3 className="confirm-title">{dialog.title}</h3>
            <p className="confirm-msg">{dialog.message}</p>
            <div className="row-actions confirm-actions">
              <button className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
              <button
                className={dialog.dangerous ? 'btn btn-danger' : 'btn btn-primary'}
                onClick={handleConfirm}
              >
                {dialog.dangerous ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
      {toastState && (
        <div className={`toast toast-${toastState.variant}`}>
          {toastState.variant === 'success' && <CheckCircle2 size={14} />}
          {toastState.variant === 'error' && <X size={14} />}
          {toastState.variant === 'info' && <Info size={14} />}
          {toastState.message}
        </div>
      )}
    </>
  );

  return { confirm, showToast, Dialog };
}

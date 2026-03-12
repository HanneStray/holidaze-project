import { useEffect } from "react";

/**
 * Fixed-position success toast notification.
 * Auto-dismisses after 3 seconds.
 * @param {object} props
 * @param {string} props.message - The message to display. Renders nothing when empty.
 * @param {function} props.onClose - Called when the toast should be dismissed.
 * @returns {JSX.Element|null}
 */
export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm text-white shadow-lg animate-slideUp">
      <span aria-hidden="true">✓</span>
      <span>{message}</span>
    </div>
  );
}

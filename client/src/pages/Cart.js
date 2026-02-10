// src/pages/Cart.js
import useActivityTracker from '../hooks/useActivityTracker';  // Correct: no braces for default import


export default function Cart() {
  const userId = localStorage.getItem('userId');
  const sessionId = localStorage.getItem('sessionId');
  const { trackEvent } = useActivityTracker(userId, sessionId);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shopping Cart</h1>
      <p>Your cart is empty</p>
      <button onClick={() => trackEvent('checkout_start', '/cart')}>
        Proceed to Checkout
      </button>
    </div>
  );
}

export default function OrderSuccessPopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-200">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">Order Placed Successfully!</h2>
        <p className="mb-6">Thank you for shopping with us.</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

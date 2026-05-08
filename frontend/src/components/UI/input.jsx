export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
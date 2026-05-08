export default function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {children}
      </select>
    </div>
  );
}
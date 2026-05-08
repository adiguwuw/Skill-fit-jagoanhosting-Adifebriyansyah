export default function Card({ title, children }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      {title && (
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
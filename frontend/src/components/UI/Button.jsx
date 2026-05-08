export default function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-sm transition ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
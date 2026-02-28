// Create a file: components/SimpleCard.jsx
const SimpleCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default SimpleCard;

// Then use it like:
// <SimpleCard title="Summaries This Week">
//   Your content here
// </SimpleCard>
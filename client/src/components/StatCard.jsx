export default function StatCard({ label, value }) {
  return (
    <div className="panel">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-2 text-3xl font-bold dark:text-white">{value ?? 0}</p>
    </div>
  );
}

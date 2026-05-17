export default function StatCard({ label, value }) {
  return (
    <div className="panel">
      <p className="text-sm text-stone-500 dark:text-stone-400">{label}</p>
      <p className="mt-2 text-2xl font-bold dark:text-white sm:text-3xl">{value ?? 0}</p>
    </div>
  );
}

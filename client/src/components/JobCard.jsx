import { Bookmark, MapPin, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobCard({ job, onSave }) {
  return (
    <article className="panel flex flex-col gap-4">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-ink hover:text-brand dark:text-white transition-colors duration-300">{job.title}</Link>
            <p className="text-sm text-stone-500 dark:text-stone-400">{job.company?.name || 'Company pending'}</p>
          </div>
          {onSave && (
            <button className="btn-secondary h-9 w-9 p-0" onClick={() => onSave(job._id)} title="Save job">
              <Bookmark className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-stone-600 dark:text-stone-300">{job.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-stone-600 dark:text-stone-300">
        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 dark:bg-stone-800"><MapPin className="h-3 w-3" />{job.location}</span>
        <span className="rounded-full bg-stone-100 px-3 py-1 dark:bg-stone-800">{job.jobType}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 dark:bg-stone-800"><WalletCards className="h-3 w-3" />{job.salaryMin || 0} - {job.salaryMax || 'Open'}</span>
      </div>
    </article>
  );
}

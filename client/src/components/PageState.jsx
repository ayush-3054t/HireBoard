import { AlertCircle, BriefcaseBusiness, LoaderCircle } from 'lucide-react';

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-48 items-center justify-center px-4 py-10" role="status" aria-live="polite">
      <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-brand" aria-hidden="true" />
      <span className="text-sm text-stone-600 dark:text-stone-300">{label}</span>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        <BriefcaseBusiness className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-semibold text-ink dark:text-white">{title}</h2>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-stone-500 dark:text-stone-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center" role="alert">
      <AlertCircle className="h-7 w-7 text-accent" aria-hidden="true" />
      <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">{message}</p>
      {onRetry && <button type="button" className="btn-secondary mt-4" onClick={onRetry}>Try again</button>}
    </div>
  );
}

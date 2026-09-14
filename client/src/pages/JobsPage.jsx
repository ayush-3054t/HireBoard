import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

export default function JobsPage() {
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    salaryMin: searchParams.get('salaryMin') || ''
  }));
  const [loading, setLoading] = useState(true);

  const loadJobs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs', { params: { ...filters, page } });
      setJobs(data.jobs);
      setMeta({ page: data.page, pages: data.pages });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const saveJob = async (id) => {
    try {
      await api.post(`/users/saved/${id}`);
      toast.success('Bookmark updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login as a job seeker to save jobs');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <div className="mb-6 animate-rise-in">
        <h1 className="text-2xl font-bold dark:text-white sm:text-3xl">Job listings</h1>
        <p className="mt-1 text-stone-500">Find a role that fits your skills, goals, and lifestyle.</p>
      </div>
      <form className="panel mb-6 grid gap-3 border-teal-100 bg-gradient-to-br from-white to-teal-50/40 animate-rise-in dark:border-teal-900 dark:from-stone-900 dark:to-teal-950/30 md:grid-cols-6" onSubmit={(e) => { e.preventDefault(); loadJobs(); }}>
        <label className="relative md:col-span-2">
          <span className="sr-only">Search jobs</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input className="input pl-9" placeholder="Role, skill, or keyword" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </label>
        <input className="input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="input" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">Any type</option>
          {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => <option key={type}>{type}</option>)}
        </select>
        <input className="input" type="number" min="0" placeholder="Min salary" value={filters.salaryMin} onChange={(e) => setFilters({ ...filters, salaryMin: e.target.value })} />
        <button className="btn-primary"><SlidersHorizontal className="h-4 w-4" /> Show jobs</button>
      </form>
      {!loading && jobs.length > 0 && <div className="mb-4 flex items-center justify-between text-sm text-stone-500"><span>{jobs.length} roles on this page</span><span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-400"><Sparkles className="h-4 w-4" /> Fresh opportunities</span></div>}
      {loading ? <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="panel h-52 animate-pulse bg-stone-100 dark:bg-stone-800" />)}</div> : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => <JobCard key={job._id} job={job} onSave={role === 'user' ? saveJob : null} />)}
        </div>
      )}
      {!loading && !jobs.length && <p className="panel">No jobs found.</p>}
      <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <button className="btn-secondary" disabled={meta.page <= 1} onClick={() => loadJobs(meta.page - 1)}>Previous</button>
        <button className="btn-secondary" disabled={meta.page >= meta.pages} onClick={() => loadJobs(meta.page + 1)}>Next</button>
      </div>
    </main>
  );
}

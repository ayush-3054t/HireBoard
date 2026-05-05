import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';

export default function JobsPage() {
  const { role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: '', location: '', jobType: '', salaryMin: '' });
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
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Job listings</h1>
        <p className="text-stone-500">Search approved jobs by role, location, type, and salary.</p>
      </div>
      <form className="panel mb-6 grid gap-3 md:grid-cols-5" onSubmit={(e) => { e.preventDefault(); loadJobs(); }}>
        <input className="input md:col-span-2" placeholder="Search title or skills" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input className="input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <select className="input" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">Any type</option>
          {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => <option key={type}>{type}</option>)}
        </select>
        <button className="btn-primary">Filter</button>
      </form>
      {loading ? <p>Loading jobs...</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => <JobCard key={job._id} job={job} onSave={role === 'user' ? saveJob : null} />)}
        </div>
      )}
      {!loading && !jobs.length && <p className="panel">No jobs found.</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-secondary" disabled={meta.page <= 1} onClick={() => loadJobs(meta.page - 1)}>Previous</button>
        <button className="btn-secondary" disabled={meta.page >= meta.pages} onClick={() => loadJobs(meta.page + 1)}>Next</button>
      </div>
    </main>
  );
}

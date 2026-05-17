import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../api/axios';
import StatCard from '../components/StatCard';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [job, setJob] = useState({ title: '', description: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', skills: '' });
  const [company, setCompany] = useState({ name: '', location: '', industry: '', website: '', description: '' });
  const [applicants, setApplicants] = useState([]);

  const load = async () => {
    const [{ data: dash }, { data: comp }] = await Promise.all([api.get('/recruiters/dashboard'), api.get('/companies/me')]);
    setData(dash);
    if (comp) setCompany({ ...company, ...comp });
  };

  useEffect(() => { load().catch(() => toast.error('Unable to load recruiter dashboard')); }, []);

  const postJob = async (event) => {
    event.preventDefault();
    try {
      await api.post('/jobs', { ...job, skills: job.skills.split(',').map((s) => s.trim()).filter(Boolean) });
      toast.success('Job submitted for admin approval');
      setJob({ title: '', description: '', location: '', jobType: 'Full-time', salaryMin: '', salaryMax: '', skills: '' });
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Job post failed');
    }
  };

  const saveCompany = async (event) => {
    event.preventDefault();
    await api.put('/companies/me', company);
    toast.success('Company saved');
    load();
  };

  const viewApplicants = async (jobId) => {
    const { data } = await api.get(`/applications/jobs/${jobId}/applicants`);
    setApplicants(data);
  };

  const setStatus = async (id, status) => {
    await api.patch(`/applications/${id}/status`, { status });
    toast.success('Application updated');
    setApplicants((items) => items.map((app) => app._id === id ? { ...app, status } : app));
  };

  if (!data) return <main className="mx-auto max-w-7xl px-4 py-10">Loading...</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold dark:text-white sm:text-3xl">Recruiter dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard label="Jobs" value={data.totalJobs} />
        <StatCard label="Approved" value={data.approvedJobs} />
        <StatCard label="Pending" value={data.pendingJobs} />
        <StatCard label="Applicants" value={data.applicantsCount} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="panel space-y-3" onSubmit={saveCompany}>
          <h2 className="font-semibold dark:text-white">Company profile</h2>
          {['name', 'location', 'industry', 'website'].map((key) => <input key={key} className="input" placeholder={key} value={company[key] || ''} onChange={(e) => setCompany({ ...company, [key]: e.target.value })} />)}
          <textarea className="input" placeholder="description" value={company.description || ''} onChange={(e) => setCompany({ ...company, description: e.target.value })} />
          <button className="btn-primary">Save company</button>
        </form>
        <form className="panel space-y-3" onSubmit={postJob}>
          <h2 className="font-semibold dark:text-white">Post job</h2>
          {['title', 'location', 'salaryMin', 'salaryMax', 'skills'].map((key) => <input key={key} className="input" placeholder={key} value={job[key]} onChange={(e) => setJob({ ...job, [key]: e.target.value })} />)}
          <select className="input" value={job.jobType} onChange={(e) => setJob({ ...job, jobType: e.target.value })}>{['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => <option key={type}>{type}</option>)}</select>
          <textarea className="input min-h-24" placeholder="description" value={job.description} onChange={(e) => setJob({ ...job, description: e.target.value })} />
          <button className="btn-primary">Submit job</button>
        </form>
      </div>
      <section className="panel mt-6">
        <h2 className="font-semibold dark:text-white">Posted jobs</h2>
        <div className="mt-4 divide-y divide-stone-200 dark:divide-stone-800">
          {data.jobs.map((item) => (
            <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between" key={item._id}>
              <div className="min-w-0"><p className="break-words font-medium dark:text-white">{item.title}</p><p className="text-sm text-stone-500">{item.status} · {item.location}</p></div>
              <button className="btn-secondary w-full sm:w-auto" onClick={() => viewApplicants(item._id)}>Applicants</button>
            </div>
          ))}
        </div>
      </section>
      {!!applicants.length && <section className="panel mt-6">
        <h2 className="font-semibold dark:text-white">Applicants</h2>
        {applicants.map((app) => (
          <div className="flex flex-col gap-3 border-b border-stone-200 py-3 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between" key={app._id}>
            <div className="flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800 shrink-0">
                {app.user?.profilePhoto ? (
                  <img src={`${API_BASE_URL}/${app.user.profilePhoto.startsWith('/') ? app.user.profilePhoto.slice(1) : app.user.profilePhoto}`} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-stone-500">No Img</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium dark:text-white">{app.user?.name}</p>
                <p className="break-all text-sm text-stone-500">{app.user?.email} · {app.status}</p>
              </div>
            </div>
            <div className="grid gap-2 sm:flex sm:flex-wrap">
              {app.resume && (
                <a href={`${API_BASE_URL}/${app.resume.startsWith('/') ? app.resume.slice(1) : app.resume}`} target="_blank" rel="noopener noreferrer" className="btn-secondary whitespace-nowrap text-brand">View Resume</a>
              )}
              <button className="btn-secondary" onClick={() => setStatus(app._id, 'accepted')}>Accept</button>
              <button className="btn-secondary" onClick={() => setStatus(app._id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </section>}
    </main>
  );
}

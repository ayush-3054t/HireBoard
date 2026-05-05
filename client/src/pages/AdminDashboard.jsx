import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    const [dash, userList, recruiterList, jobList] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/admin/users'),
      api.get('/admin/recruiters'),
      api.get('/admin/jobs')
    ]);
    setStats(dash.data);
    setUsers(userList.data.items);
    setRecruiters(recruiterList.data.items);
    setJobs(jobList.data.jobs);
  };

  useEffect(() => { load().catch(() => toast.error('Unable to load admin dashboard')); }, []);

  const toggle = async (type, id) => {
    await api.patch(`/admin/${type}/${id}/block`);
    toast.success('Account updated');
    load();
  };

  const moderate = async (id, status) => {
    await api.patch(`/jobs/${id}/status`, { status });
    toast.success(`Job ${status}`);
    load();
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`);
    toast.success('Job deleted');
    load();
  };

  if (!stats) return <main className="mx-auto max-w-7xl px-4 py-10">Loading...</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Admin control panel</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Recruiters" value={stats.totalRecruiters} />
        <StatCard label="Jobs" value={stats.totalJobs} />
        <StatCard label="Pending Jobs" value={stats.pendingJobs} />
        <StatCard label="Applications" value={stats.applications} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AccountPanel title="Users" items={users} type="users" onToggle={toggle} />
        <AccountPanel title="Recruiters" items={recruiters} type="recruiters" onToggle={toggle} />
      </div>
      <section className="panel mt-6">
        <h2 className="font-semibold dark:text-white">Job moderation</h2>
        <div className="mt-4 divide-y divide-stone-200 dark:divide-stone-800">
          {jobs.map((job) => (
            <div className="flex flex-wrap items-center justify-between gap-3 py-3" key={job._id}>
              <div>
                <p className="font-medium dark:text-white">{job.title}</p>
                <p className="text-sm text-stone-500">{job.location} · {job.status}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => moderate(job._id, 'approved')}>Approve</button>
                <button className="btn-secondary" onClick={() => moderate(job._id, 'rejected')}>Reject</button>
                <button className="btn-secondary" onClick={() => deleteJob(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function AccountPanel({ title, items, type, onToggle }) {
  return (
    <section className="panel">
      <h2 className="font-semibold dark:text-white">{title}</h2>
      <div className="mt-4 divide-y divide-stone-200 dark:divide-stone-800">
        {items.map((item) => (
          <div className="flex items-center justify-between gap-3 py-3" key={item._id}>
            <div>
              <p className="font-medium dark:text-white">{item.name}</p>
              <p className="text-sm text-stone-500">{item.email} · {item.isBlocked ? 'Blocked' : 'Active'}</p>
            </div>
            <button className="btn-secondary" onClick={() => onToggle(type, item._id)}>{item.isBlocked ? 'Unblock' : 'Block'}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

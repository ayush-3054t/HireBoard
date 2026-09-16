import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Check, 
  X, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { EmptyState, LoadingState } from '../components/PageState';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');

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

  useEffect(() => {
    load().catch(() => toast.error('Unable to load admin dashboard'));
  }, []);

  const toggle = async (type, id) => {
    try {
      await api.patch(`/admin/${type}/${id}/block`);
      toast.success('Account updated');
      await load();
    } catch (error) {
      toast.error('Failed to update account status');
    }
  };

  const moderate = async (id, status) => {
    try {
      await api.patch(`/jobs/${id}/status`, { status });
      toast.success(`Job marked as ${status}`);
      await load();
    } catch (error) {
      toast.error(`Failed to update job`);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job permanently?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (!stats) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <LoadingState label="Loading admin control panel…" />
      </main>
    );
  }

  const pendingJobsCount = jobs.filter((j) => j.status === 'pending').length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink dark:text-white sm:text-3xl">
          Admin Control Center
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Moderate submitted jobs, manage platform users, and track platform activity.
        </p>
      </div>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
        <StatCard label="Total Candidates" value={stats.totalUsers} />
        <StatCard label="Recruiters" value={stats.totalRecruiters} />
        <StatCard label="Total Jobs" value={stats.totalJobs} />
        <StatCard label="Pending Approval" value={stats.pendingJobs} />
        <StatCard label="Applications" value={stats.applications} />
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b border-stone-200 dark:border-stone-800">
        <nav className="flex space-x-2 sm:space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'jobs'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Job Moderation</span>
            {pendingJobsCount > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                {pendingJobsCount} pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'users'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Candidates</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {users.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recruiters')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'recruiters'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Recruiters</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {recruiters.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {/* TAB 1: JOB MODERATION */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink dark:text-white">All Platform Jobs</h2>

            {jobs && jobs.length > 0 ? (
              <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {jobs.map((job) => (
                  <div key={job._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink dark:text-white">{job.title}</h3>
                        <StatusBadge status={job.status} />
                      </div>
                      <p className="mt-1 text-sm text-stone-500">
                        {job.company?.name || 'Company'} • {job.location || 'Remote'} • {job.jobType}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {job.status !== 'approved' && (
                        <button
                          onClick={() => moderate(job._id, 'approved')}
                          className="btn-secondary inline-flex items-center gap-1 text-xs text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 sm:text-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                      )}
                      {job.status !== 'rejected' && (
                        <button
                          onClick={() => moderate(job._id, 'rejected')}
                          className="btn-secondary inline-flex items-center gap-1 text-xs text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30 sm:text-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteJob(job._id)}
                        className="btn-secondary inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 sm:text-sm"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No jobs on the platform" description="Jobs submitted by recruiters will appear here for moderation." />
            )}
          </div>
        )}

        {/* TAB 2: CANDIDATES */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink dark:text-white">Registered Job Seekers</h2>
            <AccountPanel items={users} type="users" onToggle={toggle} />
          </div>
        )}

        {/* TAB 3: RECRUITERS */}
        {activeTab === 'recruiters' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-ink dark:text-white">Registered Employers & Recruiters</h2>
            <AccountPanel items={recruiters} type="recruiters" onToggle={toggle} />
          </div>
        )}
      </div>
    </main>
  );
}

function AccountPanel({ items, type, onToggle }) {
  if (!items || items.length === 0) {
    return <EmptyState title="No accounts found" description={`No ${type} registered yet.`} />;
  }

  return (
    <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
      {items.map((item) => (
        <div key={item._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink dark:text-white">{item.name}</p>
              {item.isBlocked && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  Blocked
                </span>
              )}
            </div>
            <p className="text-sm text-stone-500">{item.email}</p>
          </div>
          <button
            className={`btn-secondary text-xs sm:text-sm ${
              item.isBlocked
                ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400'
                : 'text-red-600 hover:bg-red-50 dark:text-red-400'
            }`}
            onClick={() => onToggle(type, item._id)}
          >
            {item.isBlocked ? 'Unblock Account' : 'Block Account'}
          </button>
        </div>
      ))}
    </div>
  );
}

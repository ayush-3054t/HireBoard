import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  Building2, 
  MapPin, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import api from '../api/axios';
import { assetUrl } from '../utils/assetUrl';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { EmptyState, LoadingState } from '../components/PageState';

export default function RecruiterDashboard() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [job, setJob] = useState({ 
    title: '', 
    description: '', 
    location: '', 
    jobType: 'Full-time', 
    salaryMin: '', 
    salaryMax: '', 
    skills: '' 
  });
  const [company, setCompany] = useState({ 
    name: '', 
    location: '', 
    industry: '', 
    website: '', 
    description: '' 
  });
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [{ data: dash }, { data: comp }] = await Promise.all([
      api.get('/recruiters/dashboard'),
      api.get('/companies/me')
    ]);
    setData(dash);
    if (comp) setCompany((prev) => ({ ...prev, ...comp }));
  };

  useEffect(() => {
    load().catch(() => toast.error('Unable to load recruiter dashboard'));
  }, []);

  const postJob = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = { 
        ...job, 
        skills: typeof job.skills === 'string' 
          ? job.skills.split(',').map((s) => s.trim()).filter(Boolean) 
          : job.skills 
      };
      
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job posted and submitted for review!');
      }

      setJob({ 
        title: '', 
        description: '', 
        location: '', 
        jobType: 'Full-time', 
        salaryMin: '', 
        salaryMax: '', 
        skills: '' 
      });
      setEditingJobId(null);
      setActiveTab('jobs');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save job');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditJob = (item) => {
    setEditingJobId(item._id);
    setJob({
      title: item.title || '',
      description: item.description || '',
      location: item.location || '',
      jobType: item.jobType || 'Full-time',
      salaryMin: item.salaryMin || '',
      salaryMax: item.salaryMax || '',
      skills: item.skills?.join(', ') || ''
    });
    setActiveTab('post');
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setJob({ 
      title: '', 
      description: '', 
      location: '', 
      jobType: 'Full-time', 
      salaryMin: '', 
      salaryMax: '', 
      skills: '' 
    });
    setActiveTab('jobs');
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job and its applications?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      toast.success('Job deleted');
      if (editingJobId === id) cancelEdit();
      if (selectedJob?._id === id) {
        setSelectedJob(null);
        setApplicants([]);
      }
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete job');
    }
  };

  const saveCompany = async (event) => {
    event.preventDefault();
    try {
      await api.put('/companies/me', company);
      toast.success('Company details saved');
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save company');
    }
  };

  const viewApplicants = async (item) => {
    setSelectedJob(item);
    setActiveTab('applicants');
    setLoadingApplicants(true);
    try {
      const { data } = await api.get(`/applications/jobs/${item._id}/applicants`);
      setApplicants(data);
    } catch (error) {
      toast.error('Failed to load applicants for this job');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      toast.success(`Application marked as ${status}`);
      setApplicants((items) => 
        items.map((app) => (app._id === id ? { ...app, status } : app))
      );
    } catch (error) {
      toast.error('Unable to update application status');
    }
  };

  if (!data) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <LoadingState label="Loading recruiter dashboard…" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
            <Building2 className="h-4 w-4" />
            <span>{company.name || 'Recruiter Portal'}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink dark:text-white sm:text-3xl">
            Recruiter Workspace
          </h1>
          <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
            Publish open roles, review incoming candidates, and manage your company profile.
          </p>
        </div>

        <button
          onClick={() => {
            cancelEdit();
            setActiveTab('post');
          }}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Post New Job
        </button>
      </div>

      {/* Metrics Row */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Jobs Posted" value={data.totalJobs} />
        <StatCard label="Live / Approved" value={data.approvedJobs} />
        <StatCard label="Pending Approval" value={data.pendingJobs} />
        <StatCard label="Total Candidates" value={data.applicantsCount} />
      </div>

      {/* Navigation Tabs */}
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
            <Briefcase className="h-4 w-4" />
            <span>Manage Jobs</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {data.jobs?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applicants')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'applicants'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Applicants</span>
            {selectedJob && (
              <span className="max-w-[120px] truncate rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand dark:bg-brand/20 dark:text-blue-300 sm:max-w-none">
                {selectedJob.title}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (editingJobId) cancelEdit();
              setActiveTab('post');
            }}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'post'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{editingJobId ? 'Edit Job' : 'Post a Job'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'company'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Company Profile</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {/* TAB 1: MANAGE JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">Your Posted Jobs</h2>
                <p className="text-sm text-stone-500">Monitor approval status and click 'Applicants' to review candidates.</p>
              </div>
            </div>

            {data.jobs && data.jobs.length > 0 ? (
              <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {data.jobs.map((item) => (
                  <div key={item._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink dark:text-white">{item.title}</h3>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 text-sm text-stone-500">
                        {item.location || 'Remote'} • {item.jobType || 'Full-time'}
                        {item.salaryMin ? ` • $${item.salaryMin.toLocaleString()} - $${item.salaryMax?.toLocaleString()}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => viewApplicants(item)}
                        className="btn-primary inline-flex items-center gap-1.5 text-xs sm:text-sm"
                      >
                        <Users className="h-4 w-4" />
                        Applicants
                      </button>
                      <button
                        onClick={() => startEditJob(item)}
                        className="btn-secondary inline-flex items-center gap-1 text-xs sm:text-sm"
                        title="Edit Job"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteJob(item._id)}
                        className="btn-secondary inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 sm:text-sm"
                        title="Delete Job"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <EmptyState
                  title="No jobs published yet"
                  description="You haven't posted any jobs. Create your first listing now to start receiving applicants."
                />
                <div className="mt-4">
                  <button onClick={() => setActiveTab('post')} className="btn-primary">
                    Create a Job Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPLICANTS */}
        {activeTab === 'applicants' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">
                  {selectedJob ? `Applicants for: ${selectedJob.title}` : 'Candidate Applications'}
                </h2>
                <p className="text-sm text-stone-500">
                  {selectedJob 
                    ? `Review candidate profiles, inspect resumes, and update application status.`
                    : `Select one of your jobs below to inspect applicants.`}
                </p>
              </div>

              {data.jobs?.length > 1 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-stone-500">Switch job:</label>
                  <select
                    className="input py-1 text-xs sm:w-60"
                    value={selectedJob?._id || ''}
                    onChange={(e) => {
                      const found = data.jobs.find((j) => j._id === e.target.value);
                      if (found) viewApplicants(found);
                    }}
                  >
                    <option value="" disabled>Select a job...</option>
                    {data.jobs.map((j) => (
                      <option key={j._id} value={j._id}>{j.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {loadingApplicants ? (
              <div className="p-8 text-center">
                <LoadingState label="Loading applicants…" />
              </div>
            ) : !selectedJob ? (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <EmptyState
                  title="No job selected"
                  description="Choose a job from the 'Manage Jobs' tab to review candidates who have applied."
                />
                <div className="mt-4">
                  <button onClick={() => setActiveTab('jobs')} className="btn-primary">
                    View My Jobs
                  </button>
                </div>
              </div>
            ) : applicants.length > 0 ? (
              <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {applicants.map((app) => (
                  <div key={app._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
                        {app.user?.profilePhoto ? (
                          <img src={assetUrl(app.user.profilePhoto)} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-stone-500">
                            {app.user?.name?.charAt(0) || 'C'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-ink dark:text-white">{app.user?.name || 'Applicant'}</h4>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-xs text-stone-500">{app.user?.email}</p>
                        {app.user?.phone && <p className="text-xs text-stone-400">{app.user.phone}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {app.resume && (
                        <a
                          href={assetUrl(app.resume)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center gap-1.5 text-xs text-brand hover:text-brand sm:text-sm"
                        >
                          <FileText className="h-4 w-4" />
                          Resume
                        </a>
                      )}
                      <button
                        onClick={() => setStatus(app._id, 'reviewing')}
                        className="btn-secondary text-xs text-sky-600 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-950/30 sm:text-sm"
                      >
                        Reviewing
                      </button>
                      <button
                        onClick={() => setStatus(app._id, 'accepted')}
                        className="btn-secondary text-xs text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 sm:text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setStatus(app._id, 'rejected')}
                        className="btn-secondary text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 sm:text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <EmptyState
                  title="No applicants yet"
                  description={`No candidates have applied to "${selectedJob.title}" yet. Check back soon!`}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POST / EDIT JOB */}
        {activeTab === 'post' && (
          <div className="max-w-3xl">
            <form onSubmit={postJob} className="panel space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink dark:text-white">
                    {editingJobId ? 'Edit Job Listing' : 'Post a New Job'}
                  </h2>
                  <p className="text-sm text-stone-500">
                    {editingJobId
                      ? 'Update listing details and requirements.'
                      : 'Create a new opening. Listings are reviewed for quality before going live.'}
                  </p>
                </div>
                {editingJobId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-sm font-medium text-stone-500 hover:underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Job Title *
                </label>
                <input
                  required
                  className="input mt-1"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={job.title}
                  onChange={(e) => setJob({ ...job, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Job Type
                  </label>
                  <select
                    className="input mt-1"
                    value={job.jobType}
                    onChange={(e) => setJob({ ...job, jobType: e.target.value })}
                  >
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Location *
                  </label>
                  <input
                    required
                    className="input mt-1"
                    placeholder="e.g. Remote or New York, NY"
                    value={job.location}
                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Min Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    placeholder="e.g. 90000"
                    value={job.salaryMin}
                    onChange={(e) => setJob({ ...job, salaryMin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Max Annual Salary ($)
                  </label>
                  <input
                    type="number"
                    className="input mt-1"
                    placeholder="e.g. 130000"
                    value={job.salaryMax}
                    onChange={(e) => setJob({ ...job, salaryMax: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Required Skills & Tags
                </label>
                <p className="text-xs text-stone-500 mb-1">Comma-separated keywords</p>
                <input
                  className="input"
                  placeholder="e.g. React, TypeScript, Tailwind, REST APIs"
                  value={job.skills}
                  onChange={(e) => setJob({ ...job, skills: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  Job Description *
                </label>
                <textarea
                  required
                  rows={5}
                  className="input mt-1"
                  placeholder="Describe the role responsibilities, ideal qualifications, and team..."
                  value={job.description}
                  onChange={(e) => setJob({ ...job, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {editingJobId && (
                  <button type="button" onClick={cancelEdit} className="btn-secondary">
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary min-w-36" disabled={submitting}>
                  {submitting ? 'Submitting…' : editingJobId ? 'Save Changes' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: COMPANY PROFILE */}
        {activeTab === 'company' && (
          <div className="max-w-3xl">
            <form onSubmit={saveCompany} className="panel space-y-5">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">Company Information</h2>
                <p className="text-sm text-stone-500">Keep company info updated so job seekers know who you are.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Company Name
                  </label>
                  <input
                    className="input mt-1"
                    placeholder="e.g. Acme Corp"
                    value={company.name || ''}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Industry
                  </label>
                  <input
                    className="input mt-1"
                    placeholder="e.g. Technology / SaaS"
                    value={company.industry || ''}
                    onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Website URL
                  </label>
                  <input
                    type="url"
                    className="input mt-1"
                    placeholder="https://company.com"
                    value={company.website || ''}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Headquarters / Location
                  </label>
                  <input
                    className="input mt-1"
                    placeholder="e.g. San Francisco, CA"
                    value={company.location || ''}
                    onChange={(e) => setCompany({ ...company, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                  About Company
                </label>
                <textarea
                  rows={4}
                  className="input mt-1"
                  placeholder="Tell candidates about your company mission, culture, and benefits..."
                  value={company.description || ''}
                  onChange={(e) => setCompany({ ...company, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-primary min-w-36">
                  Save Company Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

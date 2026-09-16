import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Briefcase, 
  FileText, 
  Bookmark, 
  User, 
  MapPin, 
  Phone, 
  Upload, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search
} from 'lucide-react';
import api from '../api/axios';
import { assetUrl } from '../utils/assetUrl';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { EmptyState, LoadingState } from '../components/PageState';

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [profile, setProfile] = useState({ skills: '', location: '', phone: '' });
  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data: dashboard } = await api.get('/users/dashboard');
    setData(dashboard);
    setProfile({
      skills: dashboard.user.skills?.join(', ') || '',
      location: dashboard.user.location || '',
      phone: dashboard.user.phone || ''
    });
  };

  useEffect(() => {
    load().catch(() => toast.error('Unable to load dashboard'));
  }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    const form = new FormData();
    Object.entries(profile).forEach(([key, value]) => form.append(key, value));
    if (resume) form.append('resume', resume);
    if (profilePhoto) form.append('profilePhoto', profilePhoto);

    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated successfully!');
      setResume(null);
      setProfilePhoto(null);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        <LoadingState label="Loading your dashboard…" />
      </main>
    );
  }

  const photoUrl = assetUrl(data.user?.profilePhoto);
  const resumeUrl = assetUrl(data.user?.resume);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Welcome & Top Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-brand/20 bg-stone-100 shadow-sm dark:bg-stone-800">
            {photoUrl ? (
              <img src={photoUrl} alt={data.user?.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-stone-500">
                {data.user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink dark:text-white sm:text-3xl">
              Welcome back, {data.user?.name || 'Job Seeker'}!
            </h1>
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
              {data.user?.email} {data.user?.location ? `• ${data.user.location}` : ''}
            </p>
          </div>
        </div>
        <Link to="/jobs" className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
          <Search className="h-4 w-4" />
          Browse Open Jobs
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Applications" value={data.totalApplications} />
        <StatCard label="In Review" value={data.reviewing} />
        <StatCard label="Accepted" value={data.accepted} />
        <StatCard label="Saved Jobs" value={data.savedJobs?.length || 0} />
      </div>

      {/* Clean Tab Navigation Bar */}
      <div className="mt-8 border-b border-stone-200 dark:border-stone-800">
        <nav className="flex space-x-2 sm:space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'applications'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Applications</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {data.totalApplications}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'saved'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Jobs</span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {data.savedJobs?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors sm:px-4 ${
              activeTab === 'profile'
                ? 'border-brand text-brand dark:text-brand'
                : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile & Resume</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div className="mt-6">
        {/* TAB 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">Your Applications</h2>
                <p className="text-sm text-stone-500">Track current status and progress of jobs you applied for.</p>
              </div>
            </div>

            {data.applications && data.applications.length > 0 ? (
              <div className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white shadow-sm dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
                {data.applications.map((app) => (
                  <div key={app._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${app.job?._id}`}
                          className="font-semibold text-ink hover:text-brand dark:text-white dark:hover:text-brand"
                        >
                          {app.job?.title || 'Job Position'}
                        </Link>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="mt-1 text-sm text-stone-500">
                        {app.job?.company?.name || 'Company'} • {app.job?.location || 'Remote'}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        Applied on {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="btn-secondary text-xs sm:text-sm"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <EmptyState
                  title="No applications yet"
                  description="You haven't submitted any job applications yet. Find open roles that match your skills and apply!"
                />
                <div className="mt-4">
                  <Link to="/jobs" className="btn-primary">
                    Explore Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-ink dark:text-white">Saved Roles</h2>
                <p className="text-sm text-stone-500">Quickly revisit and apply to opportunities you bookmarked.</p>
              </div>
            </div>

            {data.savedJobs && data.savedJobs.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex flex-col justify-between rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-brand/50 hover:shadow dark:border-stone-800 dark:bg-stone-900"
                  >
                    <div>
                      <h3 className="font-semibold text-ink dark:text-white line-clamp-1">{job.title}</h3>
                      <p className="mt-1 text-sm text-stone-500">{job.location || 'Location flexible'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-300">
                          {job.jobType || 'Full-time'}
                        </span>
                        {job.salaryMin && (
                          <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="btn-primary w-full text-center text-xs sm:text-sm"
                      >
                        View & Apply
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
                <EmptyState
                  title="No saved jobs"
                  description="Click the bookmark icon on any job card to save roles you want to compare or apply to later."
                />
                <div className="mt-4">
                  <Link to="/jobs" className="btn-primary">
                    Search Jobs
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & RESUME */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl">
            <form onSubmit={saveProfile} className="space-y-6">
              {/* Profile Photo & Info */}
              <div className="panel space-y-5">
                <h2 className="text-lg font-bold text-ink dark:text-white">Profile Details</h2>
                
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
                    {profilePhoto ? (
                      <img src={URL.createObjectURL(profilePhoto)} alt="Preview" className="h-full w-full object-cover" />
                    ) : photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                        No Photo
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Profile Picture
                    </label>
                    <p className="text-xs text-stone-500 mb-2">Upload a PNG or JPG avatar (max 5MB)</p>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="block w-full text-sm text-stone-500 file:mr-3 file:rounded-md file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-brand hover:file:bg-brand/20 dark:file:bg-brand/20 dark:file:text-blue-300"
                      onChange={(e) => setProfilePhoto(e.target.files[0] || null)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Phone Number
                    </label>
                    <input
                      className="input mt-1"
                      placeholder="+1 (555) 000-0000"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                      Location
                    </label>
                    <input
                      className="input mt-1"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    Skills & Technologies
                  </label>
                  <p className="text-xs text-stone-500 mb-1">Separate skills with commas</p>
                  <input
                    className="input"
                    placeholder="e.g. React, Node.js, Python, Figma, SQL"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                  />
                </div>
              </div>

              {/* Resume Section */}
              <div className="panel space-y-4">
                <h2 className="text-lg font-bold text-ink dark:text-white">Resume Document</h2>
                
                {resumeUrl ? (
                  <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-900 dark:text-emerald-200">
                        Resume currently on file
                      </span>
                    </div>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      View Current <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-stone-500">
                    No resume uploaded yet. Upload your PDF resume so employers can review your experience.
                  </p>
                )}

                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300">
                    {resumeUrl ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="mt-1 block w-full text-sm text-stone-500 file:mr-3 file:rounded-md file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-stone-700 hover:file:bg-stone-200 dark:file:bg-stone-800 dark:file:text-stone-300"
                    onChange={(e) => setResume(e.target.files[0] || null)}
                  />
                  {resume && (
                    <p className="mt-1 text-xs font-semibold text-brand">
                      Selected: {resume.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button type="submit" className="btn-primary min-w-36" disabled={saving}>
                  {saving ? 'Saving Changes…' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

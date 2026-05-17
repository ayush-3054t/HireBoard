import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../api/axios';
import StatCard from '../components/StatCard';

export default function UserDashboard() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState({ skills: '', location: '', phone: '' });
  const [resume, setResume] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const load = async () => {
    const { data } = await api.get('/users/dashboard');
    setData(data);
    if (data.user) {
      setProfile({
        skills: data.user.skills?.join(', ') || '',
        location: data.user.location || '',
        phone: data.user.phone || ''
      });
    }
  };

  useEffect(() => { load().catch(() => toast.error('Unable to load dashboard')); }, []);

  const saveProfile = async (event) => {
    event.preventDefault();
    const form = new FormData();
    Object.entries(profile).forEach(([key, value]) => form.append(key, value));
    if (resume) form.append('resume', resume);
    if (profilePhoto) form.append('profilePhoto', profilePhoto);
    try {
      await api.put('/users/profile', form);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    }
  };

  if (!data) return <main className="mx-auto max-w-7xl px-4 py-10">Loading...</main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
      <h1 className="text-2xl font-bold dark:text-white sm:text-3xl">Job seeker dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Applications" value={data.totalApplications} />
        <StatCard label="Reviewing" value={data.reviewing} />
        <StatCard label="Accepted" value={data.accepted} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <form className="panel space-y-3" onSubmit={saveProfile}>
          <h2 className="font-semibold dark:text-white">Profile</h2>
          
          <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-800 shrink-0">
              {(profilePhoto || data.user?.profilePhoto) ? (
                <img src={profilePhoto ? URL.createObjectURL(profilePhoto) : `${API_BASE_URL}/${data.user.profilePhoto.startsWith('/') ? data.user.profilePhoto.slice(1) : data.user.profilePhoto}`} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-stone-500">No Img</div>
              )}
            </div>
            <div className="w-full min-w-0">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Profile Photo</label>
              <input type="file" accept=".png, .jpg, .jpeg" className="mt-1 block w-full text-sm text-stone-500 file:mr-3 file:rounded-full file:border-0 file:bg-brand/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand hover:file:bg-brand/20 sm:file:px-4" onChange={(e) => setProfilePhoto(e.target.files[0])} />
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Phone</span>
            <input className="input mt-1" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Location</span>
            <input className="input mt-1" placeholder="Location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Skills</span>
            <input className="input mt-1" placeholder="Skills, comma separated" value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
          </label>
          
          <div className="py-2">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Resume (PDF)</label>
            <input type="file" accept=".pdf" className="mt-1 block w-full text-sm text-stone-500 file:mr-3 file:rounded file:border-0 file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-stone-700 hover:file:bg-stone-200 dark:file:bg-stone-800 dark:file:text-stone-300 sm:file:px-4" onChange={(e) => setResume(e.target.files[0])} />
            {data.user?.resume && !resume && (
              <p className="mt-2 text-xs text-brand">Current: {data.user.resume.split('/').pop()}</p>
            )}
            {resume && (
              <p className="mt-2 text-xs text-brand">New file: {resume.name}</p>
            )}
          </div>
          
          <button className="btn-primary w-full">Save profile</button>
        </form>
        <section className="panel">
          <h2 className="font-semibold dark:text-white">Application tracking</h2>
          <div className="mt-4 divide-y divide-stone-200 dark:divide-stone-800">
            {data.applications.map((app) => (
              <div className="py-3" key={app._id}>
                <p className="break-words font-medium dark:text-white">{app.job?.title}</p>
                <p className="text-sm text-stone-500">{app.job?.company?.name || 'Company'} · {app.status}</p>
              </div>
            ))}
            {!data.applications.length && <p className="text-sm text-stone-500">No applications yet.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { role } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data)).catch(() => toast.error('Job not found'));
    if (role === 'user') {
      api.get('/applications/me').then(({ data }) => {
        const applied = data.some(app => app.job._id === id || app.job === id);
        setHasApplied(applied);
      }).catch(console.error);
    }
  }, [id, role]);

  const apply = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('coverLetter', coverLetter);
    if (resume) data.append('resume', resume);
    try {
      await api.post(`/applications/jobs/${id}`, data);
      toast.success('Application submitted');
      setHasApplied(true);
      setCoverLetter('');
      setResume(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not apply');
    }
  };

  if (!job) return <main className="mx-auto max-w-4xl px-4 py-10">Loading...</main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="panel">
        <p className="text-sm font-semibold text-brand">{job.company?.name}</p>
        <h1 className="mt-2 text-3xl font-bold dark:text-white">{job.title}</h1>
        <p className="mt-2 text-stone-500">{job.location} · {job.jobType}</p>
        <div className="mt-6 whitespace-pre-wrap text-stone-700 dark:text-stone-300">{job.description}</div>
        <h2 className="mt-6 font-semibold dark:text-white">Skills</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(job.skills || []).map((skill) => <span key={skill} className="rounded-full bg-stone-100 px-3 py-1 text-sm dark:bg-stone-800 dark:text-stone-200">{skill}</span>)}
        </div>
      </section>
      <aside className="panel h-fit">
        <h2 className="font-semibold dark:text-white">Apply for this job</h2>
        {role === 'user' ? (
          <form className="mt-4 space-y-3" onSubmit={apply}>
            <textarea className="input min-h-32" placeholder="Cover letter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} disabled={hasApplied} />
            <input className="input" type="file" onChange={(e) => setResume(e.target.files[0])} disabled={hasApplied} accept=".pdf" />
            <button className="btn-primary w-full disabled:opacity-50" disabled={hasApplied}>
              {hasApplied ? 'Already Applied' : 'Submit application'}
            </button>
          </form>
        ) : <p className="mt-3 text-sm text-stone-500">Login as a job seeker to apply.</p>}
      </aside>
    </main>
  );
}

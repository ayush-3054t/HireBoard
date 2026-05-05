import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs', { params: { limit: 4 } })
      .then(res => setLatestJobs(res.data.jobs || []))
      .catch(err => console.error('Failed to load jobs', err));
  }, []);

  const roles = [
    [UserRound, 'Job Seekers', 'Build a profile, upload resumes, save roles, and track every application with ease.'],
    [Building2, 'Recruiters', 'Publish openings, manage company details, and review top-tier applicants in one unified dashboard.'],
    [ShieldCheck, 'Admins', 'Approve jobs, moderate accounts, and monitor platform-wide activity to ensure quality.']
  ];

  const companies = [
    'Acme Corp', 'GlobalTech', 'InnovateX', 'Nexus Cloud', 'Quantum UI', 'Stellar Apps'
  ];

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-stone-900 pt-20 pb-32 lg:pt-32 lg:pb-48">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2850&q=80"
            alt="Team collaborating"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-sm font-semibold text-teal-300 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            The Next-Gen Hiring Platform
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Dream Job <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">or Hire Top Talent.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            A complete job portal for candidates, recruiters, and admins. Streamline your hiring process with modern tools, beautiful profiles, and seamless applications.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/jobs" className="group flex items-center justify-center rounded-full bg-teal-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 transition-all">
              Browse Jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/register" className="flex items-center justify-center rounded-full border border-stone-600 bg-stone-800/50 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm hover:bg-stone-700 transition-all">
              Create an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Company Showcase Section */}
      <section className="bg-stone-950 py-12 border-y border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-stone-400 uppercase tracking-widest">Trusted by innovative companies worldwide</p>
          <div className="mt-8 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {companies.map((company) => (
              <div key={company} className="flex items-center gap-2 text-xl font-bold text-stone-200">
                <Building2 className="h-6 w-6" /> {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-stone-50 py-24 dark:bg-stone-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">One platform, three dedicated experiences</h2>
            <p className="mt-4 text-lg text-stone-600 dark:text-stone-300">
              Whether you are looking for your next career move, hunting for the perfect candidate, or managing the ecosystem, we have tailored tools for you.
            </p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {roles.map(([Icon, title, text]) => (
              <div className="relative rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-950/50" key={title}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-stone-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-base leading-7 text-stone-600 dark:text-stone-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      {latestJobs.length > 0 && (
        <section className="bg-white py-24 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">Latest Opportunities</h2>
                <p className="mt-4 text-lg text-stone-600 dark:text-stone-300">Discover recently approved roles from top companies.</p>
              </div>
              <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-500">
                View all jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {latestJobs.map((job) => (
                <Link to={`/jobs/${job._id}`} key={job._id} className="group relative rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-stone-800 dark:bg-stone-900/50 hover:border-teal-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-stone-900 dark:text-white group-hover:text-teal-500 transition-colors">{job.title}</h3>
                      <p className="mt-1 flex items-center gap-2 text-stone-500 dark:text-stone-400">
                        <Building2 className="h-4 w-4" /> {job.company?.name || 'Company'}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                      {job.jobType}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                    {job.salaryMin && <span className="flex items-center gap-1"><BarChart3 className="h-4 w-4" /> ${Math.floor(job.salaryMin/1000)}k+</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platform Features / Dashboard Preview */}
      <section className="bg-stone-50 py-24 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              From post to placement
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
              Everything needed to run a modern hiring marketplace
            </h2>
            <p className="mt-4 text-lg text-stone-600 dark:text-stone-300">
              Candidates apply with rich profiles and resumes, recruiters review applicant status in real-time, and admins keep the platform clean with robust moderation controls.
            </p>
            
            <dl className="mt-10 max-w-xl space-y-6 text-base leading-7 text-stone-600 dark:text-stone-300">
              {[
                [CheckCircle2, 'Curated, approved job board to ensure quality.'],
                [BadgeCheck, 'Verified company profiles to build trust.'],
                [Clock3, 'Real-time application status tracking.'],
                [ShieldCheck, 'Comprehensive admin-level platform controls.']
              ].map(([Icon, description]) => (
                <div key={description} className="relative pl-9">
                  <dt className="inline font-semibold text-stone-900 dark:text-white">
                    <Icon className="absolute left-1 top-1 h-5 w-5 text-teal-500" />
                  </dt>
                  <dd className="inline">{description}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Abstract UI Representation */}
          <div className="relative">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-950/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500"></div>
                  <div>
                    <div className="h-4 w-24 rounded bg-stone-200 dark:bg-stone-700"></div>
                    <div className="h-3 w-16 rounded bg-stone-200 mt-2 dark:bg-stone-800"></div>
                  </div>
                </div>
                <div className="h-8 w-20 rounded-full bg-stone-200 dark:bg-stone-800"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-stone-200 dark:bg-stone-700"></div>
                        <div className="h-3 w-24 rounded bg-stone-200 dark:bg-stone-800"></div>
                      </div>
                      <div className="h-8 w-24 rounded-lg bg-stone-200 dark:bg-stone-800"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative isolate bg-stone-900 py-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2850&q=80" alt="Office space" className="h-full w-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-stone-900/80 mix-blend-multiply"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to take the next step?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-300">
            Join thousands of professionals and top companies already building the future on HireBoard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register" className="rounded-full bg-teal-500 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-teal-400 transition-all">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

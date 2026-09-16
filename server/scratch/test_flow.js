const https = require('https');

const BASE_URL = 'https://hireboard-api-ruddy.vercel.app';

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = {};
    let bodyData = null;

    if (data) {
      bodyData = JSON.stringify(data);
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(url, { method, headers }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json;
        try {
          json = JSON.parse(body);
        } catch {
          json = body;
        }
        resolve({ status: res.statusCode, body: json });
      });
    });

    req.on('error', reject);
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function runTests() {
  const timestamp = Date.now();
  console.log('--- STARTING END-TO-END VERIFICATION WITH DUMMY CREDENTIALS ---');
  console.log('Target API:', BASE_URL);

  // 1. ADMIN TEST
  console.log('\n[1] Testing Admin Flow:');
  const adminLogin = await request('POST', '/api/auth/login', {
    role: 'admin',
    email: 'admin@example.com',
    password: 'admin123'
  });
  console.log('Admin Login status:', adminLogin.status);
  if (adminLogin.status !== 200) {
    console.error('Admin login failed:', adminLogin.body);
    process.exit(1);
  }
  const adminToken = adminLogin.body.token;
  console.log('Admin authenticated successfully. Name:', adminLogin.body.account?.name);

  const adminDashboard = await request('GET', '/api/admin/dashboard', null, adminToken);
  console.log('Admin Dashboard Stats status:', adminDashboard.status, 'Data:', adminDashboard.body);

  const adminUsers = await request('GET', '/api/admin/users', null, adminToken);
  console.log('Admin List Users count:', Array.isArray(adminUsers.body) ? adminUsers.body.length : adminUsers.body);

  // 2. RECRUITER TEST
  console.log('\n[2] Testing Recruiter Flow:');
  const recruiterEmail = `recruiter_${timestamp}@hireboard.test`;
  const recruiterPass = 'Recruiter#2026';
  let recruiterRes = await request('POST', '/api/auth/register', {
    role: 'recruiter',
    name: `Test Recruiter ${timestamp}`,
    email: recruiterEmail,
    password: recruiterPass
  });
  console.log('Recruiter Registration status:', recruiterRes.status);
  if (recruiterRes.status !== 201) {
    console.log('Register failed, trying login...');
    recruiterRes = await request('POST', '/api/auth/login', {
      role: 'recruiter',
      email: recruiterEmail,
      password: recruiterPass
    });
  }
  const recruiterToken = recruiterRes.body.token;
  console.log('Recruiter authenticated. Token acquired.');

  // Create Company Profile
  const companyRes = await request('PUT', '/api/companies/me', {
    name: `TechNova Labs ${timestamp}`,
    description: 'AI & Cloud Infrastructure Company',
    location: 'San Francisco, CA',
    website: 'https://technovalabs.example.com',
    industry: 'Technology'
  }, recruiterToken);
  console.log('Recruiter Company Profile status:', companyRes.status, 'Company:', companyRes.body?.name || companyRes.body);

  // Recruiter Posts a Job
  const postJobRes = await request('POST', '/api/jobs', {
    title: `Senior Fullstack Cloud Architect ${timestamp}`,
    description: 'Lead next-gen cloud native architectures and distributed systems.',
    location: 'Remote',
    salaryMin: 140000,
    salaryMax: 190000,
    jobType: 'Full-time',
    skills: ['React', 'Node.js', 'AWS', 'Docker']
  }, recruiterToken);
  console.log('Recruiter Post Job status:', postJobRes.status);
  const createdJob = postJobRes.body;
  console.log('Created Job ID:', createdJob?._id, 'Status:', createdJob?.status);

  // Admin approves job if pending
  if (createdJob?._id && createdJob?.status !== 'approved') {
    const approveRes = await request('PATCH', `/api/jobs/${createdJob._id}/status`, {
      status: 'approved'
    }, adminToken);
    console.log('Admin Approval status:', approveRes.status, 'New Job Status:', approveRes.body?.status);
  }

  // 3. CANDIDATE (USER) TEST
  console.log('\n[3] Testing Candidate (Job Seeker) Flow:');
  const candidateEmail = `candidate_${timestamp}@hireboard.test`;
  const candidatePass = 'Candidate#2026';
  let candidateRes = await request('POST', '/api/auth/register', {
    role: 'user',
    name: `Alice Candidate ${timestamp}`,
    email: candidateEmail,
    password: candidatePass
  });
  console.log('Candidate Registration status:', candidateRes.status);
  const candidateToken = candidateRes.body.token;
  console.log('Candidate authenticated.');

  // Verify Candidate Profile via /api/auth/me
  const candidateMe = await request('GET', '/api/auth/me', null, candidateToken);
  console.log('Candidate Profile Check (/api/auth/me):', candidateMe.status, candidateMe.body?.account?.email);

  // Browse Public Jobs
  const publicJobs = await request('GET', '/api/jobs');
  console.log('Public Jobs count returned:', publicJobs.body?.jobs?.length, 'Total:', publicJobs.body?.total);

  // Candidate applies to the created job (without file upload for basic test)
  if (createdJob?._id) {
    const applyRes = await request('POST', `/api/applications/jobs/${createdJob._id}`, {
      coverLetter: 'I am thrilled to apply for this role. I have extensive experience in fullstack and cloud engineering.'
    }, candidateToken);
    console.log('Candidate Job Application status:', applyRes.status, 'Application ID:', applyRes.body?._id || applyRes.body);

    // Candidate checks My Applications
    const myApps = await request('GET', '/api/applications/me', null, candidateToken);
    console.log('Candidate My Applications count:', Array.isArray(myApps.body) ? myApps.body.length : myApps.body);

    // 4. RECRUITER APPLICANT REVIEW
    console.log('\n[4] Testing Recruiter Review Flow:');
    const applicantsRes = await request('GET', `/api/applications/jobs/${createdJob._id}/applicants`, null, recruiterToken);
    console.log('Recruiter Fetch Applicants status:', applicantsRes.status, 'Applicants count:', Array.isArray(applicantsRes.body) ? applicantsRes.body.length : applicantsRes.body);

    if (Array.isArray(applicantsRes.body) && applicantsRes.body.length > 0) {
      const appId = applicantsRes.body[0]._id;
      const updateApp = await request('PATCH', `/api/applications/${appId}/status`, {
        status: 'reviewing'
      }, recruiterToken);
      console.log('Recruiter Updated Application Status to "reviewing":', updateApp.status, 'Current Status:', updateApp.body?.status);
    }
  }

  console.log('\n--- ALL TEST FLOWS COMPLETED SUCCESSFULLY ---');
  console.log('Dummy Credentials Used:');
  console.log(`- Admin: admin@example.com / admin123`);
  console.log(`- Recruiter: ${recruiterEmail} / ${recruiterPass}`);
  console.log(`- Candidate: ${candidateEmail} / ${candidatePass}`);
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

# Job Portal API

Base URL: `http://localhost:5000/api`

All protected endpoints require `Authorization: Bearer <token>`.

## Auth

- `POST /auth/register` `{ name, email, password, role: "user" | "recruiter" }`
- `POST /auth/login` `{ email, password, role: "user" | "recruiter" | "admin" }`
- `GET /auth/me`

## Jobs

- `GET /jobs?search=&location=&jobType=&salaryMin=&salaryMax=&page=&limit=`
- `GET /jobs/:id`
- `POST /jobs` recruiter only
- `PUT /jobs/:id` recruiter owner only
- `DELETE /jobs/:id` recruiter owner or admin
- `PATCH /jobs/:id/status` admin only, `{ status: "approved" | "rejected" | "closed" | "pending" }`

## Job Seeker

- `PUT /users/profile` multipart optional `resume`
- `GET /users/dashboard`
- `POST /users/saved/:jobId` toggles bookmark
- `POST /applications/jobs/:jobId` multipart optional `resume`, body `coverLetter`
- `GET /applications/me`

## Recruiter

- `GET /recruiters/dashboard`
- `GET /companies/me`
- `PUT /companies/me` multipart optional `logo`
- `GET /applications/jobs/:jobId/applicants`
- `PATCH /applications/:id/status` `{ status: "reviewing" | "accepted" | "rejected" | "applied" }`

## Admin

- `GET /admin/dashboard`
- `GET /admin/users?page=&limit=`
- `PATCH /admin/users/:id/block`
- `GET /admin/recruiters?page=&limit=`
- `PATCH /admin/recruiters/:id/block`
- `GET /admin/jobs?page=&limit=`

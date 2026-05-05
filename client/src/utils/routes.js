export const dashboardFor = (role) => ({
  user: '/user/dashboard',
  recruiter: '/recruiter/dashboard',
  admin: '/admin/dashboard'
}[role] || '/jobs');

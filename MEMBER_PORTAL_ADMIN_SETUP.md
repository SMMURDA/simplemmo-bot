# Member Portal and Admin Panel

Deployment and administrator setup instructions are included in the private source package as `MEMBER_PORTAL_ADMIN_SETUP.md`.

Deploy order:

1. Apply `license-server/migrations/0003_member_portal_admin.sql`.
2. Configure member license price/duration/device variables.
3. Deploy the Cloudflare Worker.
4. Promote the chosen existing user to `admin` through D1.
5. Deploy this GitHub Pages package.

Never allow role or balance changes directly from browser input.

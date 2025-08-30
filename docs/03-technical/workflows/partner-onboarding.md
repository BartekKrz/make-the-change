# Workflow: Partner Onboarding - Make the CHANGE

## Objective
Create partner entity, onboard partner users, assign projects, and enable updates publishing.

## Steps
1) Admin creates `producer` record and uploads documents/certifications.
2) Admin creates `partner_user(s)` with roles; send invitation email.
3) Assign projects to partner users with permissions.
4) Partner logs into app; submits draft updates → moderation → publish.

## Security
- Enforce RLS on partner tables; limit to assigned projects.

## Observability
- Track onboarding completion time; publish rates.


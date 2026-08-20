# DUT Student Information System

University student management platform frontend with separate web and mobile applications.

## Project structure

- `web/`: React + TypeScript web application
- `mobile/`: Flutter mobile application
- `docs/`: project documentation

## Web application (React + TypeScript)

### Features

- Authentication for student and admin/staff users
- Protected routes and logout
- Student dashboard (profile, GPA, academic status)
- Academic management (courses, details, grades, GPA, schedules)
- Course registration (register/remove, total credits)
- Tuition and payment status/history
- Notifications and announcements
- Admin dashboard modules
- Mock JSON data + API service layer for future REST backend integration

### Run locally

```bash
cd web
npm install
npm run dev
```

Additional commands:

```bash
npm run lint
npm run build
```

Environment configuration:

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` in `.env` for future backend API switching.

## Mobile application (Flutter + Dart)

### Features

- Authentication
- Student dashboard/profile
- Courses, grades, class and exam schedule
- Course registration view
- Tuition
- Notifications
- Admin dashboard modules
- Mock data with service/repository layer for future REST API integration

### Run locally

```bash
cd mobile
flutter pub get
flutter run
```

Optional checks:

```bash
flutter test
flutter analyze
```

Environment configuration (compile-time):

```bash
flutter run --dart-define=API_BASE_URL=http://localhost:3000/api
```

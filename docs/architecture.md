# DUT Student Information System Architecture

## Overview

This repository is organized into:

- `/web`: React + TypeScript web frontend with mock API service layer and protected routes.
- `/mobile`: Flutter + Dart mobile frontend with mock repository/service layer.
- `/docs`: architecture and setup notes.

Both clients are mock-first and expose service/repository boundaries so that real REST APIs can be integrated later without rewriting UI logic.

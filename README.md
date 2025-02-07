# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Workout Log

A minimalist fitness app that helps lifters track workouts and monitor progress. Features include easy workout logging and a community feed for collaboration and friendly competition.

# Purpose & Motivation

Workout Log streamlines fitness tracking by focusing on core functionality. Unlike apps cluttered with achievements and mini-games, our platform prioritizes:

- Simple workout logging
- Personal record tracking 
- Social comparison features

This focused approach helps users maintain clear fitness objectives without distractions.

# Features & Functionality

## Workout Log
- Create and track workouts with sets, reps, weights, and target muscle groups
- Save workouts to personal profile
- Share workouts to community feed

## Community Feed
- View all user workouts
- Filter workouts by muscle group
- Access detailed workout information
- Edit or delete personal workouts

## Profile
- View personal workout history
- Track liked workouts
- Monitor progress with:
  - Personal records by exercise
  - Total rep counts 

# Development

Built with:
- Frontend: JavaScript/React
- Backend: Local server

## Architecture
- App.jsx: Handles authentication (login/register)
- ApplicationViews: Central routing hub
 - Manages user permissions via currentUser prop
 - Controls access to edit/delete functionality


# Challenges

Key technical hurdles:
- Maintaining data consistency across updates and deletions
- Managing complex data relationships between tables
- Cascading deletions for related records (e.g., workout-exercise join tables) 

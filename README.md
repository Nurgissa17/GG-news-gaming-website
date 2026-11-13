# GG News — Final Project

## Topic
Gaming news and video game reviews.

## Group members
- Nurgissa Pernebay
- Nuraly Adilgereev
- Abish Adil

## Features
- Five responsive pages with navigation, Bootstrap, Flexbox and Grid
- Light/dark theme using localStorage
- Sign-in, sign-out and email validation using localStorage (demo, no server)
- Five-question FAQ using jQuery slideToggle
- Steam Store API search using fetch and JSON with error handling
- News filtering, game score table (add, edit, delete), image gallery
- Registration form validation

## GitHub Pages
Existing website: [GG news](https://nurgissa17.github.io/GG-news-gaming-website/)

## AI Usage
ChatGPT helped with CSS color variables for light/dark themes, JavaScript if/else and user input validation (including the email check in the registration form), and Steam API integration.

## Steam API
Steam Store search uses `fetch()` through `proxy.cors.dev` because the Steam Store API does not allow direct cross-origin browser requests. The proxy is an external service and must be available for searches to work.

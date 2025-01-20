# TasteSeat

<p align="center">A Restaurant Booking Application
    <img src="landing\static\readme\restaurantlist-screenshot.png" width=600>
</p>

TasteSeat is a Restaurant Booking WebApp. 

It is a FullStack Web Application which allows users to find new restaurants, make reservations, change reservations, and cancel reservations.

Link to the deployed project: [TasteSeat](https://tasteseat-ac185d5c3e6f.herokuapp.com/)

---

## Table of Contents

- [TasteSeat](#TasteSeat)
  - [Table of Contents](#table-of-contents)
  - [Project Goals](#project-goals)
  - [Features](#features)
  - [User Experience (UX)](#user-experience-ux)
  - [Design](#design)
    - [Colors](#colors)
    - [Fonts](#fonts)
  - [Testing and Validation](#testing-and-validation)
  - [Future Improvements](#future-improvements)
  - [Deployment](#deployment)
  - [Credits](#credits)

---

## Project Goals

### Problem Statement
- The restaurant booking process is often frustrating and inefficient. I aim to create an easy-to-use, online system that makes reserving tables simple and hassle-free for customers.

### Application Objectives
 - Offer a seamless interface that allows users to browse restaurant options effortlessly.
 - Simplify the booking process and reduce the time spent to make a booking.
 - Provide real-time availability information.

 In summary, the goal of the restaurant booking system is to eliminate the friction involved in the booking process, leading to increased customer satisfaction, repeat visits, and enhanced operational efficiency for restaurants.

# Features

### Core Features
- **Booking Management**: Users can create, update, and delete bookings easily.
- **User Authentication**: Secure registration and login processes.
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices.

---

### The 404 Error Page
The 404 error page displays an error message to the user and a link to go back to the Landing page.

---

### Seach for a Restaurant
<p align="left">
    <img src="landing\static\readme\restaurantlist-screenshot.png" width=600>
</p>
<p align="left">
    <img src="landing\static\readme\searchbar-screenshot.png" width=600>
</p>

---

### See a specific Restaurant's details and availability
<p align="left">
    <img src="landing\static\readme\restaurantsdetails-screenshot.png" width=600>
</p>

---

### Book a table
<p align="left">
    <img src="landing\static\readme\bookatable-screenshot.png" width=600>
</p>
<p align="left">
    <img src="landing\static\readme\bookingconfirmation-screenshot.png" width=600>
</p>

---

### Manage you bookings
<p align="left">
    <img src="landing\static\readme\mybookings-screenshot.png" width=600>
</p>

---

### Conditional Navigation Bar
<p align="left">
    <img src="landing\static\readme\navigationbar-screenshot.png" width=600>
</p>

---

### Login Status
<p align="left">
    <img src="landing\static\readme\loginstatus-screenshot.png" width=600>
</p>

---

### Landing page
<p align="left">
    <img src="landing\static\readme\landing-screenshot.png" width=600>
</p>

## Future Improvements

1. **Integration with Calendars**: Sync bookings with third-party calendar apps. So you see your booking in your own calendar
2. **Filters**: Add filtering options for Restaurant categorization, such as Cuisine type and location.
3. **Admin Interface**: A Application for the restaurant owners to manage their bookings.
4. **Email Integration**: Send Emails to confirm actions(Booking confirmation, changes, etc).
5. **FeedBack and Reviews**: Users could receive an email after 24h of the booking time to review and provide feedback to the restaurant. This could then be another filtering option by rating(Improvement number 2).
6. **Special Requests and Food Restrictions**: Users can make special requests and alert the restaunts about any allergies/food restrictions.

---

# User Experience (UX)

- Overall user experience goal is to deliver simplicity, efficiency and enjoyment, by allowing users to quickly find and reserve tables with a minimal number of steps.

### Key User Flow

1. Finding a restaurant
2. Making a reservation
3. Managing reservations

### User Interface Features
- Navigation
- Search Functionality

### Responsive Design

#### This application is Responsive, ensuring optimal user experience on all devices.

- Responsiveness is vital for enhancing user experience because it ensures accessibility across various devices, improves user engagement, facilitates better navigation, enhances performance, and supports SEO efforts. 

- Responsive design can lead to higher user satisfaction, increased retention rates, and greater success for your web application.

#### Intuitive Feedback

- The application keeps the user informed at every step.
- User receives responses that enhance the understanding of the application.

### Target Audience

- Users that are looking to reserve a table in a restaurant, food-lovers, users that are in a unknown area and need to book a table, and users looking to try new restaurants.

## User Stories
For more information regarding the User Stories, please see the GitHub project board:
[GitHub Board](https://github.com/users/BrrunaRibeiro/projects/3)

---

# Design

## Colors
The application follows a clean and modern color scheme, featuring calm colors designed for simplicity:

| Purpose              | Color Code | Example Color                        |
|----------------------|------------|--------------------------------------|
| Primary Accent       | `#aca3d3`  | ![#aca3d3](https://via.placeholder.com/15/aca3d3/aca3d3.png) |
| Secondary Accent     | `#9e9cc3`  | ![#9e9cc3](https://via.placeholder.com/15/9e9cc3/9e9cc3.png) |
| Highlight            | `#cd584f`  | ![#cd584f](https://via.placeholder.com/15/cd584f/cd584f.png) |
| Background           | `#ebebea`  | ![#ebebea](https://via.placeholder.com/15/ebebea/ebebea.png) |
| Light Font           | `#ffffff`  | ![#ffffff](https://via.placeholder.com/15/ffffff/ffffff.png) |
| Dark Font            | `#2b2b2b`  | ![#2b2b2b](https://via.placeholder.com/15/2b2b2b/2b2b2b.png) |
| Muted Background     | `#b7b3cd`  | ![#b7b3cd](https://via.placeholder.com/15/b7b3cd/b7b3cd.png) |
| Accent Contrast      | `#ccc4e7`  | ![#ccc4e7](https://via.placeholder.com/15/ccc4e7/ccc4e7.png) |
| Highlight Contrast   | `#6c7c2c`  | ![#6c7c2c](https://via.placeholder.com/15/6c7c2c/6c7c2c.png) |
| Tertiary Background  | `#746c76`  | ![#746c76](https://via.placeholder.com/15/746c76/746c76.png) |

## Fonts
The application uses the following fonts for styling:

- **Body Font**: "bio-sans" (from Typekit) for content and UI clarity.
- **Font for Headers**: "new-spirit" (from Typekit) for the restaurant name and logo.

## Logo and FavIcon

All Pages on the website are responsive and have:
A favicon in the browser tab.
<p align="left">
    <img src="landing\static\images\favicon-32x32.png" width=80>
</p>
<p align="left">
    <img src="landing\static\readme\favicon-screenshot.png" width=150>
</p>

Clickable logo in the navigation bar.
<p align="left">
    <img src="landing\static\images\tasteseat.webp" width=300>
</p>

## Wireframes
<p align="left">
    <img src="landing\static\readme\bookingrestaurant.png" width=600>
</p>

## Database Plan
### Tables

- Users
- Restaurants
- Tables
- Bookings

### Relationships

- User ↔ UserProfile: One-to-One (Each user has a user profile)
- Restaurant ↔ Table: One-to-Many (Each restaurant can have many tables)
- Table ↔ Booking: One-to-Many (Each table can have many bookings)
- User ↔ Booking: One-to-Many (Each user can make many bookings)
- Booking ↔ Restaurant: Many-to-One (Bookings reference restaurants indirectly      through the table)

### Visual Representation ERD

<p align="left">
    <img src="landing\static\readme\ERDTasteSeat.png" width=600>
</p>

---

# Technologies Used

### Programming Languages, Frameworks, Libraries and T3echnologies used

- **Python**: The core programming language used to build the backend of this application.
- **Django**: A high-level Python web framework used for building the backend of the app. It provides tools for rapid development, including an ORM, authentication, and built-in admin panel.
- **Django REST Framework**: A powerful toolkit for building Web APIs in Django, enabling you to create and manage APIs for handling user interactions.
- **PostgreSQL**: A relational database management system used to store app data, including user information, bookings, and restaurant details. 
- **Cloudinary**: A cloud storage service integrated for handling image uploads, allowing users to upload restaurant images easily.
- **HTML5**: Markup language used to structure the front-end of the application.
- **CSS3**: Styling language used to design the frontend of the app, including layout, responsiveness, and UI elements.
- **JavaScript**: Used to implement dynamic features and interactivity on the front end, such as guest selection and time slot handling.
- **Bootstrap**: A CSS framework used to design responsive, mobile-first websites. Used for UI components like buttons, forms, and modal windows.
- **Heroku**: A platform as a service (PaaS) used to deploy, manage, and scale the application in the cloud.
- **GitHub**: A code hosting platform used for version control and collaborative development of the project.
- **Lucidchart**: Used to design the ERD (Entity-Relationship Diagram) of the application's data models, depicting the relationship between entities.

---

These are the primary technologies used to create this web application. Together, they provide a strong foundation for rapid development and deployment in a production environment.

# Agile
This project was designed using Agile methodology, utilizing the Project Board and Issues sections in GitHub

- [Project Board](https://github.com/users/BrrunaRibeiro/projects/3)

# Testing and Validation

## Testing
Please refer to [TESTING.md](testing.md) file for all testing carried out.

## Validation
- **Accessibility**: Validated with WAVE tools and Lighthouse for 100% accessibility scores.
- **Code Validation**: Passed through PEP8, ESLint and W3C CSS Validator.

## Deployment

The following steps can be followed for Deployment.

1. **Link Your GitHub Repository to Heroku:**
   - Go to the [Heroku Dashboard](https://dashboard.heroku.com/).
   - Click on **New** → **Create new app** to create a new Heroku application.
   - Give your app a name (or leave it to auto-generate) and choose the region (either United States or Europe).
   - In the **Deploy** tab of the newly created app, scroll down to **Deployment Method**.
   - Select **GitHub** as your deployment method.
   - Connect your Heroku app to your GitHub account by clicking the **Connect to GitHub** button.
   - After connecting, search for your repository and click **Connect**.

2. **Configure Environment Variables (Config Vars):**
   - In the **Settings** tab of your Heroku app, scroll down to the **Config Vars** section.
   - Set the following environment variables:
     - **`DATABASE_URL`**: Your Heroku PostgreSQL database URL.
     - **`SECRET_KEY`**: A secret key for your Django app (generate it using `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`).
     - **`ALLOWED_HOSTS`**: Add `your-app-name.herokuapp.com` to allow Heroku’s domain.
     - **`CLOUDINARY_URL`**: Add your Cloudinary API URL to handle image uploads.
     - **`HEROKU_APP_NAME`**: The name of your app (e.g., `your-app-name`).

3. **Deploy the Application:**
   - After linking your GitHub repository to Heroku, scroll to the **Deploy** tab.
   - Under **Manual Deploy**, choose the branch (usually `main` or `master`) and click **Deploy Branch**.
   - Heroku will then deploy your app from GitHub, and you can monitor the progress in the log section.


## Credits

### Favicon

- **Source**: [Favicon.io](https://favicon.io/)
- **Description**: The favicon and logo for the application were generated using Favicon.io.

### Media

- **Source**: [Unsplash](https://unsplash.com/)
- **Description**: The media and photos used for the restaurants were sourced from Unsplash, providing high-quality, free-to-use images.


## Acknowledgments

I would like to acknowledge the following people:

* Jubril - My Code Institute Mentor.
* My family and friends for testing the application.

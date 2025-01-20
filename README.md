# Blog Frontend
The blog-frontend is a React application that serves as the user interface for interacting with the blog-api backend. It allows users to view blog posts, create and edit posts, register, log in, and comment on posts.

## Features
- Registration/Login: The app allows for users to create accounts with different roles and access protected routes.
- Filtering: Users can view different pages with posts that match their search requests.
- Roles: Users can be 'readers', 'authors' and 'admins' all of which have different permissions and abilities on the website.
- Create/Edit Posts: Logged-in users can create, edit and delete their own blog posts if their roles allow them.
- Comments: Logged-in users can add, edit and delete comments on posts.

## Setup
Follow the steps below to set up the blog-frontend locally.

1. Clone the repository:
`git clone https://github.com/mctintor/blog-frontend.git`
`cd blog-frontend`
2. Install dependencies:
`npm install`
3. Start the React development server
Run the following command to start the React app:
`npm start`
The frontend will be running at http://localhost:3000.

## Components
- Homepage: Displays all blog posts with links to individual post pages.
- Post Page: Displays detailed information about a specific post and its comments.
- Login/Register Pages: Allows users to authenticate and access their account.
- Create/Edit Post: Logged-in users can create or edit their own posts.
- Comments Section: Users can add and edit comments on posts.
- Admin Panel: Admins can promote users to different roles, and also have access to editing and deleting all content on the website.

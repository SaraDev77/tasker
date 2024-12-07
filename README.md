
# Tasker

Tasker is a task tracking app using vue js ,prime vue and pinia with tanstack for data management


## API Reference

#### API base URL 

```http
  http://localhost:5000
```




## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_API_BASE_URL`




## Features
- Ability to register with a valid email and password
- Ability to login with a valid email and password already registered before
- Add tasks 
- Edit tasks
- Mark Tasks started to make them in progress status by clicking the start icon on the right of task's card
- Mark them as completed to remove them from your list by clicking the check icon on the right of task's card 
- Start , Stop and reset a one hour Timer to help you track your time 
- A chart to show you the percentage of completed tasks vs the undone ones including the in progress tasks and pending ones 


## Run Locally

Clone the project

```bash
  git clone https://github.com/SaraDev77/tasker.git
```

Go to the project directory

```bash
  cd tasker
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


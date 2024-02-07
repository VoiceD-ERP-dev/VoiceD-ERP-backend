# VoiceD-ERP-backend

## GitFlow Branching Guide

This document serves as a guide for utilizing GitFlow, a branching model for Git, in the development process of our project. GitFlow provides a set of conventions and rules for managing branches to streamline development processes.

## Prerequisites

- Ensure Git is installed on your local machine. If not, download and install it from [git-scm.com](https://git-scm.com/).

    ```bash
    # For Mac users, install GitFlow using Homebrew
    brew install git-flow
    ```

## Branching Model Overview

GitFlow defines the following main branches:

- **`master`**: Represents the production-ready state. All releases are tagged from this branch.
- **`develop`**: The main development branch where feature branches are merged.
- **`feature/`**: Branches for developing new features. They branch off from `develop` and merge back into `develop`.

## Getting Started

1. Clone the repository to your local machine:

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. Initialize GitFlow in your local repository:

    ```bash
    git flow init -d
    ```

    This sets up the default branch names for GitFlow.

## Creating a New Feature

1. Start a new feature branch:

    ```bash
    git flow feature start feature-name
    ```

2. Implement your changes and commit them:

    ```bash
    git commit -m "Implemented feature XYZ"
    ```


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **configuration**        | Application configuration including environment-specific configs 
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/middlewares**      | Express middlewares which processes the incoming requests before handing them down to the routes
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from the Application database  |
| **src**/server.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | 



## Additional Resources

- [GitFlow Cheatsheet](https://danielkummer.github.io/git-flow-cheatsheet/)
- [A Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

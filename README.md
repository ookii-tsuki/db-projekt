# Lieferspatz

This is a web platform that allows users to order food from various restaurants. It includes features like user registration, menu browsing, placing orders, and viewing order history.

## Getting Started

Follow the steps below to set up and run the project on your local machine. We will use **GitHub Desktop** for version control and **VS Code** to edit and run the project.

### 1. Install Python

Before starting the setup process, you need to have Python installed on your machine. Follow these instructions based on your operating system:

#### Windows

1. **Download Python**: 
   - Visit the official Python website: https://www.python.org/downloads/.
   - Download the latest version of Python (preferably Python 3.10 or newer).

2. **Install Python**:
   - Run the installer and make sure to check the box that says **Add Python to PATH** during installation. This ensures that Python and `pip` (the package installer) are available globally on your system.
   - Click **Install Now** and follow the on-screen instructions.

#### macOS

1. **Download Python**:
   - Visit the official Python website: https://www.python.org/downloads/.
   - Download the latest version of Python (preferably Python 3.10 or newer).

2. **Install Python**:
   - Run the installer and follow the on-screen instructions.

3. **Verify Installation**:
   - Open the **Terminal** and run the following command:
     ```bash
     python3 --version
     ```
   - You should see the Python version printed in the terminal (e.g., Python 3.x.x).

#### Linux

1. **Install Python** (if not already installed):
   - Open a terminal and run the following command:
     ```bash
     sudo apt-get install python3
     ```

2. **Verify Installation**:
   - Run this command in the terminal to check if Python is installed:
     ```bash
     python3 --version
     ```

### 2. Clone the Repository

1. **Install GitHub Desktop** (if you don’t have it already):
   - Download GitHub Desktop from [here](https://desktop.github.com/).
   - Follow the installation steps on the website.

2. **Clone the Project Repository**:
   - Open GitHub Desktop.
   - Go to **File** > **Clone repository**.
   - Click the **URL** tab and enter the repository URL (provided by your project lead).
   - Choose a local path where you want to store the project on your computer.
   - Click **Clone** to download the project files to your computer.

### 3. Set Up the Project in VS Code

1. **Install VS Code** (if you don’t have it already):
   - Download VS Code from [here](https://code.visualstudio.com/).
   - Follow the installation steps on the website.

2. **Open the Project in VS Code**:
   - Open VS Code.
   - Click **File** > **Open Folder**.
   - Select the folder where you cloned the project from GitHub.

3. **Install Python Extension in VS Code**:
   - If prompted, VS Code may ask you to install the **Python** extension. Click **Install**.
   - If not prompted, you can manually install it by opening the Extensions tab (on the left sidebar) and searching for "Python".

4. **Create and Activate the Virtual Environment**:
   - Open the **Command Palette** in VS Code (press `Ctrl + Shift + P` or `Cmd + Shift + P` on Mac).
   - Type **Python: Create Environment** and select it.
   - Choose **Venv** (the default option).
   - Select the location where the virtual environment will be created (VS Code will place it in the project folder).
   - After it's created, VS Code will automatically activate the virtual environment.

5. **Install Project Dependencies**:
   - In the **Command Palette**, type **Python: Select Interpreter** and select the newly created virtual environment.
   - Then open the **Terminal** in VS Code (use `Ctrl + ~` or click on **Terminal** > **New Terminal**).
   - In the terminal, run the following command to install all required dependencies:
     ```bash
     pip install -r requirements.txt
     ```
6. **Create `launch.json` file**:
   - In the VS Code Explorer, click on the **New Folder** button and create a folder named `.vscode` in the project’s root directory.
   - Under the newly created folder, right click and click the **New File** option and name it `launch.json`
   - Add the following lines to your `launch.json` file:
   ```json
   {
      "version": "0.2.0",
      "configurations": [
         {
            "name": "Python Debugger: Current File",
            "type": "debugpy",
            "request": "launch",
            "program": "run.py",
            "console": "integratedTerminal"
         }
      ]
   }
   ```

### 4. Set Up the Database

1. **Create a `.env` File**:
   - In the VS Code Explorer, click on the **New File** button and create a file named `.env` in the project’s root directory.
   - Add the following lines to your `.env` file:
     ```
     SECRET_KEY=your-secret-key
     DATABASE_URL=sqlite:///app.db
     ```

     You can replace `your-secret-key` with a strong secret key for your app. If you don’t know how to create one, just type any random string for now.

### 5. Run the Project

1. **Start the Application**:
   - Once the virtual environment is activated and dependencies are installed, you can start the project by pressing `F5` or going to **Run** > **Start Debugging**.
   - Alternatively, you can click on **Run** > **Run Without Debugging** if you don’t need the debugging tools.

   - This will launch the Flask development server and open the project in your default browser.

2. **Open the Website in Your Browser**:
   - The app will automatically open in your browser. If not, navigate to `http://127.0.0.1:5000/` to view the home page of the Food Delivery Platform.

### 6. Working on the Project

1. **Creating a New Branch**:
   - Open **GitHub Desktop**.
   - Go to **Branch** > **New Branch**.
   - Name your branch in the following format: `<your_name>/<the_thing_you'll_change>`. For example, if your name is Mustermann and you are working on the login feature, name it `mustermann/login-feature`.
   - Click **Create Branch**.

2. **Make Changes**:
   - Go back to **VS Code** and make the necessary changes to the code (e.g., modifying templates, updating routes, adding features).
   
3. **Commit Your Changes**:
   - After making changes, go back to **GitHub Desktop**.
   - You’ll see your changes listed in the **Changes** tab.
   - In the **Summary** field, write a brief description of what you changed (e.g., "Updated the login page").
   - Click **Commit to <branch_name>** to save your changes to your branch.

4. **Push Changes to GitHub**:
   - After committing, click **Push origin** in **GitHub Desktop** to push your branch to GitHub.

5. **Create a Pull Request**:
   - Once your changes are pushed to GitHub, go to the repository’s **GitHub page**.
   - Click the **Compare & Pull Request** button for your branch.
   - Fill in the details and description for your pull request (e.g., "Added login page with form validation").
   - Once the pull request is created, wait for someone on the team to review and approve it.
   - After approval, your changes can be merged into the **main** branch.

### 7. Pulling Latest Changes

- To stay up-to-date with any changes made by your teammates, open **GitHub Desktop**.
- Click **Branch** > **Update from main** to fetch the latest changes from the main branch.

---

## Troubleshooting

- **VS Code shows errors related to missing Python extensions**:
  - Make sure you have the Python extension installed in VS Code.
  - Ensure your virtual environment is activated in the status bar at the bottom left.

- **The app doesn’t start**:
  - Make sure you’ve installed the dependencies by running `pip install -r requirements.txt`.
  - Ensure the `.env` file is correctly set up with the `SECRET_KEY` and `DATABASE_URL`.

---

## Conclusion

Now that you've set up the project, you can begin working on different features. When you're ready, remember to commit your changes regularly and push them to GitHub, and follow the team’s branch and pull request process for code reviews and merging.

If you need help, feel free to ask your teammates or refer to the Flask documentation: https://flask.palletsprojects.com/

Happy coding! 🎉

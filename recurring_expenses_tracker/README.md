# Recurring Expense Tracker

This is a simple web application to track recurring expenses, such as classes or subscriptions. It helps you keep a log of your expenses and tells you when the next payment is due.

## Features

- **Log classes or events:** Easily record each time you attend a class or use a service.
- **Payment tracking:** Log payments to reset the expense cycle.
- **Manual entry:** Add past classes or payments with notes.
- **Multiple Data Storage Options:** Choose between local browser storage, a private Google Sheet via OAuth, or a Google Sheet via a custom App Script.

## Setup and Configuration

You can store your data in three ways. Choose one of the methods below.

### Method 1: Google Sheets via OAuth 2.0 (Recommended)

This method securely connects the app to your Google account, allowing it to create and manage a private spreadsheet in your Google Drive.

**1. Create a Google Cloud Platform Project:**
- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project.

**2. Enable APIs:**
- In your new project, go to **APIs & Services > Enabled APIs & Services**.
- Click **+ ENABLE APIS AND SERVICES**.
- Search for and enable the **Google Drive API** and the **Google Sheets API**.

**3. Create OAuth Credentials:**
- Go to **APIs & Services > Credentials**.
- Click **+ CREATE CREDENTIALS** and select **OAuth client ID**.
- **Configure the consent screen** if prompted (select **External**, fill in required app info, and add your email as a test user).
- For the **OAuth client ID**:
  - Select **Web application**.
  - Under **Authorized JavaScript origins**, add the URL where you will host the app (e.g., `http://localhost:8000` or your GitHub Pages URL).
  - Click **Create**.

**4. Get Your Credentials:**
- Copy the **Client ID**.
- You also need an **API Key**. Go to **Credentials**, click **+ CREATE CREDENTIALS**, select **API key**, and copy it.

**5. Configure the Application:**
- When you click **Sign in with Google**, a modal will appear.
- Enter your **API Key** and **Client ID** into the respective fields.

### Method 2: Google Sheets via Google Apps Script

This method uses a Google Apps Script deployed as a web app to interact with a Google Sheet. It does not require creating a Google Cloud project.

**1. Create a Google Sheet:**
- Create a new sheet in your Google Drive.

**2. Create the Apps Script:**
- In your new sheet, go to **Extensions > Apps Script**.
- Delete any existing code in the `Code.gs` file.
- Copy the entire content of `app_script_content.js` from this project and paste it into the script editor.
- Save the script project.

**3. Deploy the Script:**
- Click the **Deploy** button and select **New deployment**.
- For **Select type**, choose **Web app**.
- In the configuration:
  - Give it a description.
  - Set **Execute as** to **Me**.
  - Set **Who has access** to **Anyone** (this is necessary for the script to be called from the app, but only you can access the data).
- Click **Deploy**.

**4. Authorize and Get URL:**
- **Authorize access** when prompted. You may see a warning from Google; you can proceed by clicking **Advanced > Go to (your script name)**.
- After deployment, copy the **Web app URL**.

**5. Configure the Application:**
- In the expense tracker app, paste the copied URL into the **Google Sheets App Script URL** input field during configuration.

### Method 3: Local Storage

If you don't use either of the Google Sheets methods, data will be stored in your browser's local storage. This is simple but not persistent across different browsers or devices.

## How to Use

1. **Open `index.html` in your browser.**
2. **Configure your expense:**
   - Enter the expense name and the number of classes per payment cycle.
   - **Choose your data storage method:**
     - To use OAuth, leave the App Script URL field blank and click **Sign in with Google**.
     - To use App Script, paste your script URL into the input field.
     - To use local storage, leave both Google options blank.
   - Click **Save Configuration**.
3. **Log your activities:**
   - Use the floating action button to log classes, payments, or past entries.
   - Your data will be saved to your chosen destination.

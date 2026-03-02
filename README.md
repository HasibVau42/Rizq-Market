# Rizq Market - Admin Login Instructions

To access the Admin Dashboard and manage products and orders, follow these steps:

## 1. Create a Regular User Account
First, register a new account on the website:
1. Go to the **Register** page (`/register`).
2. Fill in your name, email, and password.
3. Click **Create Account**.

## 2. Assign Admin Role in Firestore
By default, all new users are assigned the `user` role. You must manually change this to `admin` in your Firebase project:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your project (**rizq-market**).
3. Go to **Firestore Database** in the left sidebar.
4. Locate the `users` collection.
5. Find the document corresponding to your user account (you can identify it by the `email` field).
6. Change the `role` field from `"user"` to `"admin"`.
7. Save the changes.

## 4. Setup Firebase Admin (Server-side) - IMPORTANT!
To enable order management and product updates, you must provide your Firebase Service Account:
1. In the Firebase Console, go to **Project Settings** > **Service Accounts**.
2. Click **Generate new private key**.
3. **CRITICAL**: Open the downloaded `.json` file in a text editor (like Notepad or TextEdit).
4. **Copy EVERYTHING** inside the file (it should start with `{` and end with `}`).
5. In this editor, open the **Secrets** panel (the lock icon on the left).
6. Paste the **entire JSON content** into the `FIREBASE_SERVICE_ACCOUNT` variable.
   *   **DO NOT** paste the filename (e.g., `firebase-admin-sdk.json`).
   *   **DO NOT** paste a path.
   *   **PASTE THE ACTUAL JSON CONTENT**.

## 3. Access the Admin Dashboard
Once your role is updated:
1. Log in to the website if you aren't already.
2. Navigate to the **Admin Dashboard** by visiting the `/admin` URL directly in your browser.
3. You will now see the management interface for Products and Orders.

---

**Note:** If you try to access `/admin` without the `admin` role, you will see an "Access Denied" message.

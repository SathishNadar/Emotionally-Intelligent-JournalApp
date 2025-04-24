import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Read the JSON file manually
const serviceAccount = JSON.parse(
    await readFile(new URL("./fir-testing-a3937-firebase-adminsdk-fbsvc-206487461f.json", import.meta.url))
);

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;


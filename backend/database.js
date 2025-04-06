import mongoose from "mongoose"
import express from "express"
import admin from "./firebase/firebase-admin.js";

mongoose.connect("mongodb://localhost:27017/SEM6")
.then(() => console.log("Mongo Connected"))
.catch((err) => console.error("Mongo Error : ", err))

const router = express.Router();

const user_schema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    firebase_id: String,
    emo_description: String
});

const user = mongoose.model("user", user_schema);

const diary_schema = new mongoose.Schema({
    userFB_id: {type: String, require: true},
    title: String,
    content: String,
    emo_state: String
}, { timestamps: true} );

const diary = mongoose.model("diary", diary_schema);


// ------------------------ USER FUNCTION ------------------------ //


// Function to fetch user_id using firebase_id
export async function fetchUserId(firebase_id) {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        
        const userData = await user.findOne({ firebase_id: firebase_id});
        
        if (!userData) {
            return resizeBy.status(404).json({message: "User not found!"});
        }
        return userData._id;
    } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// Function to fetch user data
export async function fetchUser(firebase_id) {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        
        const userData = await user.findOne({ firebase_id: firebase_id});
        
        if (!userData) {
            throw new Error("User not found");
        }
        return userData;
    } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// Function to insert user
export async function insertUser(firebase_id, email, name) {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        const newUser = new user({ firebase_id, email, name });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}

export async function SyncUser(firebase_id) {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        const firebaseUser = await admin.auth().getUser(firebase_id);
        const email = firebaseUser.email;
        const name = firebaseUser.displayName || "Unknown";

        let userdata = await user.findOne({ firebase_id });

        if (!userdata) {
            userdata = new user({ firebase_id, email, name });
            await userdata.save();
        }

        return userdata;
    } catch (error) {
        console.error("❌ Error updating user:", error.message);
        throw error;
    }
}


// Post API to insert user
router.get("/sync-user/:firebase_id", async (req, res) => {
    try {
        const firebase_id = req.params.firebase_id
        const user = await SyncUser(firebase_id);
        console.log("User Synced : ", user.name)
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get API to fetch user by firebase_id
router.get("/get-user/:firebase_id", async (req, res) => {
    try {
        const user = await fetchUser(req.params.firebase_id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// ------------------------ DIARY FUNCTION ------------------------ //

// Function to Insert diary
export async function insertDiary(firebase_id, title = "", content = "", emo_state = "") {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }

        const newDiary = new diary({  
            userFB_id: firebase_id, 
            title: title, 
            content: content, 
            emo_state: emo_state 
        });
        await newDiary.save();
        console.log("✅ Diary entry saved successfully!");
        return newDiary;
    } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// Function to Fetch Diary by user ID
export async function fetchDiaries (firebase_id) {
    try {
        if (!firebase_id) {
            throw new Error("user_id is required");
        }
        
        const diaries = await diary.find({userFB_id: firebase_id});
        return diaries;
    } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// Function to Fetch Diary by user ID and Date
export async function fetchDiariesByDate(firebase_id, date) {
    try {
        if (!firebase_id) {
            throw new Error("user_id is required");
        }

        let query = { userFB_id: firebase_id };

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            query.createdAt = {
                $gte: startDate,
                $lt: endDate
            };
        }

        const diaries = await diary.find(query);
        return diaries;
    } catch (error) {
        console.error("❌ Error fetching diary entries:", error.message);
        throw error;
    }
}

export async function getDiaryStreak(userFB_Id) {
    const today = new Date();
    today.setUTCHours(23, 59, 59, 999);
    const firstOfMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    firstOfMonth.setUTCHours(0, 0, 0, 0);

    const diaries = await diary.find({
        userFB_id: userFB_Id,
        createdAt: { $gte: firstOfMonth, $lte: today }
    });

    const streak = {};
    for (let d = 1; d <= today.getUTCDate(); d++) {
        const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), d));
        const dateStr = date.toISOString().split("T")[0];
        streak[dateStr] = false;
    }

    console.log(diaries)

    diaries.forEach(diary => {
        const diaryDate = diary.createdAt.toISOString().split("T")[0];
        if (streak.hasOwnProperty(diaryDate)) {
            streak[diaryDate] = diary.emo_state;
        }
    });

    return streak;
}


// POST API to insert diary
router.post("/insert-diary", async (req, res) => {
    try {
        const user = await insertDiary(req.body.firebase_id, req.body.title, req.body.content, req.body.emo_state);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST API to fetch diary
router.get("/get-user-diaries/:firebase_id", async (req, res) => {
    try {
        const firebase_id = req.params.firebase_id;
        const date = req.query.date;
        let diaries;

        if (date) {
            diaries = await fetchDiariesByDate(firebase_id, date);
            console.log("date is found")
        } else {
            diaries = await fetchDiaries(firebase_id);
            console.log("date is not found")
        }

        if (!diaries) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(diaries);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET API to fetch streak
router.get("/get-streak/:firebase_id", async (req, res) => {
    try {
        const streak = await getDiaryStreak(req.params.firebase_id);
        res.status(201).json(streak);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






export default router;

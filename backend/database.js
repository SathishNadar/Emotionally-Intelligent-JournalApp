import mongoose from "mongoose"

mongoose.connect("mongodb://localhost:27017/SEM6")
.then(() => console.log("Mongo Connected"))
.catch((err) => console.error("Mongo Error : ", err))

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

// functions:
// |__ user:
// |  |__ fetching user_id using firebase_id
// |  |__ fetching user data using firebase_id
// |  |__ inserting user
// |__ diary:
// |  |__ inserting diary
// |  |__ fetching diary using user_id

// ------------------------ USER FUNCTION ------------------------ //

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

export async function fetchUser(firebase_id) {
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


export async function insertUser({ firebase_id, name = "", email = ""}) {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        
        const newUser = new user({firebase_id, name, email});
        await newUser.save();
        console.log("User inserted!");
        return newUser;
        
     } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// ------------------------ DIARY FUNCTION ------------------------ //

// Function to Insert diary
export async function insertDiary(firebase_id, title = "", content = "", emo_state = "") {
    try {
        if (!firebase_id) {
            throw new Error("firebase_id is required");
        }
        
        const newDiary = new diary({ firebase_id, title, content, emo_state });
        await newDiary.save();
        console.log("✅ Diary entry saved successfully!");
        return newDiary;
    } catch (error) {
        console.error("❌ Error inserting diary entry:", error.message);
        throw error;
    }
}

// Function to Fetch Diary by user ID
export async function fetchDiary(firebase_id) {
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

async function getDiaryStreak(userFB_Id) {
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

    diaries.forEach(diary => {
        const diaryDate = diary.createdAt.toISOString().split("T")[0];
        if (streak.hasOwnProperty(diaryDate)) {
            streak[diaryDate] = true;
        }
    });

    return streak;
}


// Example Usage
(async () => {
        const userFB_Id = "nice"; // Example Firebase ID
        const result = await getDiaryStreak(userFB_Id);
        console.log(result);
    })();
    
    
// const today = new Date()
// const year = today.getMonth()
// console.log(year)
// const t = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split("T")[0];
// console.log(t)

// const diaries = await diary.find()
// console.log(diaries)

// const result = await diary.create({
//     userFB_id: "nice",
//     title: "bad day",
//     content: "nayes bikes man, how to make this?",
//     emo_state: "holy"
// })

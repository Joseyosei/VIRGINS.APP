from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from datetime import datetime, timezone
from bson import ObjectId
from emergentintegrations.llm.chat import LlmChat, UserMessage
from passlib.context import CryptContext
import jwt
import os
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get("JWT_SECRET", "virgins-app-secret-key-2024")

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "virgins_db")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

users_col = db["users"]
likes_col = db["likes"]
matches_col = db["matches"]

MOCK_USERS = [
    {
        "firebaseUid": "mock_elizabeth_1",
        "email": "elizabeth@demo.com",
        "name": "Elizabeth",
        "age": 24,
        "gender": "Female",
        "location": "Austin, TX",
        "faith": "Christian",
        "faithLevel": "Very Serious",
        "denomination": "Baptist",
        "values": ["Purity", "Family", "Homeschooling"],
        "intention": "Marriage ASAP",
        "lifestyle": "Traditional",
        "bio": "Saving myself for marriage. Looking for a spiritual leader who walks with God daily.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": False,
    },
    {
        "firebaseUid": "mock_sarah_2",
        "email": "sarah@demo.com",
        "name": "Sarah",
        "age": 26,
        "gender": "Female",
        "location": "Dallas, TX",
        "faith": "Christian",
        "faithLevel": "Practicing",
        "denomination": "Non-Denominational",
        "values": ["Kindness", "Family", "Travel"],
        "intention": "Dating to Marry",
        "lifestyle": "Moderate",
        "bio": "Love Jesus and coffee. Want a family one day. Looking for someone who leads with faith.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": False,
    },
    {
        "firebaseUid": "mock_mary_3",
        "email": "mary@demo.com",
        "name": "Mary",
        "age": 23,
        "gender": "Female",
        "location": "Houston, TX",
        "faith": "Catholic",
        "faithLevel": "Very Serious",
        "denomination": "Catholic",
        "values": ["Purity", "Tradition", "Pro-Life"],
        "intention": "Marriage ASAP",
        "lifestyle": "Traditional",
        "bio": "Traditional Catholic mass attendee. Values faith above all else in life and love.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": True,
    },
    {
        "firebaseUid": "mock_james_4",
        "email": "james@demo.com",
        "name": "James",
        "age": 27,
        "gender": "Male",
        "location": "Austin, TX",
        "faith": "Christian",
        "faithLevel": "Very Serious",
        "denomination": "Reformed",
        "values": ["Leadership", "Purity", "Family"],
        "intention": "Marriage ASAP",
        "lifestyle": "Traditional",
        "bio": "Biblical manhood. Seeking a Proverbs 31 woman to build a legacy with.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": False,
    },
    {
        "firebaseUid": "mock_david_5",
        "email": "david@demo.com",
        "name": "David",
        "age": 29,
        "gender": "Male",
        "location": "Dallas, TX",
        "faith": "Christian",
        "faithLevel": "Practicing",
        "denomination": "Methodist",
        "values": ["Career", "Faith", "Sports"],
        "intention": "Marriage in 1-2 years",
        "lifestyle": "Modern",
        "bio": "Work hard, pray hard. Looking for a partner who balances ambition with devotion.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": True,
    },
    {
        "firebaseUid": "mock_hannah_6",
        "email": "hannah@demo.com",
        "name": "Hannah",
        "age": 22,
        "gender": "Female",
        "location": "Nashville, TN",
        "faith": "Christian",
        "faithLevel": "Very Serious",
        "denomination": "Baptist",
        "values": ["Purity", "Music", "Family"],
        "intention": "Marriage in 1-2 years",
        "lifestyle": "Traditional",
        "bio": "Worship leader. Waiting for a man who loves God more than he loves me.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": False,
    },
    {
        "firebaseUid": "mock_ruth_7",
        "email": "ruth@demo.com",
        "name": "Ruth",
        "age": 25,
        "gender": "Female",
        "location": "Charlotte, NC",
        "faith": "Christian",
        "faithLevel": "Practicing",
        "denomination": "Presbyterian",
        "values": ["Kindness", "Tradition", "Education"],
        "intention": "Dating to Marry",
        "lifestyle": "Moderate",
        "bio": "Seminary student with a heart for missions. Looking for a partner in ministry.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": False,
    },
    {
        "firebaseUid": "mock_caleb_8",
        "email": "caleb@demo.com",
        "name": "Caleb",
        "age": 28,
        "gender": "Male",
        "location": "Atlanta, GA",
        "faith": "Christian",
        "faithLevel": "Very Serious",
        "denomination": "Non-Denominational",
        "values": ["Leadership", "Family", "Tradition"],
        "intention": "Marriage ASAP",
        "lifestyle": "Traditional",
        "bio": "Youth pastor building a future rooted in Christ. Ready for a helpmeet.",
        "photos": [],
        "profileImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        "status": "verified",
        "isPremium": True,
    },
]


def serialize_doc(doc):
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        del doc["_id"]
    return doc


def serialize_docs(docs):
    return [serialize_doc(d) for d in docs]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await users_col.create_index("firebaseUid", unique=True)
    await likes_col.create_index([("fromUserId", 1), ("toUserId", 1)], unique=True)
    await matches_col.create_index("users")
    count = await users_col.count_documents({})
    if count == 0:
        now = datetime.now(timezone.utc).isoformat()
        for user in MOCK_USERS:
            user["createdAt"] = now
        await users_col.insert_many(MOCK_USERS)
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_uid(request: Request):
    uid = request.headers.get("x-firebase-uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Missing x-firebase-uid header")
    return uid


# ---------- HEALTH ----------
@app.get("/api/health")
async def health():
    return {"status": "ok"}


# ---------- AUTH / USERS ----------
@app.post("/api/auth/register")
async def register_user(data: dict):
    firebase_uid = data.get("firebaseUid")
    email = data.get("email")
    if not firebase_uid or not email:
        raise HTTPException(400, "firebaseUid and email required")

    existing = await users_col.find_one({"firebaseUid": firebase_uid})
    if existing:
        return {"message": "User already exists", "user": serialize_doc(existing)}

    now = datetime.now(timezone.utc).isoformat()
    user = {
        "firebaseUid": firebase_uid,
        "email": email,
        "name": data.get("name", ""),
        "age": data.get("age", 0),
        "gender": data.get("gender", ""),
        "location": data.get("location", ""),
        "faith": data.get("faith", "Christian"),
        "faithLevel": data.get("faithLevel", "Exploring"),
        "denomination": data.get("denomination", ""),
        "values": data.get("values", []),
        "intention": data.get("intention", "Unsure"),
        "lifestyle": data.get("lifestyle", "Moderate"),
        "bio": data.get("bio", ""),
        "photos": data.get("photos", []),
        "profileImage": data.get("profileImage", ""),
        "status": "pending",
        "isPremium": False,
        "createdAt": now,
    }
    await users_col.insert_one(user)
    return {"message": "User created", "user": serialize_doc(user)}


# ---------- BACKEND AUTH (fallback when Firebase not configured) ----------
@app.post("/api/auth/signup")
async def signup_with_password(data: dict):
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "")

    if not email or not password:
        raise HTTPException(400, "Email and password required")
    if len(password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters")

    existing = await users_col.find_one({"email": email})
    if existing:
        raise HTTPException(409, "An account with this email already exists. Try signing in.")

    uid = f"local_{uuid.uuid4().hex[:16]}"
    hashed_pw = pwd_context.hash(password)
    now = datetime.now(timezone.utc).isoformat()

    user = {
        "firebaseUid": uid,
        "email": email,
        "passwordHash": hashed_pw,
        "name": name,
        "age": 0,
        "gender": "",
        "location": "",
        "faith": "Christian",
        "faithLevel": "Exploring",
        "denomination": "",
        "values": [],
        "intention": "Unsure",
        "lifestyle": "Moderate",
        "bio": "",
        "photos": [],
        "profileImage": "",
        "status": "pending",
        "isPremium": False,
        "createdAt": now,
    }
    await users_col.insert_one(user)

    token = jwt.encode({"uid": uid, "email": email}, JWT_SECRET, algorithm="HS256")
    safe_user = serialize_doc(user)
    if safe_user and "passwordHash" in safe_user:
        del safe_user["passwordHash"]

    return {"message": "Account created", "token": token, "uid": uid, "user": safe_user}


@app.post("/api/auth/login")
async def login_with_password(data: dict):
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        raise HTTPException(400, "Email and password required")

    user = await users_col.find_one({"email": email})
    if not user:
        raise HTTPException(401, "Invalid email or password")

    stored_hash = user.get("passwordHash", "")
    if not stored_hash or not pwd_context.verify(password, stored_hash):
        raise HTTPException(401, "Invalid email or password")

    uid = user.get("firebaseUid")
    token = jwt.encode({"uid": uid, "email": email}, JWT_SECRET, algorithm="HS256")
    safe_user = serialize_doc(user)
    if safe_user and "passwordHash" in safe_user:
        del safe_user["passwordHash"]

    return {"message": "Login successful", "token": token, "uid": uid, "user": safe_user}


@app.get("/api/users/me")
async def get_my_profile(request: Request):
    uid = get_uid(request)
    user = await users_col.find_one({"firebaseUid": uid}, {"_id": 0})
    if not user:
        raise HTTPException(404, "User not found")
    return user


@app.put("/api/users/me")
async def update_my_profile(request: Request, data: dict):
    uid = get_uid(request)
    safe_fields = [
        "name", "age", "gender", "location", "faith", "faithLevel",
        "denomination", "values", "intention", "lifestyle", "bio",
        "photos", "profileImage", "status",
        "birthday", "work", "education", "educationLevel", "height",
        "exercise", "hometown", "lookingFor", "churchAttendance",
        "showGenderOnProfile", "onboardingComplete",
    ]
    update = {k: v for k, v in data.items() if k in safe_fields}
    if not update:
        raise HTTPException(400, "No valid fields to update")

    result = await users_col.update_one({"firebaseUid": uid}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(404, "User not found")

    user = await users_col.find_one({"firebaseUid": uid}, {"_id": 0})
    return {"message": "Profile updated", "user": user}


@app.get("/api/users/discover")
async def discover_users(request: Request, gender: str = "Female", min_age: int = 18, max_age: int = 50):
    uid = get_uid(request)
    query = {
        "firebaseUid": {"$ne": uid},
        "gender": gender,
        "age": {"$gte": min_age, "$lte": max_age},
    }
    users = await users_col.find(query, {"_id": 0}).to_list(50)

    # Calculate covenant scores
    current_user = await users_col.find_one({"firebaseUid": uid}, {"_id": 0})
    results = []
    for u in users:
        score_data = calculate_covenant_score(current_user, u)
        results.append({**u, **score_data})

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


@app.get("/api/users/{firebase_uid}")
async def get_user_by_uid(firebase_uid: str):
    user = await users_col.find_one({"firebaseUid": firebase_uid}, {"_id": 0})
    if not user:
        raise HTTPException(404, "User not found")
    return user


# ---------- COVENANT ALGORITHM ----------
def calculate_covenant_score(current_user, candidate):
    if not current_user:
        current_user = {}

    reasons = []

    # Faith Score (35 max)
    faith_score = 0
    if candidate.get("faithLevel") == "Very Serious":
        faith_score += 15
    elif candidate.get("faithLevel") == "Practicing":
        faith_score += 10
    elif candidate.get("faithLevel") == "Cultural":
        faith_score += 5

    if candidate.get("denomination") == current_user.get("denomination"):
        faith_score += 20
        reasons.append(f"Denomination Match: {candidate.get('denomination')}")
    elif candidate.get("faith") == "Christian":
        faith_score += 10

    # Values Score (30 max)
    values_score = 0
    my_values = set(current_user.get("values", []))
    their_values = set(candidate.get("values", []))
    shared = my_values & their_values
    if my_values:
        values_score = int((len(shared) / max(len(my_values), 1)) * 30)
    else:
        values_score = 15
    if shared:
        reasons.append(f"Shared Values: {', '.join(shared)}")

    # Intention Score (25 max)
    intention_score = 0
    intention_map = {"Marriage ASAP": 25, "Marriage in 1-2 years": 20, "Dating to Marry": 15, "Unsure": 5}
    intention_score = intention_map.get(candidate.get("intention", ""), 10)
    if candidate.get("intention") == "Marriage ASAP":
        reasons.append("Ready for Marriage Now")

    # Lifestyle Score (10 max)
    lifestyle_score = 0
    lifestyle_map = {"Traditional": 10, "Moderate": 5, "Modern": 3}
    lifestyle_score = lifestyle_map.get(candidate.get("lifestyle", ""), 3)
    if candidate.get("lifestyle") == "Traditional":
        reasons.append("Traditional Lifestyle")

    total = min(faith_score + values_score + intention_score + lifestyle_score, 100)

    return {
        "score": total,
        "breakdown": {
            "faithScore": faith_score,
            "valuesScore": values_score,
            "intentionScore": intention_score,
            "lifestyleScore": lifestyle_score,
        },
        "reasons": reasons,
    }


# ---------- LIKES ----------
@app.post("/api/likes")
async def like_user(request: Request, data: dict):
    uid = get_uid(request)
    to_user_id = data.get("toUserId")
    if not to_user_id:
        raise HTTPException(400, "toUserId required")
    if uid == to_user_id:
        raise HTTPException(400, "Cannot like yourself")

    existing = await likes_col.find_one({"fromUserId": uid, "toUserId": to_user_id})
    if existing:
        return {"message": "Already liked", "matched": False}

    now = datetime.now(timezone.utc).isoformat()
    await likes_col.insert_one({
        "fromUserId": uid,
        "toUserId": to_user_id,
        "createdAt": now,
    })

    # Check mutual like
    mutual = await likes_col.find_one({"fromUserId": to_user_id, "toUserId": uid})
    if mutual:
        user_pair = sorted([uid, to_user_id])
        existing_match = await matches_col.find_one({"users": user_pair})
        if not existing_match:
            await matches_col.insert_one({
                "users": user_pair,
                "createdAt": now,
                "lastMessage": None,
                "lastMessageAt": None,
            })
        await likes_col.delete_many({
            "$or": [
                {"fromUserId": uid, "toUserId": to_user_id},
                {"fromUserId": to_user_id, "toUserId": uid},
            ]
        })
        return {"message": "It's a match!", "matched": True}

    return {"message": "Like sent", "matched": False}


@app.delete("/api/likes/{to_user_id}")
async def unlike_user(request: Request, to_user_id: str):
    uid = get_uid(request)
    result = await likes_col.delete_one({"fromUserId": uid, "toUserId": to_user_id})
    return {"message": "Unliked" if result.deleted_count else "Like not found"}


@app.get("/api/likes/received")
async def get_received_likes(request: Request):
    uid = get_uid(request)
    likes = await likes_col.find({"toUserId": uid}, {"_id": 0}).to_list(100)

    matched_user_ids = set()
    my_matches = await matches_col.find({"users": uid}, {"_id": 0}).to_list(100)
    for m in my_matches:
        for u in m.get("users", []):
            if u != uid:
                matched_user_ids.add(u)

    result = []
    for like in likes:
        from_id = like["fromUserId"]
        if from_id in matched_user_ids:
            continue
        user = await users_col.find_one({"firebaseUid": from_id}, {"_id": 0})
        if user:
            result.append({**user, "likedAt": like.get("createdAt")})

    return result


@app.get("/api/likes/sent")
async def get_sent_likes(request: Request):
    uid = get_uid(request)
    likes = await likes_col.find({"fromUserId": uid}, {"_id": 0}).to_list(100)
    return [l["toUserId"] for l in likes]


# ---------- MATCHES ----------
@app.get("/api/matches")
async def get_matches(request: Request):
    uid = get_uid(request)
    my_matches = await matches_col.find({"users": uid}, {"_id": 0}).to_list(100)

    result = []
    for m in my_matches:
        other_uid = [u for u in m.get("users", []) if u != uid]
        if other_uid:
            other_user = await users_col.find_one({"firebaseUid": other_uid[0]}, {"_id": 0})
            if other_user:
                result.append({
                    "matchedUser": other_user,
                    "createdAt": m.get("createdAt"),
                    "lastMessage": m.get("lastMessage"),
                    "lastMessageAt": m.get("lastMessageAt"),
                })
    return result


# ---------- AI BIO GENERATION ----------
@app.post("/api/ai/generate-bio")
async def generate_bio(data: dict):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "LLM key not configured")

    name = data.get("name", "")
    age = data.get("age", "")
    faith = data.get("faith", "")
    hobbies = data.get("hobbies", "")
    values = data.get("values", "")
    looking_for = data.get("lookingFor", "")

    prompt = f"""Create a dating profile bio for a user named {name}, age {age}.

User Details:
- Faith/Denomination: {faith}
- Hobbies: {hobbies}
- Core Values: {values}
- Looking for: {looking_for}

Context: This is for an app called "Virgins", exclusively for people with traditional values who are saving sex for marriage.

Requirements:
1. Tone: respectful, wholesome, marriage-minded, and elegant.
2. Emphasize commitment to traditional values and waiting for marriage.
3. If faith is provided, weave it naturally.
4. Avoid slang, hookup language, or superficiality.
5. Return ONLY valid JSON with two fields: "bio" (the generated bio text, max 200 words) and "advice" (a short encouraging piece of relationship advice, max 50 words)."""

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"bio-gen-{uuid.uuid4()}",
            system_message="You are a professional relationship coach specializing in traditional courtship and marriage-minded dating. Always return valid JSON only.",
        )
        chat.with_model("gemini", "gemini-2.5-flash")

        msg = UserMessage(text=prompt)
        response = await chat.send_message(msg)

        import json
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[-1].rsplit("```", 1)[0]
        result = json.loads(cleaned)
        return result
    except Exception as e:
        return {
            "bio": f"{name} is a {age}-year-old who values {values}. Committed to traditional courtship and saving intimacy for marriage. Enjoys {hobbies} and is looking for {looking_for}.",
            "advice": "Stay true to your values. The right person will honor your commitment.",
        }


# ---------- SEED / ADMIN ----------
@app.post("/api/seed")
async def seed_data():
    await users_col.delete_many({"firebaseUid": {"$regex": "^mock_"}})
    now = datetime.now(timezone.utc).isoformat()
    for user in MOCK_USERS:
        user_copy = {**user, "createdAt": now}
        try:
            await users_col.insert_one(user_copy)
        except Exception:
            pass
    return {"message": f"Seeded {len(MOCK_USERS)} mock users"}


@app.get("/api/admin/stats")
async def admin_stats():
    user_count = await users_col.count_documents({})
    like_count = await likes_col.count_documents({})
    match_count = await matches_col.count_documents({})
    return {
        "totalUsers": user_count,
        "totalLikes": like_count,
        "totalMatches": match_count,
    }

from fastapi import FastAPI, HTTPException, Header, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from datetime import datetime, timezone
from bson import ObjectId
from emergentintegrations.llm.chat import LlmChat, UserMessage
from passlib.context import CryptContext
from math import radians, sin, cos, sqrt, atan2
import jwt
import os
import uuid
import httpx

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get("JWT_SECRET", "virgins-app-secret-key-2024")

load_dotenv()

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "virgins_db")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY", "")

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
        "coordinates": {"type": "Point", "coordinates": [-97.7431, 30.2672]},  # Austin, TX
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
        "coordinates": {"type": "Point", "coordinates": [-96.7970, 32.7767]},  # Dallas, TX
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
        "coordinates": {"type": "Point", "coordinates": [-95.3698, 29.7604]},  # Houston, TX
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
        "coordinates": {"type": "Point", "coordinates": [-97.7501, 30.2849]},  # Austin, TX (slightly different)
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
        "coordinates": {"type": "Point", "coordinates": [-96.8067, 32.7857]},  # Dallas, TX
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
        "coordinates": {"type": "Point", "coordinates": [-86.7816, 36.1627]},  # Nashville, TN
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
        "coordinates": {"type": "Point", "coordinates": [-80.8431, 35.2271]},  # Charlotte, NC
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
        "coordinates": {"type": "Point", "coordinates": [-84.3880, 33.7490]},  # Atlanta, GA
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
    await users_col.create_index([("coordinates", "2dsphere")])  # Geospatial index
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
    user = await users_col.find_one({"firebaseUid": uid}, {"_id": 0, "passwordHash": 0})
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


# ---------- GEOLOCATION HELPERS ----------
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in kilometers using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c


# ---------- NEARBY / GEOLOCATION ----------
@app.post("/api/users/nearby")
async def get_nearby_users(request: Request, data: dict):
    """Find nearby users using MongoDB geospatial queries"""
    uid = get_uid(request)
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    max_distance = data.get("maxDistance", 50000)  # Default 50km in meters
    limit = data.get("limit", 20)

    if latitude is None or longitude is None:
        raise HTTPException(400, "latitude and longitude required")

    # Find users with geospatial query
    nearby_users = await users_col.find(
        {
            "firebaseUid": {"$ne": uid},
            "coordinates": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude]
                    },
                    "$maxDistance": max_distance
                }
            }
        },
        {"_id": 0, "passwordHash": 0}
    ).limit(limit).to_list(limit)

    # Calculate distance for each user
    for user in nearby_users:
        if user.get("coordinates"):
            coords = user["coordinates"]["coordinates"]
            dist_km = calculate_distance(latitude, longitude, coords[1], coords[0])
            user["distance"] = round(dist_km, 1)
        else:
            user["distance"] = None

    return nearby_users


@app.put("/api/users/me/location")
async def update_user_location(request: Request, data: dict):
    """Update user's current location coordinates"""
    uid = get_uid(request)
    latitude = data.get("latitude")
    longitude = data.get("longitude")

    if latitude is None or longitude is None:
        raise HTTPException(400, "latitude and longitude required")

    coordinates = {
        "type": "Point",
        "coordinates": [longitude, latitude]
    }

    result = await users_col.update_one(
        {"firebaseUid": uid},
        {"$set": {"coordinates": coordinates, "lastLocationUpdate": datetime.now(timezone.utc).isoformat()}}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "User not found")

    return {"message": "Location updated", "coordinates": coordinates}


# ---------- GOOGLE PLACES API ----------
@app.get("/api/venues/nearby")
async def get_nearby_venues(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius: int = Query(default=1500),
    place_types: str = Query(default="restaurant,cafe,park,church")
):
    """Search for nearby date-friendly venues using Google Places API"""
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(500, "Google Maps API key not configured")

    types_list = [t.strip() for t in place_types.split(",")]
    
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.photos,places.websiteUri,places.primaryType"
    }

    payload = {
        "includedTypes": types_list,
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": latitude,
                    "longitude": longitude
                },
                "radius": float(radius)
            }
        },
        "rankPreference": "DISTANCE"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://places.googleapis.com/v1/places:searchNearby",
            json=payload,
            headers=headers,
            timeout=10.0
        )

        if response.status_code != 200:
            # Fallback to mock venues if Places API fails
            return {
                "places": [
                    {"id": "1", "displayName": {"text": "Grace Fellowship Cafe"}, "formattedAddress": "123 Faith St", "location": {"latitude": latitude + 0.005, "longitude": longitude + 0.003}, "types": ["cafe"], "rating": 4.8},
                    {"id": "2", "displayName": {"text": "Covenant Garden Park"}, "formattedAddress": "456 Peace Ave", "location": {"latitude": latitude - 0.003, "longitude": longitude + 0.007}, "types": ["park"], "rating": 4.6},
                    {"id": "3", "displayName": {"text": "The Bethany Bistro"}, "formattedAddress": "789 Hope Blvd", "location": {"latitude": latitude + 0.008, "longitude": longitude - 0.004}, "types": ["restaurant"], "rating": 4.9},
                ],
                "source": "mock"
            }

        data = response.json()
        venues = []
        for place in data.get("places", []):
            venue = {
                "id": place.get("id"),
                "displayName": place.get("displayName", {}),
                "formattedAddress": place.get("formattedAddress"),
                "location": place.get("location", {}),
                "types": place.get("types", []),
                "rating": place.get("rating"),
                "primaryType": place.get("primaryType"),
                "websiteUri": place.get("websiteUri")
            }
            venues.append(venue)

        return {"places": venues, "source": "google"}


# ---------- STRIPE PAYMENTS ----------
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY")

# Define membership packages (amounts in dollars)
MEMBERSHIP_PACKAGES = {
    "monthly": {"amount": 9.99, "name": "Monthly Premium", "description": "1 month of premium features"},
    "annual": {"amount": 79.99, "name": "Annual Premium (Save 33%)", "description": "12 months of premium features"},
    "lifetime": {"amount": 199.99, "name": "Lifetime Premium", "description": "Permanent premium access"},
}

payments_col = db["payment_transactions"]


@app.post("/api/payments/create-checkout")
async def create_checkout_session(request: Request, data: dict):
    """Create a Stripe checkout session for membership"""
    uid = get_uid(request)
    package_id = data.get("packageId")
    origin_url = data.get("originUrl", "")

    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe is not configured")

    if package_id not in MEMBERSHIP_PACKAGES:
        raise HTTPException(400, f"Invalid package. Valid options: {list(MEMBERSHIP_PACKAGES.keys())}")

    package = MEMBERSHIP_PACKAGES[package_id]
    amount = package["amount"]

    # Build success and cancel URLs
    success_url = f"{origin_url}/membership?session_id={{CHECKOUT_SESSION_ID}}&status=success"
    cancel_url = f"{origin_url}/membership?status=cancelled"

    # Initialize Stripe checkout
    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        checkout_request = CheckoutSessionRequest(
            amount=float(amount),
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "user_id": uid,
                "package_id": package_id,
                "package_name": package["name"],
            }
        )

        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)

        # Create payment transaction record
        now = datetime.now(timezone.utc).isoformat()
        await payments_col.insert_one({
            "sessionId": session.session_id,
            "userId": uid,
            "packageId": package_id,
            "packageName": package["name"],
            "amount": amount,
            "currency": "usd",
            "status": "pending",
            "paymentStatus": "initiated",
            "createdAt": now,
        })

        return {
            "url": session.url,
            "sessionId": session.session_id,
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to create checkout session: {str(e)}")


@app.get("/api/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    """Get the status of a payment session"""
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe is not configured")

    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

        # Update transaction in database
        now = datetime.now(timezone.utc).isoformat()
        update_data = {
            "status": status.status,
            "paymentStatus": status.payment_status,
            "updatedAt": now,
        }

        # If payment successful, update user to premium
        if status.payment_status == "paid":
            transaction = await payments_col.find_one({"sessionId": session_id})
            if transaction and not transaction.get("processed"):
                user_id = transaction.get("userId")
                package_id = transaction.get("packageId")

                # Mark transaction as processed to prevent double processing
                update_data["processed"] = True

                # Update user's premium status
                await users_col.update_one(
                    {"firebaseUid": user_id},
                    {"$set": {
                        "isPremium": True,
                        "premiumPackage": package_id,
                        "premiumStartDate": now,
                        "premiumUpdatedAt": now,
                    }}
                )

        await payments_col.update_one(
            {"sessionId": session_id},
            {"$set": update_data}
        )

        return {
            "status": status.status,
            "paymentStatus": status.payment_status,
            "amountTotal": status.amount_total,
            "currency": status.currency,
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to get payment status: {str(e)}")


@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe is not configured")

    body = await request.body()
    signature = request.headers.get("Stripe-Signature")

    webhook_url = f"{str(request.base_url).rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)

        # Update transaction based on webhook event
        if webhook_response.session_id:
            now = datetime.now(timezone.utc).isoformat()
            await payments_col.update_one(
                {"sessionId": webhook_response.session_id},
                {"$set": {
                    "status": webhook_response.event_type,
                    "paymentStatus": webhook_response.payment_status,
                    "webhookEventId": webhook_response.event_id,
                    "updatedAt": now,
                }}
            )

            # If payment completed, update user premium status
            if webhook_response.payment_status == "paid":
                transaction = await payments_col.find_one({"sessionId": webhook_response.session_id})
                if transaction and not transaction.get("processed"):
                    user_id = transaction.get("userId")
                    package_id = transaction.get("packageId")

                    await payments_col.update_one(
                        {"sessionId": webhook_response.session_id},
                        {"$set": {"processed": True}}
                    )

                    await users_col.update_one(
                        {"firebaseUid": user_id},
                        {"$set": {
                            "isPremium": True,
                            "premiumPackage": package_id,
                            "premiumStartDate": now,
                            "premiumUpdatedAt": now,
                        }}
                    )

        return {"received": True}
    except Exception as e:
        raise HTTPException(400, f"Webhook error: {str(e)}")


@app.get("/api/payments/packages")
async def get_membership_packages():
    """Get available membership packages"""
    return {"packages": MEMBERSHIP_PACKAGES}


# ---------- ACCOUNT MANAGEMENT ----------
@app.post("/api/account/cancel-membership")
async def cancel_membership(request: Request):
    """Cancel user's premium membership"""
    uid = get_uid(request)

    result = await users_col.update_one(
        {"firebaseUid": uid},
        {"$set": {
            "isPremium": False,
            "premiumCancelledAt": datetime.now(timezone.utc).isoformat(),
        }}
    )

    if result.matched_count == 0:
        raise HTTPException(404, "User not found")

    return {"message": "Membership cancelled successfully"}


@app.delete("/api/account/delete")
async def delete_account(request: Request):
    """Permanently delete user account and all associated data"""
    uid = get_uid(request)

    # Delete user's likes
    await likes_col.delete_many({"$or": [{"fromUserId": uid}, {"toUserId": uid}]})

    # Delete user's matches
    await matches_col.delete_many({"users": uid})

    # Delete user's payment transactions
    await payments_col.delete_many({"userId": uid})

    # Delete user account
    result = await users_col.delete_one({"firebaseUid": uid})

    if result.deleted_count == 0:
        raise HTTPException(404, "User not found")

    return {"message": "Account deleted successfully"}


@app.get("/api/account/membership")
async def get_membership_status(request: Request):
    """Get user's membership status"""
    uid = get_uid(request)

    user = await users_col.find_one({"firebaseUid": uid}, {"_id": 0})
    if not user:
        raise HTTPException(404, "User not found")

    return {
        "isPremium": user.get("isPremium", False),
        "premiumPackage": user.get("premiumPackage"),
        "premiumStartDate": user.get("premiumStartDate"),
        "premiumCancelledAt": user.get("premiumCancelledAt"),
    }



import requests
import sys
import uuid
from datetime import datetime

class VirginsDatingAppTester:
    def __init__(self, base_url="https://27f60236-87dd-4eea-9a6a-6815079e7e3d.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.uid = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        if self.uid:
            default_headers['x-firebase-uid'] = self.uid
        if headers:
            default_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")

            return success, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("Health Check", "GET", "api/health", 200)

    def test_signup(self, name, email, password):
        """Test user signup"""
        success, response = self.run_test(
            "User Signup",
            "POST",
            "api/auth/signup",
            200,
            data={"name": name, "email": email, "password": password}
        )
        if success and 'uid' in response:
            self.uid = response['uid']
            self.token = response.get('token')
            print(f"   Created user with UID: {self.uid}")
            return True
        return False

    def test_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'uid' in response:
            self.uid = response['uid']
            self.token = response.get('token')
            print(f"   Logged in with UID: {self.uid}")
            return True
        return False

    def test_get_profile(self):
        """Test getting user profile"""
        return self.run_test("Get User Profile", "GET", "api/users/me", 200)

    def test_profile_update(self):
        """Test profile update with bio, work, education, height, exercise"""
        profile_data = {
            "bio": "Faithful believer looking for my covenant partner",
            "work": "Software Engineer", 
            "education": "Computer Science",
            "height": "5'10\"",
            "exercise": "Active"
        }
        return self.run_test(
            "Update Profile Fields",
            "PUT",
            "api/users/me",
            200,
            data=profile_data
        )

    def test_discover_users(self):
        """Test user discovery"""
        return self.run_test("Discover Users", "GET", "api/users/discover?gender=Female&min_age=18&max_age=35", 200)

    def test_likes_functionality(self):
        """Test liking functionality"""
        # First get some users to like
        success, users = self.run_test("Get Users for Liking", "GET", "api/users/discover?gender=Female", 200)
        if not success or not users:
            return False
        
        target_user_id = users[0].get('firebaseUid')
        if not target_user_id:
            print("   No valid user ID found to like")
            return False
            
        # Test sending a like
        success, _ = self.run_test(
            "Send Like",
            "POST", 
            "api/likes",
            200,
            data={"toUserId": target_user_id}
        )
        return success

    def test_get_received_likes(self):
        """Test getting received likes"""
        return self.run_test("Get Received Likes", "GET", "api/likes/received", 200)

    def test_get_sent_likes(self):
        """Test getting sent likes"""
        return self.run_test("Get Sent Likes", "GET", "api/likes/sent", 200)

def main():
    print("🚀 Starting VIRGINS Dating App Backend Tests")
    print("=" * 60)
    
    tester = VirginsDatingAppTester()
    
    # Test health check
    if not tester.test_health_check()[0]:
        print("❌ Health check failed, stopping tests")
        return 1

    # Test signup with unique email
    timestamp = int(datetime.now().timestamp())
    test_email = f"testuser_{timestamp}@example.com"
    test_name = f"Test User {timestamp}"
    test_password = "securepass123"
    
    print(f"\n📧 Testing with email: {test_email}")
    
    if not tester.test_signup(test_name, test_email, test_password):
        print("❌ Signup failed, stopping tests")
        return 1

    # Test getting profile
    if not tester.test_get_profile()[0]:
        print("❌ Get profile failed")
        return 1

    # Test profile update with new fields
    if not tester.test_profile_update()[0]:
        print("❌ Profile update failed")
        return 1

    # Test user discovery
    if not tester.test_discover_users()[0]:
        print("❌ User discovery failed")
        return 1

    # Test likes functionality
    if not tester.test_likes_functionality():
        print("❌ Likes functionality failed")

    # Test getting likes
    tester.test_get_received_likes()
    tester.test_get_sent_likes()

    # Test login with existing user
    print(f"\n🔄 Testing login with existing user: marygrace@example.com")
    tester_login = VirginsDatingAppTester()
    if not tester_login.test_login("marygrace@example.com", "grace123"):
        print("❌ Login with existing user failed")

    # Print results
    print(f"\n📊 Backend Test Results:")
    print(f"   Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"   Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
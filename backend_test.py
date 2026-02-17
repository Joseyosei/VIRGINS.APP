#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class VirginsDatingAPITester:
    def __init__(self, base_url="https://27f60236-87dd-4eea-9a6a-6815079e7e3d.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_test(self, name, success, details="", response_data=None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data
        }
        self.results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")
        if response_data and isinstance(response_data, dict):
            print(f"    Response: {json.dumps(response_data, indent=2)}")
        print()

    def run_test(self, name, method, endpoint, expected_status, headers=None, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        request_headers = headers or {}
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=10)
            else:
                self.log_test(name, False, f"Unsupported method: {method}")
                return False, {}

            success = response.status_code == expected_status
            response_json = {}
            
            try:
                response_json = response.json()
            except:
                response_json = {"raw_response": response.text}

            details = f"Expected {expected_status}, got {response.status_code}"
            if not success:
                details += f" - {response.text[:200]}"
            
            self.log_test(name, success, details, response_json)
            return success, response_json

        except Exception as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test backend health endpoint"""
        return self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )

    def test_admin_stats(self):
        """Test admin stats endpoint - should show seeded users"""
        success, response = self.run_test(
            "Admin Stats - Seeded Users Check",
            "GET", 
            "api/admin/stats",
            200
        )
        
        if success and response.get('totalUsers', 0) >= 8:
            self.log_test("Admin Stats - User Count Validation", True, 
                         f"Found {response.get('totalUsers')} users (>= 8 expected)")
            return True
        else:
            self.log_test("Admin Stats - User Count Validation", False,
                         f"Expected >= 8 users, found {response.get('totalUsers', 0)}")
            return False

    def test_discover_endpoint(self):
        """Test discover endpoint with filtering"""
        headers = {'x-firebase-uid': 'test_user'}
        return self.run_test(
            "Discover Users with Filtering",
            "GET",
            "api/users/discover?gender=Female&min_age=18&max_age=50",
            200,
            headers
        )

    def test_like_functionality(self):
        """Test like creation and mutual matching"""
        # Test creating a like
        like_data = {"toUserId": "mock_elizabeth_1"}
        headers = {'x-firebase-uid': 'test_liker'}
        
        success, response = self.run_test(
            "Create Like",
            "POST",
            "api/likes",
            200,
            headers,
            like_data
        )
        
        if not success:
            return False
        
        # Test getting received likes
        elizabeth_headers = {'x-firebase-uid': 'mock_elizabeth_1'}
        success, response = self.run_test(
            "Get Received Likes",
            "GET",
            "api/likes/received",
            200,
            elizabeth_headers
        )
        
        if success and isinstance(response, list):
            # Check if test_liker is in the likes
            liker_found = any(like.get('firebaseUid') == 'test_liker' for like in response)
            self.log_test("Received Likes Validation", liker_found, 
                         "test_liker found in received likes" if liker_found else "test_liker not found in received likes")
        
        # Test mutual like (Elizabeth likes back test_liker)
        mutual_like_data = {"toUserId": "test_liker"}
        success, response = self.run_test(
            "Create Mutual Like (Should Create Match)",
            "POST",
            "api/likes",
            200,
            elizabeth_headers,
            mutual_like_data
        )
        
        if success and response.get('matched'):
            self.log_test("Mutual Like Creates Match", True, "Match created successfully")
        else:
            self.log_test("Mutual Like Creates Match", False, 
                         f"Expected matched=true, got matched={response.get('matched')}")
        
        return success

    def test_matches_endpoint(self):
        """Test matches endpoint"""
        headers = {'x-firebase-uid': 'test_liker'}
        return self.run_test(
            "Get Matches",
            "GET",
            "api/matches",
            200,
            headers
        )

    def test_ai_bio_generation(self):
        """Test AI bio generation endpoint"""
        bio_data = {
            "name": "Sarah",
            "age": "24", 
            "faith": "Baptist",
            "hobbies": "Hiking",
            "values": "Purity, Family",
            "lookingFor": "A spiritual leader"
        }
        
        success, response = self.run_test(
            "AI Bio Generation",
            "POST",
            "api/ai/generate-bio",
            200,
            None,
            bio_data
        )
        
        if success and response.get('bio') and response.get('advice'):
            self.log_test("AI Bio Generation Validation", True, 
                         "Bio and advice generated successfully")
        else:
            self.log_test("AI Bio Generation Validation", False,
                         "Bio or advice missing from response")
        
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting VIRGINS Dating App Backend Tests")
        print("=" * 60)
        print()
        
        # Test in sequence for dependencies
        tests = [
            self.test_health_check,
            self.test_admin_stats,
            self.test_discover_endpoint,
            self.test_like_functionality,
            self.test_matches_endpoint,
            self.test_ai_bio_generation
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                print(f"❌ CRITICAL ERROR in {test.__name__}: {str(e)}")
                self.log_test(test.__name__, False, f"Critical error: {str(e)}")
        
        # Print final summary
        print("=" * 60)
        print(f"📊 FINAL RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 ALL BACKEND TESTS PASSED!")
        else:
            print("⚠️  Some backend tests failed")
        
        return self.tests_passed == self.tests_run

def main():
    tester = VirginsDatingAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
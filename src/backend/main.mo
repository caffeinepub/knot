import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";



actor {
  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type User = {
    id : Nat;
    name : Text;
    skill : Text;
    location : Text;
    trustScore : Nat;
    endorsementCount : Nat;
    badgeLevel : Text;
    distance : Nat;
    bio : Text;
    videoURL : Text;
    contact : Text;
  };

  public type Citizen = {
    id : Nat;
    name : Text;
    address : Text;
  };

  public type LearningRequest = {
    id : Nat;
    requesterId : Text;
    targetUserId : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  public type CertificationResult = {
    workerId : Nat;
    skill : Text;
    level : Text;
    passed : Bool;
    issuedDate : Time.Time;
    certificateId : Text;
    mcqScore : Nat;
    practicalPassed : Bool;
  };

  public type WorkerCredential = {
    workerId : Nat;
    username : Text;
    passwordHash : Text;
  };

  public type CitizenCredential = {
    citizenId : Nat;
    username : Text;
    passwordHash : Text;
  };

  public type VideoEntry = {
    workerId : Nat;
    dataURI : Text;
  };

  public type UserProfile = {
    name : Text;
    userType : Text; // "worker", "citizen", or "admin"
    userId : Nat;
  };

  public type PracticalVideoSubmission = {
    workerId : Nat;
    workerName : Text;
    skill : Text;
    videoDataURI : Text;
    status : Text;
    submittedAt : Time.Time;
  };

  module User {
    public func compareByRank(user1 : User, user2 : User) : Order.Order {
      let rank1 = user1.trustScore * 2 + user1.endorsementCount;
      let rank2 = user2.trustScore * 2 + user2.endorsementCount;
      Nat.compare(rank2, rank1);
    };
  };

  var users : [User] = [];
  var citizens : [Citizen] = [];
  var learningRequests : [LearningRequest] = [];
  var certificationResults : [CertificationResult] = [];
  var practicalVideoSubmissions : [PracticalVideoSubmission] = [];
  var nextUserId = 1;
  var nextCitizenId = 1;
  var nextRequestId = 1;
  var videoStore : [VideoEntry] = [];
  var workerCredentials : [WorkerCredential] = [];
  var citizenCredentials : [CitizenCredential] = [];
  let adminPasswordHash = "4aee17e147a0be1a895dee08b461df414f985c15f3e119b6e4e3c836f95ad6b3";

  let userProfiles = Map.empty<Principal, UserProfile>();

  func calculateBadge(endorsementCount : Nat) : Text {
    if (endorsementCount >= 15) { "Gold" } else if (endorsementCount >= 7) {
      "Silver";
    } else if (endorsementCount >= 3) { "Bronze" } else { "None" };
  };

  func iterFromArray<T>(array : [T]) : Iter.Iter<T> {
    array.values();
  };

  func containsSubstring(text : Text, searchTerm : Text) : Bool {
    let lowerText = text.toLower();
    let lowerSearch = searchTerm.toLower();
    lowerText.contains(#text lowerSearch);
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only: Clear all data
  public shared ({ caller }) func clearAllData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear all data");
    };
    users := [];
    citizens := [];
    learningRequests := [];
    certificationResults := [];
    practicalVideoSubmissions := [];
    nextUserId := 1;
    nextCitizenId := 1;
    nextRequestId := 1;
    videoStore := [];
    workerCredentials := [];
    citizenCredentials := [];
  };

  // Public: View all users
  public query ({ caller }) func getAllUsers() : async [User] {
    users.sort(User.compareByRank);
  };

  // Public: Get specific user
  public query ({ caller }) func getUser(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Public: Get users by skill
  public query ({ caller }) func getUsersBySkill(skill : Text) : async [User] {
    users.filter(
      func(user) { Text.equal(user.skill, skill) }
    );
  };

  // Public: Get users by distance
  public query ({ caller }) func getUsersByDistance(maxDistance : Nat) : async [User] {
    users.filter(
      func(user) { user.distance <= maxDistance }
    );
  };

  // Public: Search users
  public query ({ caller }) func searchUsers(searchText : Text) : async [User] {
    users.filter(
      func(user) {
        containsSubstring(user.name, searchText) or containsSubstring(user.skill, searchText);
      }
    ).sort(User.compareByRank);
  };

  // Public: Register worker (anyone can register)
  public shared ({ caller }) func registerWorker(
    username : Text,
    passwordHash : Text,
    name : Text,
    skill : Text,
    location : Text,
    bio : Text,
    videoURL : Text,
    distance : Nat,
    contact : Text,
  ) : async Nat {
    let id = nextUserId;
    let newUser = {
      id;
      name;
      skill;
      location;
      trustScore = 0;
      endorsementCount = 0;
      badgeLevel = "None";
      distance;
      bio;
      videoURL;
      contact;
    };

    let newCredential = {
      workerId = id;
      username;
      passwordHash;
    };

    users := users.concat([newUser]);
    workerCredentials := workerCredentials.concat([newCredential]);

    nextUserId += 1;
    id;
  };

  // Public: Register citizen (anyone can register)
  public shared ({ caller }) func registerCitizen(name : Text, address : Text, username : Text, passwordHash : Text) : async Nat {
    let id = nextCitizenId;
    let newCitizen = { id; name; address };
    let newCredential = {
      citizenId = id;
      username;
      passwordHash;
    };

    citizens := citizens.concat([newCitizen]);
    citizenCredentials := citizenCredentials.concat([newCredential]);

    nextCitizenId += 1;
    id;
  };

  // Authenticated users: Endorse a worker
  public shared ({ caller }) func endorseUser(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can endorse workers");
    };

    let foundUser = users.find(func(user) { user.id == id });

    switch (foundUser) {
      case (?user) {
        let updatedUser = {
          id = user.id;
          name = user.name;
          skill = user.skill;
          location = user.location;
          trustScore = user.trustScore + 1;
          endorsementCount = user.endorsementCount + 1;
          badgeLevel = calculateBadge(user.endorsementCount + 1);
          distance = user.distance;
          bio = user.bio;
          videoURL = user.videoURL;
          contact = user.contact;
        };

        users := users.map<User, User>(
          func(u) {
            if (u.id == id) { updatedUser } else { u };
          }
        );
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Authenticated users: Submit learning request
  public shared ({ caller }) func submitLearningRequest(requesterId : Text, targetUserId : Nat, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit learning requests");
    };

    let request = {
      id = nextRequestId;
      requesterId;
      targetUserId;
      message;
      timestamp = Time.now();
    };

    learningRequests := learningRequests.concat([request]);
    nextRequestId += 1;
  };

  // Public: View all learning requests
  public query ({ caller }) func getAllLearningRequests() : async [LearningRequest] {
    learningRequests;
  };

  // Public: Get learning requests for a specific worker
  public query ({ caller }) func getLearningRequestsForWorker(workerId : Nat) : async [LearningRequest] {
    learningRequests.filter(
      func(request) { request.targetUserId == workerId }
    );
  };

  // Public: Get worker stats
  public query ({ caller }) func getWorkerStats(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Authenticated users: Submit test result
  public shared ({ caller }) func submitTestResult(workerId : Nat, mcqScore : Nat, practicalPassed : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit test results");
    };

    let foundUser = users.find(func(user) { user.id == workerId });
    switch (foundUser) {
      case (null) { false };
      case (?user) {
        let passed = mcqScore >= 6 and practicalPassed;
        let certificateId = "KNOT-" # workerId.toText() # "-Basic";
        let certification = {
          workerId;
          skill = user.skill;
          level = "Basic";
          passed;
          issuedDate = Time.now();
          certificateId;
          mcqScore;
          practicalPassed;
        };

        certificationResults := certificationResults.filter(
          func(cert) { cert.workerId != workerId }
        ).concat([certification]);
        passed;
      };
    };
  };

  // Public: Get certification
  public query ({ caller }) func getCertification(workerId : Nat) : async ?CertificationResult {
    let found = certificationResults.find(
      func(cert) { cert.workerId == workerId }
    );
    found;
  };

  // Public: Find worker by name
  public query ({ caller }) func findWorkerByName(name : Text) : async ?User {
    users.find(
      func(user) {
        user.name.toLower() == name.toLower();
      }
    );
  };

  // Public: Find citizen by name
  public query ({ caller }) func findCitizenByName(name : Text) : async ?Citizen {
    citizens.find(
      func(citizen) {
        citizen.name.toLower() == name.toLower();
      }
    );
  };

  // Authenticated users: Save worker video
  public shared ({ caller }) func saveWorkerVideo(workerId : Nat, dataURI : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save videos");
    };

    let newVideoEntry = { workerId; dataURI };
    videoStore := videoStore.filter(
      func(video) { video.workerId != workerId }
    ).concat([newVideoEntry]);
  };

  // Public: Get worker video
  public query ({ caller }) func getWorkerVideo(workerId : Nat) : async Text {
    switch (videoStore.find(func(video) { video.workerId == workerId })) {
      case (?video) { video.dataURI };
      case (null) { "" };
    };
  };

  // Public: Login functions (authentication, not authorization)
  public query ({ caller }) func loginWorker(username : Text, passwordHash : Text) : async ?User {
    let credMatch = workerCredentials.find(
      func(cred) { Text.equal(cred.username, username) and Text.equal(cred.passwordHash, passwordHash) }
    );

    switch (credMatch) {
      case (?cred) {
        users.find(
          func(user) { user.id == cred.workerId }
        );
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func loginCitizen(username : Text, passwordHash : Text) : async ?Citizen {
    let credMatch = citizenCredentials.find(
      func(cred) { Text.equal(cred.username, username) and Text.equal(cred.passwordHash, passwordHash) }
    );

    switch (credMatch) {
      case (?cred) {
        citizens.find(
          func(citizen) { citizen.id == cred.citizenId }
        );
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func loginAdmin(username : Text, passwordHash : Text) : async Bool {
    let isAdmin = Text.equal(username, "admin");
    let isPwMatch = Text.equal(passwordHash, adminPasswordHash);
    isAdmin and isPwMatch;
  };

  // Admin-only: Get all citizens
  public query ({ caller }) func getAllCitizens() : async [Citizen] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all citizens");
    };
    citizens;
  };

  // Admin-only: Get admin stats
  public query ({ caller }) func getAdminStats() : async {
    totalWorkers : Nat;
    totalCitizens : Nat;
    totalCertified : Nat;
    totalRequests : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view statistics");
    };

    let certifiedCount = certificationResults.filter(
      func(cert) { cert.passed }
    ).size();

    {
      totalWorkers = users.size();
      totalCitizens = citizens.size();
      totalCertified = certifiedCount;
      totalRequests = learningRequests.size();
    };
  };

  // **********************************************
  // ************** NEW FORMAL CERTIFICATION FLOW (Submission/Approval) **************
  // **********************************************
  
  // Authenticated users: Submit practical video for certification
  public shared ({ caller }) func submitPracticalVideo(workerId : Nat, workerName : Text, skill : Text, videoDataURI : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit practical videos");
    };

    let newSubmission = {
      workerId;
      workerName;
      skill;
      videoDataURI;
      status = "pending";
      submittedAt = Time.now();
    };

    practicalVideoSubmissions := practicalVideoSubmissions.filter(
      func(submission) { submission.workerId != workerId }
    ).concat([newSubmission]);
  };

  // Admin-only: Get all pending practical videos for review
  public query ({ caller }) func getPendingPracticalVideos() : async [PracticalVideoSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view pending practical videos");
    };
    
    practicalVideoSubmissions.filter(
      func(submission) { submission.status == "pending" }
    );
  };

  // Admin-only: Approve practical video and grant certification
  public shared ({ caller }) func approvePracticalVideo(workerId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve practical videos");
    };

    let foundSubmission = practicalVideoSubmissions.find(
      func(submission) { submission.workerId == workerId }
    );

    switch (foundSubmission) {
      case (?submission) {
        // Update the status to "approved"
        practicalVideoSubmissions := practicalVideoSubmissions.map<PracticalVideoSubmission, PracticalVideoSubmission>(
          func(sub) {
            if (sub.workerId == workerId) {
              { sub with status = "approved" };
            } else { sub };
          }
        );

        // Find the worker to get their skill
        let foundUser = users.find(func(user) { user.id == workerId });
        
        switch (foundUser) {
          case (?user) {
            // Check if certification already exists
            let existingCert = certificationResults.find(
              func(cert) { cert.workerId == workerId }
            );

            switch (existingCert) {
              case (?cert) {
                // Update existing certification
                certificationResults := certificationResults.map(
                  func(c) {
                    if (c.workerId == workerId) {
                      { c with practicalPassed = true; passed = c.mcqScore >= 6 and true };
                    } else { c };
                  }
                );
              };
              case (null) {
                // Create new certification result
                let certificateId = "KNOT-" # workerId.toText() # "-Basic";
                let newCert = {
                  workerId;
                  skill = user.skill;
                  level = "Basic";
                  passed = true;
                  issuedDate = Time.now();
                  certificateId;
                  mcqScore = 0;
                  practicalPassed = true;
                };
                certificationResults := certificationResults.concat([newCert]);
              };
            };
          };
          case (null) {};
        };

        true;
      };
      case (null) { false };
    };
  };

  // Admin-only: Reject practical video
  public shared ({ caller }) func rejectPracticalVideo(workerId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject practical videos");
    };

    let foundSubmission = practicalVideoSubmissions.find(
      func(submission) { submission.workerId == workerId }
    );

    switch (foundSubmission) {
      case (?_submission) {
        // Update the status to "rejected"
        practicalVideoSubmissions := practicalVideoSubmissions.map<PracticalVideoSubmission, PracticalVideoSubmission>(
          func(submission) {
            if (submission.workerId == workerId) {
              { submission with status = "rejected" };
            } else { submission };
          }
        );

        true;
      };
      case (null) { false };
    };
  };

  // Public: Get practical video submission status (workers can check their own status)
  public query ({ caller }) func getPracticalVideoStatus(workerId : Nat) : async Text {
    let submission = practicalVideoSubmissions.find(
      func(sub) { sub.workerId == workerId }
    );
    switch (submission) {
      case (?sub) { sub.status };
      case (null) { "none" };
    };
  };
};

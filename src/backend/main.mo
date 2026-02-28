import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

actor {
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
  var nextUserId = 1;
  var nextCitizenId = 1;
  var nextRequestId = 1;

  func calculateBadge(endorsementCount : Nat) : Text {
    if (endorsementCount >= 15) { "Gold" } else if (endorsementCount >= 7) {
      "Silver";
    } else if (endorsementCount >= 3) { "Bronze" } else { "None" };
  };

  /// Helper to convert an Array to an Iter (for mapped arrays)
  func iterFromArray<T>(array : [T]) : Iter.Iter<T> {
    array.values();
  };

  /// Helper to support case-insensitive substring search
  func containsSubstring(text : Text, searchTerm : Text) : Bool {
    let lowerText = text.toLower();
    let lowerSearch = searchTerm.toLower();
    lowerText.contains(#text lowerSearch);
  };

  public shared ({ caller }) func init() : async () {};

  public shared ({ caller }) func clearAllData() : async () {
    users := [];
    citizens := [];
    learningRequests := [];
    certificationResults := [];
    nextUserId := 1;
    nextCitizenId := 1;
    nextRequestId := 1;
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    users.sort(User.compareByRank);
  };

  public query ({ caller }) func getUser(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public query ({ caller }) func getUsersBySkill(skill : Text) : async [User] {
    users.filter(
      func(user) { Text.equal(user.skill, skill) }
    );
  };

  public query ({ caller }) func getUsersByDistance(maxDistance : Nat) : async [User] {
    users.filter(
      func(user) { user.distance <= maxDistance }
    );
  };

  public query ({ caller }) func searchUsers(searchText : Text) : async [User] {
    users.filter(
      func(user) {
        containsSubstring(user.name, searchText) or containsSubstring(user.skill, searchText);
      }
    ).sort(User.compareByRank);
  };

  public shared ({ caller }) func registerWorker(
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
    users := users.concat([newUser]);
    nextUserId += 1;
    id;
  };

  public shared ({ caller }) func registerCitizen(name : Text, address : Text) : async Nat {
    let id = nextCitizenId;
    let newCitizen = { id; name; address };
    citizens := citizens.concat([newCitizen]);
    nextCitizenId += 1;
    id;
  };

  public shared ({ caller }) func endorseUser(id : Nat) : async () {
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

  public shared ({ caller }) func submitLearningRequest(requesterId : Text, targetUserId : Nat, message : Text) : async () {
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

  public query ({ caller }) func getAllLearningRequests() : async [LearningRequest] {
    learningRequests;
  };

  public query ({ caller }) func getLearningRequestsForWorker(workerId : Nat) : async [LearningRequest] {
    learningRequests.filter(
      func(request) { request.targetUserId == workerId }
    );
  };

  public query ({ caller }) func getWorkerStats(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func submitTestResult(workerId : Nat, mcqScore : Nat, practicalPassed : Bool) : async Bool {
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

  public query ({ caller }) func getCertification(workerId : Nat) : async ?CertificationResult {
    let found = certificationResults.find(
      func(cert) { cert.workerId == workerId }
    );
    found;
  };

  // === Backend Find by Full Name Functions @v3 ===
  public query ({ caller }) func findWorkerByName(name : Text) : async ?User {
    users.find(
      func(user) {
        user.name.toLower() == name.toLower();
      }
    );
  };

  public query ({ caller }) func findCitizenByName(name : Text) : async ?Citizen {
    citizens.find(
      func(citizen) {
        citizen.name.toLower() == name.toLower();
      }
    );
  };
};

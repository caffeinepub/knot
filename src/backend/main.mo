import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";



actor {
  type User = {
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
  };

  type Citizen = {
    id : Nat;
    name : Text;
    address : Text;
  };

  type LearningRequest = {
    id : Nat;
    requesterId : Text;
    targetUserId : Nat;
    message : Text;
    timestamp : Time.Time;
  };

  type CertificationResult = {
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

  var users : [User] = [
    {
      id = 1;
      name = "Ravi Kumar";
      skill = "Carpenter";
      location = "Hyderabad";
      trustScore = 8;
      endorsementCount = 5;
      badgeLevel = "Bronze";
      distance = 3;
      bio = "Experienced carpenter specializing in wooden furniture and home interiors.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 2;
      name = "Sunita Devi";
      skill = "Tailor";
      location = "Chennai";
      trustScore = 15;
      endorsementCount = 20;
      badgeLevel = "Gold";
      distance = 7;
      bio = "Master tailor with 15 years of experience in traditional and modern clothing.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 3;
      name = "Ramesh Plumber";
      skill = "Plumber";
      location = "Bangalore";
      trustScore = 12;
      endorsementCount = 10;
      badgeLevel = "Silver";
      distance = 5;
      bio = "Certified plumber specializing in residential and commercial projects.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 4;
      name = "Lakshmi Potter";
      skill = "Potter";
      location = "Jaipur";
      trustScore = 7;
      endorsementCount = 3;
      badgeLevel = "Bronze";
      distance = 12;
      bio = "Traditional potter creating handmade clay art and pottery.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 5;
      name = "Arun Carpenter";
      skill = "Carpenter";
      location = "Mumbai";
      trustScore = 10;
      endorsementCount = 8;
      badgeLevel = "Silver";
      distance = 9;
      bio = "Specializing in modular furniture and wooden flooring.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 6;
      name = "Priya Tailor";
      skill = "Tailor";
      location = "Delhi";
      trustScore = 6;
      endorsementCount = 2;
      badgeLevel = "None";
      distance = 14;
      bio = "Passionate tailor for bridal and festive outfits.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 7;
      name = "Suresh Plumber";
      skill = "Plumber";
      location = "Pune";
      trustScore = 9;
      endorsementCount = 6;
      badgeLevel = "Bronze";
      distance = 4;
      bio = "Expert in pipeline installation and leak repair.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 8;
      name = "Kamala Potter";
      skill = "Potter";
      location = "Kolkata";
      trustScore = 11;
      endorsementCount = 15;
      badgeLevel = "Gold";
      distance = 6;
      bio = "Award-winning pottery artist with unique designs.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 9;
      name = "Vijay Carpenter";
      skill = "Carpenter";
      location = "Ahmedabad";
      trustScore = 8;
      endorsementCount = 4;
      badgeLevel = "Bronze";
      distance = 11;
      bio = "Tech-savvy carpenter focused on modern minimalist design.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
    {
      id = 10;
      name = "Meena Tailor";
      skill = "Tailor";
      location = "Lucknow";
      trustScore = 14;
      endorsementCount = 18;
      badgeLevel = "Gold";
      distance = 2;
      bio = "Expert in sarees and designer ethnic wear.";
      videoURL = "https://www.w3schools.com/html/mov_bbb.mp4";
    },
  ];

  var citizens : [Citizen] = [];
  var learningRequests : [LearningRequest] = [];
  var certificationResults : [CertificationResult] = [];
  var nextUserId = 11;
  var nextCitizenId = 1;
  var nextRequestId = 1;

  // No-op since users are pre-populated
  public shared ({ caller }) func init() : async () {};

  // Badge calculation
  func calculateBadge(endorsementCount : Nat) : Text {
    if (endorsementCount >= 15) { "Gold" } else if (endorsementCount >= 7) {
      "Silver";
    } else if (endorsementCount >= 3) { "Bronze" } else { "None" };
  };

  // Get all users sorted by rank
  public query ({ caller }) func getAllUsers() : async [User] {
    users.sort(User.compareByRank);
  };

  // Get user by id
  public query ({ caller }) func getUser(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // Get users by skill
  public query ({ caller }) func getUsersBySkill(skill : Text) : async [User] {
    users.filter(
      func(user) { Text.equal(user.skill, skill) }
    );
  };

  // Get users by max distance
  public query ({ caller }) func getUsersByDistance(maxDistance : Nat) : async [User] {
    users.filter(
      func(user) { user.distance <= maxDistance }
    );
  };

  // Endorse user
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

  // Submit learning request
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

  // Get all learning requests
  public query ({ caller }) func getAllLearningRequests() : async [LearningRequest] {
    learningRequests;
  };

  // Register a new worker (returns assigned id)
  public shared ({ caller }) func registerWorker(name : Text, skill : Text, location : Text, bio : Text, videoURL : Text) : async Nat {
    let id = nextUserId;
    let newUser = {
      id;
      name;
      skill;
      location;
      trustScore = 0;
      endorsementCount = 0;
      badgeLevel = "None";
      distance = 0;
      bio;
      videoURL;
    };
    users := users.concat([newUser]);
    nextUserId += 1;
    id;
  };

  // Register a new citizen (returns assigned id)
  public shared ({ caller }) func registerCitizen(name : Text, address : Text) : async Nat {
    let id = nextCitizenId;
    let newCitizen = { id; name; address };
    citizens := citizens.concat([newCitizen]);
    nextCitizenId += 1;
    id;
  };

  // Get learning requests for a specific worker
  public query ({ caller }) func getLearningRequestsForWorker(workerId : Nat) : async [LearningRequest] {
    learningRequests.filter(
      func(request) { request.targetUserId == workerId }
    );
  };

  // Get worker stats (same as getUser)
  public query ({ caller }) func getWorkerStats(id : Nat) : async User {
    let foundUser = users.find(func(user) { user.id == id });
    switch (foundUser) {
      case (?user) { user };
      case (null) { Runtime.trap("User not found") };
    };
  };

  // ------------------ Certification System ------------------

  // Submit test result (MCQ + Practical)
  public shared ({ caller }) func submitTestResult(workerId : Nat, mcqScore : Nat, practicalPassed : Bool) : async Bool {
    let foundUser = users.find(func(user) { user.id == workerId });
    switch (foundUser) {
      case (null) { false };
      case (?user) {
        let passed = mcqScore >= 6 and practicalPassed;
        let certificateId = "KNOT-" # workerId.toText() # "-" # user.skill;
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

  // Get certification result for worker
  public query ({ caller }) func getCertification(workerId : Nat) : async ?CertificationResult {
    let found = certificationResults.find(
      func(cert) { cert.workerId == workerId }
    );
    found;
  };
};


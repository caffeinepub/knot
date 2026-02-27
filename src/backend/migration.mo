import Array "mo:core/Array";
import Time "mo:core/Time";

module {
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

  type OldActor = {
    users : [User];
    citizens : [Citizen];
    learningRequests : [LearningRequest];
    certificationResults : [CertificationResult];
    nextUserId : Nat;
    nextCitizenId : Nat;
    nextRequestId : Nat;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    {
      users = old.users;
      citizens = old.citizens;
      learningRequests = old.learningRequests;
      certificationResults = old.certificationResults;
      nextUserId = old.nextUserId;
      nextCitizenId = old.nextCitizenId;
      nextRequestId = old.nextRequestId;
    };
  };
};

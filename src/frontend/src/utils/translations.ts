export type LangCode = "en" | "te" | "hi" | "ml" | "kn";

export interface Translations {
  // Navbar
  nav_home: string;
  nav_communities: string;
  nav_requests: string;
  nav_dashboard: string;
  nav_logout: string;
  nav_login: string;
  nav_worker: string;
  nav_citizen: string;
  nav_my_dashboard: string;
  nav_learning_requests: string;
  nav_community_suffix: string;

  // HomePage
  home_hero_title_1: string;
  home_hero_title_2: string;
  home_hero_title_3: string;
  home_hero_welcome: string;
  home_hero_showing_near: string;
  home_hero_connect: string;
  stat_professionals: string;
  stat_skill_types: string;
  stat_avg_trust: string;
  stat_badged: string;
  filter_sorted_trust: string;
  filter_showing: string;
  filter_professionals: string;
  filter_in: string;
  search_placeholder: string;
  dist_any: string;
  dist_5km: string;
  dist_10km: string;
  dist_20km: string;

  // LoginPage
  login_join_community: string;
  login_subtitle: string;
  login_im_citizen: string;
  login_im_worker: string;
  login_your_name: string;
  login_your_skill: string;
  login_your_location: string;
  login_bio: string;
  login_video_profile: string;
  login_optional: string;
  login_enter_name: string;
  login_enter_city: string;
  login_select_skill: string;
  login_bio_placeholder: string;
  login_upload_video: string;
  login_video_formats: string;
  login_ready_upload: string;
  login_remove: string;
  login_enter_as_citizen: string;
  login_register_as_worker: string;
  login_finding_workers: string;
  login_creating_profile: string;
  login_citizen_hint: string;
  login_welcome_citizen: string;
  login_welcome_worker: string;
  login_location_label: string;

  // ProfilePage
  profile_back: string;
  profile_about: string;
  profile_trust_score: string;
  profile_endorsements: string;
  profile_km_away: string;
  profile_badge_progress: string;
  profile_achieved: string;
  profile_endorse: string;
  profile_endorsing: string;
  profile_endorsed: string;
  profile_request_learn: string;
  profile_send_request: string;
  profile_sending: string;
  profile_cancel: string;
  profile_your_name: string;
  profile_message: string;
  profile_learn_placeholder: string;
  profile_watch_external: string;
  profile_not_found: string;
  profile_not_found_desc: string;

  // CommunityPage
  community_back: string;
  community_loading: string;
  community_members_suffix: string;
  community_failed: string;
  community_no_members: string;
  community_empty_desc: string;
  community_browse: string;
  community_sorted: string;

  // WorkerDashboardPage
  dashboard_title: string;
  dashboard_your_stats: string;
  dashboard_trust_score: string;
  dashboard_endorsements: string;
  dashboard_badge_level: string;
  dashboard_badge_progress: string;
  dashboard_endorsements_count: string;
  dashboard_video_title: string;
  dashboard_video_live: string;
  dashboard_no_video: string;
  dashboard_add_video: string;
  dashboard_requests_title: string;
  dashboard_no_requests: string;
  dashboard_requests_hint: string;
  dashboard_pending: string;
  dashboard_about_you: string;

  // RequestsPage
  requests_title: string;
  requests_submitted: string;
  requests_failed: string;
  requests_none: string;
  requests_none_desc: string;
  requests_browse: string;

  // General
  error_profile_not_found: string;
  error_load_professionals: string;
  error_no_professionals: string;
  error_adjust_filters: string;
  error_something_wrong: string;
  error_please_fill: string;
  error_please_fill_required: string;
  error_backend_not_ready: string;
  error_registration_failed: string;
  error_endorse_failed: string;
  error_request_failed: string;
  error_enter_name: string;
  error_enter_message: string;
  success_endorsed: string;
  success_request_sent: string;

  // Voice
  voice_listening: string;
  voice_heard: string;
  voice_failed: string;
  voice_chrome_required: string;

  // Skill names
  skill_all: string;
  skill_carpenter: string;
  skill_tailor: string;
  skill_plumber: string;
  skill_potter: string;
  skill_electrician: string;
  skill_painter: string;
  skill_mason: string;
  skill_welder: string;
  skill_blacksmith: string;
  skill_cobbler: string;
  skill_barber: string;
  skill_chef: string;
  skill_driver: string;
  skill_farmer: string;

  // Badge names & misc
  badge_bronze: string;
  badge_silver: string;
  badge_gold: string;
  badge_member: string;
  badge_portfolio: string;
  community_link_suffix: string;

  // Share Profile & Notifications
  profile_share: string;
  profile_share_copied: string;
  profile_contact: string;
  notif_title: string;
  notif_mark_read: string;
  notif_empty: string;
  notif_endorsement: string;
  notif_learning_request: string;
  notif_profile_view: string;
  nearby_workers_label: string;
  search_by_name_hint: string;

  // Certification / Peer Validation
  cert_section_title: string;
  cert_not_tested: string;
  cert_not_tested_desc: string;
  cert_take_test: string;
  cert_passed: string;
  cert_view_cert: string;
  cert_failed: string;
  cert_retry: string;
  cert_test_intro_title: string;
  cert_test_intro_desc: string;
  cert_start_test: string;
  cert_question_of: string;
  cert_next: string;
  cert_submit: string;
  cert_practical_title: string;
  cert_practical_upload: string;
  cert_evaluating: string;
  cert_passed_title: string;
  cert_score_label: string;
  cert_practical_label: string;
  cert_practical_accepted: string;
  cert_view_certificate: string;
  cert_certificate_title: string;
  cert_issued_to: string;
  cert_competency: string;
  cert_basic_level: string;
  cert_download: string;
  cert_no_cert: string;
  cert_go_dashboard: string;
}

const en: Translations = {
  nav_home: "Home",
  nav_communities: "Communities",
  nav_requests: "Requests",
  nav_dashboard: "Dashboard",
  nav_logout: "Logout",
  nav_login: "Login",
  nav_worker: "Worker",
  nav_citizen: "Citizen",
  nav_my_dashboard: "My Dashboard",
  nav_learning_requests: "Learning Requests",
  nav_community_suffix: "Community",

  home_hero_title_1: "Discover Skilled",
  home_hero_title_2: "Professionals",
  home_hero_title_3: "Near You",
  home_hero_welcome: "Welcome",
  home_hero_showing_near: "Showing workers near",
  home_hero_connect:
    "Connect with trusted carpenters, tailors, plumbers, potters and more — verified by their community.",
  stat_professionals: "Professionals",
  stat_skill_types: "Skill Types",
  stat_avg_trust: "Avg Trust",
  stat_badged: "Badged",
  filter_sorted_trust: "Sorted by Trust Score",
  filter_showing: "Showing",
  filter_professionals: "professional",
  filter_in: "in",
  search_placeholder: "Search by skill, name, or location...",
  dist_any: "Any Distance",
  dist_5km: "Within 5 km",
  dist_10km: "Within 10 km",
  dist_20km: "Within 20 km",

  login_join_community: "Join the Community",
  login_subtitle: "Connect as a citizen or register your vocational skills",
  login_im_citizen: "I'm a Citizen",
  login_im_worker: "I'm a Worker",
  login_your_name: "Your Name",
  login_your_skill: "Your Skill",
  login_your_location: "Your Location",
  login_bio: "Bio",
  login_video_profile: "Video Profile",
  login_optional: "optional",
  login_enter_name: "Enter your full name",
  login_enter_city: "Enter your city or area",
  login_select_skill: "Select your primary skill",
  login_bio_placeholder: "Tell people about your experience and expertise...",
  login_upload_video: "Click to upload your skill video",
  login_video_formats: "MP4, MOV, AVI up to 100MB",
  login_ready_upload: "Ready to upload",
  login_remove: "Remove",
  login_enter_as_citizen: "Enter as Citizen",
  login_register_as_worker: "Register as Worker",
  login_finding_workers: "Finding workers near you...",
  login_creating_profile: "Creating your profile...",
  login_citizen_hint:
    "As a citizen, you'll see skilled workers in your area and can send learning requests.",
  login_welcome_citizen: "Finding workers near you...",
  login_welcome_worker: "Your profile is live.",
  login_location_label: "Location",

  profile_back: "Back to Feed",
  profile_about: "About",
  profile_trust_score: "Trust Score",
  profile_endorsements: "Endorsements",
  profile_km_away: "km Away",
  profile_badge_progress: "Trust Badge Progress",
  profile_achieved: "Achieved ✓",
  profile_endorse: "Endorse",
  profile_endorsing: "Endorsing...",
  profile_endorsed: "Endorsed!",
  profile_request_learn: "Request to Learn",
  profile_send_request: "Send Request",
  profile_sending: "Sending...",
  profile_cancel: "Cancel",
  profile_your_name: "Your Name",
  profile_message: "Message",
  profile_learn_placeholder: "Send a learning request...",
  profile_watch_external: "Watch on external link →",
  profile_not_found: "Profile not found",
  profile_not_found_desc:
    "This professional may not exist or something went wrong.",

  community_back: "Back to Feed",
  community_loading: "Loading members...",
  community_members_suffix: "professional(s) in this community",
  community_failed: "Failed to load community",
  community_no_members: "No members yet",
  community_empty_desc:
    "This community is waiting for its first members to join.",
  community_browse: "Browse all professionals",
  community_sorted: "sorted by trust score",

  dashboard_title: "Worker Dashboard",
  dashboard_your_stats: "Your Stats",
  dashboard_trust_score: "Trust Score",
  dashboard_endorsements: "Endorsements",
  dashboard_badge_level: "Badge Level",
  dashboard_badge_progress: "Badge Progress",
  dashboard_endorsements_count: "endorsements",
  dashboard_video_title: "Your Video Profile",
  dashboard_video_live: "Your video profile is live and visible to citizens",
  dashboard_no_video: "No video uploaded yet",
  dashboard_add_video: "Add a video profile to attract more clients",
  dashboard_requests_title: "Learning Requests Received",
  dashboard_no_requests: "No requests yet",
  dashboard_requests_hint:
    "When citizens want to learn from you, their requests will appear here.",
  dashboard_pending: "Pending",
  dashboard_about_you: "About You",

  requests_title: "Learning Requests",
  requests_submitted: "request(s) submitted",
  requests_failed: "Failed to load requests",
  requests_none: "No learning requests yet",
  requests_none_desc:
    "When someone requests to learn from a professional, it will appear here.",
  requests_browse: "Browse professionals",

  error_profile_not_found: "Profile not found",
  error_load_professionals: "Unable to load professionals",
  error_no_professionals: "No professionals found",
  error_adjust_filters:
    "Try adjusting your filters or searching for a different skill.",
  error_something_wrong: "Something went wrong. Please refresh and try again.",
  error_please_fill: "Please fill in all fields",
  error_please_fill_required: "Please fill in name, skill, and location",
  error_backend_not_ready: "Backend not ready yet, please wait a moment",
  error_registration_failed: "Registration failed. Please try again.",
  error_endorse_failed: "Failed to endorse. Please try again.",
  error_request_failed: "Failed to send request. Please try again.",
  error_enter_name: "Please enter your name.",
  error_enter_message: "Please enter a message.",
  success_endorsed: "Endorsement submitted! 🎉",
  success_request_sent: "Learning request sent! 📚",

  voice_listening: "Listening... say a skill name",
  voice_heard: "Heard",
  voice_failed: "Voice search failed. Please try again.",
  voice_chrome_required: "Voice search requires Chrome or Edge browser.",

  skill_all: "All",
  skill_carpenter: "Carpenter",
  skill_tailor: "Tailor",
  skill_plumber: "Plumber",
  skill_potter: "Potter",
  skill_electrician: "Electrician",
  skill_painter: "Painter",
  skill_mason: "Mason",
  skill_welder: "Welder",
  skill_blacksmith: "Blacksmith",
  skill_cobbler: "Cobbler",
  skill_barber: "Barber",
  skill_chef: "Chef",
  skill_driver: "Driver",
  skill_farmer: "Farmer",

  badge_bronze: "Bronze",
  badge_silver: "Silver",
  badge_gold: "Gold",
  badge_member: "Member",
  badge_portfolio: "Portfolio",
  community_link_suffix: "Community →",

  profile_share: "Share Profile",
  profile_share_copied: "Profile link copied to clipboard!",
  profile_contact: "Contact",
  notif_title: "Notifications",
  notif_mark_read: "Mark all read",
  notif_empty: "No notifications yet",
  notif_endorsement: "endorsed your profile",
  notif_learning_request: "sent a learning request",
  notif_profile_view: "viewed your profile",
  nearby_workers_label: "Nearby Workers",
  search_by_name_hint: "Find workers near you by name or skill",

  cert_section_title: "Peer Validation",
  cert_not_tested: "Not yet certified",
  cert_not_tested_desc:
    "Take the skill test to earn your Basic Level Certificate",
  cert_take_test: "Take Certification Test",
  cert_passed: "Certified – Basic Level",
  cert_view_cert: "View Certificate",
  cert_failed: "Test Not Passed",
  cert_retry: "Retake Test",
  cert_test_intro_title: "Skill Certification Test",
  cert_test_intro_desc:
    "10 questions (9 video MCQ + 1 practical). Score 6/9 correct and submit your practical video to pass.",
  cert_start_test: "Start Test",
  cert_question_of: "Question {n} of 10",
  cert_next: "Next Question",
  cert_submit: "Submit Test",
  cert_practical_title: "Practical Task",
  cert_practical_upload: "Upload your task video",
  cert_evaluating: "Evaluating your answers...",
  cert_passed_title: "Congratulations! You Passed!",
  cert_score_label: "MCQ Score",
  cert_practical_label: "Practical Video",
  cert_practical_accepted: "Accepted",
  cert_view_certificate: "View Your Certificate",
  cert_certificate_title: "Certificate of Achievement",
  cert_issued_to: "This is to certify that",
  cert_competency: "has demonstrated basic level competency in",
  cert_basic_level: "Basic Level Certification",
  cert_download: "Download Certificate",
  cert_no_cert: "No certification found",
  cert_go_dashboard: "Go to Dashboard",
};

const te: Translations = {
  nav_home: "హోమ్",
  nav_communities: "సమాజాలు",
  nav_requests: "అభ్యర్థనలు",
  nav_dashboard: "డాష్‌బోర్డ్",
  nav_logout: "లాగ్ అవుట్",
  nav_login: "లాగిన్",
  nav_worker: "కార్మికుడు",
  nav_citizen: "పౌరుడు",
  nav_my_dashboard: "నా డాష్‌బోర్డ్",
  nav_learning_requests: "నేర్చుకోవడం అభ్యర్థనలు",
  nav_community_suffix: "సమాజం",

  home_hero_title_1: "నైపుణ్యమైన",
  home_hero_title_2: "నిపుణులను",
  home_hero_title_3: "కనుగొనండి",
  home_hero_welcome: "స్వాగతం",
  home_hero_showing_near: "సమీపంలో కార్మికులు చూపిస్తున్నారు",
  home_hero_connect:
    "నమ్మకమైన వడ్రంగులు, దర్జీలు, పైప్‌లైన్ పని వారు మరియు మరింత మందితో కలవండి.",
  stat_professionals: "నిపుణులు",
  stat_skill_types: "నైపుణ్య రకాలు",
  stat_avg_trust: "సగటు నమ్మకం",
  stat_badged: "బ్యాడ్జ్ పొందినవారు",
  filter_sorted_trust: "నమ్మకం స్కోరు ద్వారా క్రమబద్ధీకరించబడింది",
  filter_showing: "చూపిస్తున్నారు",
  filter_professionals: "నిపుణుడు",
  filter_in: "లో",
  search_placeholder: "నైపుణ్యం, పేరు లేదా స్థానం ద్వారా వెతకండి...",
  dist_any: "ఏ దూరమైనా",
  dist_5km: "5 కి.మీ లోపల",
  dist_10km: "10 కి.మీ లోపల",
  dist_20km: "20 కి.మీ లోపల",

  login_join_community: "సమాజంలో చేరండి",
  login_subtitle: "పౌరుడిగా కనెక్ట్ అవ్వండి లేదా మీ వృత్తి నైపుణ్యాలను నమోదు చేయండి",
  login_im_citizen: "నేను పౌరుడిని",
  login_im_worker: "నేను కార్మికుడిని",
  login_your_name: "మీ పేరు",
  login_your_skill: "మీ నైపుణ్యం",
  login_your_location: "మీ స్థానం",
  login_bio: "పరిచయం",
  login_video_profile: "వీడియో ప్రొఫైల్",
  login_optional: "ఐచ్ఛికం",
  login_enter_name: "మీ పూర్తి పేరు నమోదు చేయండి",
  login_enter_city: "మీ నగరం లేదా ప్రాంతం నమోదు చేయండి",
  login_select_skill: "మీ ప్రాథమిక నైపుణ్యాన్ని ఎంచుకోండి",
  login_bio_placeholder: "మీ అనుభవం మరియు నైపుణ్యం గురించి చెప్పండి...",
  login_upload_video: "మీ నైపుణ్య వీడియోను అప్‌లోడ్ చేయడానికి క్లిక్ చేయండి",
  login_video_formats: "MP4, MOV, AVI 100MB వరకు",
  login_ready_upload: "అప్‌లోడ్ కు సిద్ధంగా ఉంది",
  login_remove: "తొలగించు",
  login_enter_as_citizen: "పౌరుడిగా ప్రవేశించండి",
  login_register_as_worker: "కార్మికుడిగా నమోదు చేయండి",
  login_finding_workers: "మీ సమీపంలో కార్మికులను వెతుకుతున్నారు...",
  login_creating_profile: "మీ ప్రొఫైల్ సృష్టిస్తున్నారు...",
  login_citizen_hint:
    "పౌరుడిగా, మీరు మీ ప్రాంతంలో నైపుణ్యమైన కార్మికులను చూడగలరు మరియు నేర్చుకోవడం అభ్యర్థనలు పంపగలరు.",
  login_welcome_citizen: "మీ సమీపంలో కార్మికులను వెతుకుతున్నారు...",
  login_welcome_worker: "మీ ప్రొఫైల్ సజీవంగా ఉంది.",
  login_location_label: "స్థానం",

  profile_back: "ఫీడ్‌కి తిరిగి వెళ్ళండి",
  profile_about: "గురించి",
  profile_trust_score: "నమ్మకం స్కోరు",
  profile_endorsements: "సమర్థనలు",
  profile_km_away: "కి.మీ దూరంలో",
  profile_badge_progress: "నమ్మకం బ్యాడ్జ్ పురోగతి",
  profile_achieved: "సాధించారు ✓",
  profile_endorse: "సమర్థించు",
  profile_endorsing: "సమర్థిస్తున్నారు...",
  profile_endorsed: "సమర్థించారు!",
  profile_request_learn: "నేర్చుకోవడం అభ్యర్థన",
  profile_send_request: "అభ్యర్థన పంపు",
  profile_sending: "పంపుతున్నారు...",
  profile_cancel: "రద్దు చేయి",
  profile_your_name: "మీ పేరు",
  profile_message: "సందేశం",
  profile_learn_placeholder: "నేర్చుకోవడం అభ్యర్థన పంపండి...",
  profile_watch_external: "బాహ్య లింక్‌లో చూడండి →",
  profile_not_found: "ప్రొఫైల్ కనుగొనబడలేదు",
  profile_not_found_desc: "ఈ నిపుణుడు ఉనికిలో ఉండకపోవచ్చు లేదా ఏదో తప్పు జరిగింది.",

  community_back: "ఫీడ్‌కి తిరిగి వెళ్ళండి",
  community_loading: "సభ్యులను లోడ్ చేస్తున్నారు...",
  community_members_suffix: "ఈ సమాజంలో నిపుణులు",
  community_failed: "సమాజాన్ని లోడ్ చేయడం విఫలమైంది",
  community_no_members: "ఇంకా సభ్యులు లేరు",
  community_empty_desc: "ఈ సమాజం తన మొదటి సభ్యులు చేరడానికి వేచి ఉంది.",
  community_browse: "అన్ని నిపుణులను చూడండి",
  community_sorted: "నమ్మకం స్కోరు ద్వారా క్రమబద్ధీకరించబడింది",

  dashboard_title: "కార్మిక డాష్‌బోర్డ్",
  dashboard_your_stats: "మీ గణాంకాలు",
  dashboard_trust_score: "నమ్మకం స్కోరు",
  dashboard_endorsements: "సమర్థనలు",
  dashboard_badge_level: "బ్యాడ్జ్ స్థాయి",
  dashboard_badge_progress: "బ్యాడ్జ్ పురోగతి",
  dashboard_endorsements_count: "సమర్థనలు",
  dashboard_video_title: "మీ వీడియో ప్రొఫైల్",
  dashboard_video_live: "మీ వీడియో ప్రొఫైల్ సజీవంగా ఉంది మరియు పౌరులకు కనిపిస్తుంది",
  dashboard_no_video: "ఇంకా వీడియో అప్‌లోడ్ చేయబడలేదు",
  dashboard_add_video: "మరింత క్లయింట్లను ఆకర్షించడానికి వీడియో ప్రొఫైల్ జోడించండి",
  dashboard_requests_title: "అందుకున్న నేర్చుకోవడం అభ్యర్థనలు",
  dashboard_no_requests: "ఇంకా అభ్యర్థనలు లేవు",
  dashboard_requests_hint:
    "పౌరులు మీ నుండి నేర్చుకోవాలనుకున్నప్పుడు, వారి అభ్యర్థనలు ఇక్కడ కనిపిస్తాయి.",
  dashboard_pending: "పెండింగ్",
  dashboard_about_you: "మీ గురించి",

  requests_title: "నేర్చుకోవడం అభ్యర్థనలు",
  requests_submitted: "అభ్యర్థన(లు) సమర్పించబడ్డాయి",
  requests_failed: "అభ్యర్థనలను లోడ్ చేయడం విఫలమైంది",
  requests_none: "ఇంకా నేర్చుకోవడం అభ్యర్థనలు లేవు",
  requests_none_desc: "ఎవరైనా నిపుణుడి నుండి నేర్చుకోవడానికి అభ్యర్థిస్తే, అది ఇక్కడ కనిపిస్తుంది.",
  requests_browse: "నిపుణులను చూడండి",

  error_profile_not_found: "ప్రొఫైల్ కనుగొనబడలేదు",
  error_load_professionals: "నిపుణులను లోడ్ చేయడం సాధ్యం కాలేదు",
  error_no_professionals: "నిపుణులు కనుగొనబడలేదు",
  error_adjust_filters: "మీ ఫిల్టర్‌లను సర్దుబాటు చేయండి లేదా వేరే నైపుణ్యం కోసం వెతకండి.",
  error_something_wrong: "ఏదో తప్పు జరిగింది. దయచేసి రిఫ్రెష్ చేసి మళ్ళీ ప్రయత్నించండి.",
  error_please_fill: "దయచేసి అన్ని ఫీల్డ్‌లు నింపండి",
  error_please_fill_required: "దయచేసి పేరు, నైపుణ్యం మరియు స్థానం నింపండి",
  error_backend_not_ready: "బ్యాక్‌ఎండ్ ఇంకా సిద్ధంగా లేదు, దయచేసి కొంత సేపు వేచి ఉండండి",
  error_registration_failed: "నమోదు విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  error_endorse_failed: "సమర్థించడం విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  error_request_failed: "అభ్యర్థన పంపడం విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  error_enter_name: "దయచేసి మీ పేరు నమోదు చేయండి.",
  error_enter_message: "దయచేసి సందేశాన్ని నమోదు చేయండి.",
  success_endorsed: "సమర్థన సమర్పించబడింది! 🎉",
  success_request_sent: "నేర్చుకోవడం అభ్యర్థన పంపబడింది! 📚",

  voice_listening: "వింటున్నారు... ఒక నైపుణ్యం పేరు చెప్పండి",
  voice_heard: "విన్నారు",
  voice_failed: "వాయిస్ శోధన విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  voice_chrome_required: "వాయిస్ శోధనకు Chrome లేదా Edge బ్రౌజర్ అవసరం.",

  skill_all: "అన్నీ",
  skill_carpenter: "వడ్రంగి",
  skill_tailor: "దర్జీ",
  skill_plumber: "పైప్‌లైన్ వాడు",
  skill_potter: "కుమ్మరి",
  skill_electrician: "ఎలక్ట్రీషియన్",
  skill_painter: "పెయింటర్",
  skill_mason: "మేస్త్రి",
  skill_welder: "వెల్డర్",
  skill_blacksmith: "కమ్మరి",
  skill_cobbler: "చెప్పుల మేస్త్రి",
  skill_barber: "మంగలి",
  skill_chef: "వంట మేస్త్రి",
  skill_driver: "డ్రైవర్",
  skill_farmer: "రైతు",

  badge_bronze: "కాంస్యం",
  badge_silver: "వెండి",
  badge_gold: "బంగారు",
  badge_member: "సభ్యుడు",
  badge_portfolio: "పోర్ట్‌ఫోలియో",
  community_link_suffix: "సమాజం →",

  profile_share: "ప్రొఫైల్ షేర్ చేయండి",
  profile_share_copied: "ప్రొఫైల్ లింక్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!",
  profile_contact: "సంప్రదించండి",
  notif_title: "నోటిఫికేషన్లు",
  notif_mark_read: "అన్నీ చదివినట్టు గుర్తించండి",
  notif_empty: "ఇంకా నోటిఫికేషన్లు లేవు",
  notif_endorsement: "మీ ప్రొఫైల్‌ని సమర్థించారు",
  notif_learning_request: "నేర్చుకోవడం అభ్యర్థన పంపారు",
  notif_profile_view: "మీ ప్రొఫైల్ చూసారు",
  nearby_workers_label: "సమీప కార్మికులు",
  search_by_name_hint: "పేరు లేదా నైపుణ్యం ద్వారా సమీప కార్మికులను కనుగొనండి",

  cert_section_title: "పీర్ వాలిడేషన్",
  cert_not_tested: "ఇంకా సర్టిఫై కాలేదు",
  cert_not_tested_desc: "మీ బేసిక్ లెవల్ సర్టిఫికెట్ పొందడానికి స్కిల్ టెస్ట్ తీసుకోండి",
  cert_take_test: "సర్టిఫికేషన్ టెస్ట్ తీసుకోండి",
  cert_passed: "సర్టిఫైడ్ – బేసిక్ లెవల్",
  cert_view_cert: "సర్టిఫికెట్ చూడండి",
  cert_failed: "టెస్ట్ పాస్ కాలేదు",
  cert_retry: "టెస్ట్ మళ్ళీ తీసుకోండి",
  cert_test_intro_title: "స్కిల్ సర్టిఫికేషన్ టెస్ట్",
  cert_test_intro_desc:
    "10 ప్రశ్నలు (9 వీడియో MCQ + 1 ప్రాక్టికల్). పాస్ అవ్వడానికి 6/9 సరిగా జవాబు ఇవ్వండి మరియు ప్రాక్టికల్ వీడియో సమర్పించండి.",
  cert_start_test: "టెస్ట్ ప్రారంభించండి",
  cert_question_of: "ప్రశ్న {n} / 10",
  cert_next: "తదుపరి ప్రశ్న",
  cert_submit: "టెస్ట్ సమర్పించండి",
  cert_practical_title: "ప్రాక్టికల్ టాస్క్",
  cert_practical_upload: "మీ టాస్క్ వీడియో అప్‌లోడ్ చేయండి",
  cert_evaluating: "మీ జవాబులు మూల్యాంకనం చేస్తున్నారు...",
  cert_passed_title: "అభినందనలు! మీరు పాస్ అయ్యారు!",
  cert_score_label: "MCQ స్కోర్",
  cert_practical_label: "ప్రాక్టికల్ వీడియో",
  cert_practical_accepted: "ఆమోదించబడింది",
  cert_view_certificate: "మీ సర్టిఫికెట్ చూడండి",
  cert_certificate_title: "అచీవ్‌మెంట్ సర్టిఫికెట్",
  cert_issued_to: "ఇది ధృవీకరిస్తుంది",
  cert_competency: "లో బేసిక్ లెవల్ నైపుణ్యాన్ని నిరూపించారు",
  cert_basic_level: "బేసిక్ లెవల్ సర్టిఫికేషన్",
  cert_download: "సర్టిఫికెట్ డౌన్‌లోడ్ చేయండి",
  cert_no_cert: "సర్టిఫికేషన్ కనుగొనబడలేదు",
  cert_go_dashboard: "డాష్‌బోర్డ్‌కి వెళ్ళండి",
};

const hi: Translations = {
  nav_home: "होम",
  nav_communities: "समुदाय",
  nav_requests: "अनुरोध",
  nav_dashboard: "डैशबोर्ड",
  nav_logout: "लॉग आउट",
  nav_login: "लॉगिन",
  nav_worker: "कारीगर",
  nav_citizen: "नागरिक",
  nav_my_dashboard: "मेरा डैशबोर्ड",
  nav_learning_requests: "सीखने के अनुरोध",
  nav_community_suffix: "समुदाय",

  home_hero_title_1: "कुशल",
  home_hero_title_2: "पेशेवरों को",
  home_hero_title_3: "खोजें",
  home_hero_welcome: "स्वागत है",
  home_hero_showing_near: "के पास कारीगर दिखा रहे हैं",
  home_hero_connect:
    "विश्वसनीय बढ़ई, दर्जी, प्लंबर, कुम्हार और अन्य से जुड़ें — उनके समुदाय द्वारा सत्यापित।",
  stat_professionals: "पेशेवर",
  stat_skill_types: "कौशल प्रकार",
  stat_avg_trust: "औसत विश्वास",
  stat_badged: "बैज प्राप्त",
  filter_sorted_trust: "विश्वास स्कोर द्वारा क्रमबद्ध",
  filter_showing: "दिखा रहे हैं",
  filter_professionals: "पेशेवर",
  filter_in: "में",
  search_placeholder: "कौशल, नाम, या स्थान से खोजें...",
  dist_any: "कोई भी दूरी",
  dist_5km: "5 किमी के भीतर",
  dist_10km: "10 किमी के भीतर",
  dist_20km: "20 किमी के भीतर",

  login_join_community: "समुदाय से जुड़ें",
  login_subtitle: "नागरिक के रूप में जुड़ें या अपने व्यावसायिक कौशल दर्ज करें",
  login_im_citizen: "मैं नागरिक हूं",
  login_im_worker: "मैं कारीगर हूं",
  login_your_name: "आपका नाम",
  login_your_skill: "आपका कौशल",
  login_your_location: "आपका स्थान",
  login_bio: "परिचय",
  login_video_profile: "वीडियो प्रोफ़ाइल",
  login_optional: "वैकल्पिक",
  login_enter_name: "अपना पूरा नाम दर्ज करें",
  login_enter_city: "अपना शहर या क्षेत्र दर्ज करें",
  login_select_skill: "अपना प्राथमिक कौशल चुनें",
  login_bio_placeholder: "अपने अनुभव और विशेषज्ञता के बारे में बताएं...",
  login_upload_video: "अपना कौशल वीडियो अपलोड करने के लिए क्लिक करें",
  login_video_formats: "MP4, MOV, AVI 100MB तक",
  login_ready_upload: "अपलोड के लिए तैयार",
  login_remove: "हटाएं",
  login_enter_as_citizen: "नागरिक के रूप में प्रवेश करें",
  login_register_as_worker: "कारीगर के रूप में पंजीकरण करें",
  login_finding_workers: "आपके पास कारीगर खोज रहे हैं...",
  login_creating_profile: "आपकी प्रोफ़ाइल बना रहे हैं...",
  login_citizen_hint:
    "नागरिक के रूप में, आप अपने क्षेत्र में कुशल कारीगरों को देख सकते हैं और सीखने के अनुरोध भेज सकते हैं।",
  login_welcome_citizen: "आपके पास कारीगर खोज रहे हैं...",
  login_welcome_worker: "आपकी प्रोफ़ाइल लाइव है।",
  login_location_label: "स्थान",

  profile_back: "फीड पर वापस",
  profile_about: "के बारे में",
  profile_trust_score: "विश्वास स्कोर",
  profile_endorsements: "समर्थन",
  profile_km_away: "किमी दूर",
  profile_badge_progress: "विश्वास बैज प्रगति",
  profile_achieved: "प्राप्त ✓",
  profile_endorse: "समर्थन करें",
  profile_endorsing: "समर्थन कर रहे हैं...",
  profile_endorsed: "समर्थित!",
  profile_request_learn: "सीखने का अनुरोध",
  profile_send_request: "अनुरोध भेजें",
  profile_sending: "भेज रहे हैं...",
  profile_cancel: "रद्द करें",
  profile_your_name: "आपका नाम",
  profile_message: "संदेश",
  profile_learn_placeholder: "सीखने का अनुरोध भेजें...",
  profile_watch_external: "बाहरी लिंक पर देखें →",
  profile_not_found: "प्रोफ़ाइल नहीं मिली",
  profile_not_found_desc: "यह पेशेवर मौजूद नहीं हो सकता या कुछ गलत हो गया।",

  community_back: "फीड पर वापस",
  community_loading: "सदस्य लोड हो रहे हैं...",
  community_members_suffix: "इस समुदाय में पेशेवर",
  community_failed: "समुदाय लोड करने में विफल",
  community_no_members: "अभी तक कोई सदस्य नहीं",
  community_empty_desc: "यह समुदाय अपने पहले सदस्यों के आने का इंतजार कर रहा है।",
  community_browse: "सभी पेशेवरों को देखें",
  community_sorted: "विश्वास स्कोर द्वारा क्रमबद्ध",

  dashboard_title: "कारीगर डैशबोर्ड",
  dashboard_your_stats: "आपके आंकड़े",
  dashboard_trust_score: "विश्वास स्कोर",
  dashboard_endorsements: "समर्थन",
  dashboard_badge_level: "बैज स्तर",
  dashboard_badge_progress: "बैज प्रगति",
  dashboard_endorsements_count: "समर्थन",
  dashboard_video_title: "आपकी वीडियो प्रोफ़ाइल",
  dashboard_video_live:
    "आपकी वीडियो प्रोफ़ाइल लाइव है और नागरिकों को दिखाई दे रही है",
  dashboard_no_video: "अभी तक कोई वीडियो अपलोड नहीं",
  dashboard_add_video: "अधिक ग्राहकों को आकर्षित करने के लिए वीडियो प्रोफ़ाइल जोड़ें",
  dashboard_requests_title: "प्राप्त सीखने के अनुरोध",
  dashboard_no_requests: "अभी तक कोई अनुरोध नहीं",
  dashboard_requests_hint:
    "जब नागरिक आपसे सीखना चाहते हैं, तो उनके अनुरोध यहां दिखाई देंगे।",
  dashboard_pending: "लंबित",
  dashboard_about_you: "आपके बारे में",

  requests_title: "सीखने के अनुरोध",
  requests_submitted: "अनुरोध(कें) सबमिट किए गए",
  requests_failed: "अनुरोध लोड करने में विफल",
  requests_none: "अभी तक कोई सीखने का अनुरोध नहीं",
  requests_none_desc:
    "जब कोई किसी पेशेवर से सीखने का अनुरोध करेगा, तो वह यहां दिखाई देगा।",
  requests_browse: "पेशेवरों को देखें",

  error_profile_not_found: "प्रोफ़ाइल नहीं मिली",
  error_load_professionals: "पेशेवरों को लोड करने में असमर्थ",
  error_no_professionals: "कोई पेशेवर नहीं मिला",
  error_adjust_filters: "अपने फ़िल्टर समायोजित करें या किसी अन्य कौशल की खोज करें।",
  error_something_wrong: "कुछ गलत हो गया। कृपया रिफ्रेश करें और पुनः प्रयास करें।",
  error_please_fill: "कृपया सभी फ़ील्ड भरें",
  error_please_fill_required: "कृपया नाम, कौशल और स्थान भरें",
  error_backend_not_ready: "बैकएंड अभी तैयार नहीं है, कृपया थोड़ा प्रतीक्षा करें",
  error_registration_failed: "पंजीकरण विफल। कृपया पुनः प्रयास करें।",
  error_endorse_failed: "समर्थन करने में विफल। कृपया पुनः प्रयास करें।",
  error_request_failed: "अनुरोध भेजने में विफल। कृपया पुनः प्रयास करें।",
  error_enter_name: "कृपया अपना नाम दर्ज करें।",
  error_enter_message: "कृपया एक संदेश दर्ज करें।",
  success_endorsed: "समर्थन सबमिट किया गया! 🎉",
  success_request_sent: "सीखने का अनुरोध भेजा गया! 📚",

  voice_listening: "सुन रहे हैं... एक कौशल नाम बोलें",
  voice_heard: "सुना",
  voice_failed: "वॉयस खोज विफल। कृपया पुनः प्रयास करें।",
  voice_chrome_required: "वॉयस खोज के लिए Chrome या Edge ब्राउज़र आवश्यक है।",

  skill_all: "सभी",
  skill_carpenter: "बढ़ई",
  skill_tailor: "दर्जी",
  skill_plumber: "प्लंबर",
  skill_potter: "कुम्हार",
  skill_electrician: "इलेक्ट्रीशियन",
  skill_painter: "पेंटर",
  skill_mason: "मिस्त्री",
  skill_welder: "वेल्डर",
  skill_blacksmith: "लोहार",
  skill_cobbler: "मोची",
  skill_barber: "नाई",
  skill_chef: "रसोइया",
  skill_driver: "चालक",
  skill_farmer: "किसान",

  badge_bronze: "कांस्य",
  badge_silver: "चांदी",
  badge_gold: "सोना",
  badge_member: "सदस्य",
  badge_portfolio: "पोर्टफोलियो",
  community_link_suffix: "समुदाय →",

  profile_share: "प्रोफ़ाइल शेयर करें",
  profile_share_copied: "प्रोफ़ाइल लिंक क्लिपबोर्ड पर कॉपी हो गया!",
  profile_contact: "संपर्क",
  notif_title: "सूचनाएं",
  notif_mark_read: "सभी पढ़ी हुई मार्क करें",
  notif_empty: "अभी तक कोई सूचना नहीं",
  notif_endorsement: "ने आपकी प्रोफ़ाइल को समर्थन दिया",
  notif_learning_request: "ने सीखने का अनुरोध भेजा",
  notif_profile_view: "ने आपकी प्रोफ़ाइल देखी",
  nearby_workers_label: "पास के कारीगर",
  search_by_name_hint: "नाम या कौशल से पास के कारीगर खोजें",

  cert_section_title: "पीयर वैलिडेशन",
  cert_not_tested: "अभी तक प्रमाणित नहीं",
  cert_not_tested_desc: "अपना बेसिक लेवल सर्टिफिकेट पाने के लिए कौशल परीक्षा दें",
  cert_take_test: "सर्टिफिकेशन परीक्षा दें",
  cert_passed: "प्रमाणित – बेसिक लेवल",
  cert_view_cert: "सर्टिफिकेट देखें",
  cert_failed: "परीक्षा पास नहीं हुई",
  cert_retry: "परीक्षा फिर से दें",
  cert_test_intro_title: "कौशल प्रमाणीकरण परीक्षा",
  cert_test_intro_desc:
    "10 प्रश्न (9 वीडियो MCQ + 1 प्रायोगिक)। पास होने के लिए 6/9 सही उत्तर दें और प्रायोगिक वीडियो सबमिट करें।",
  cert_start_test: "परीक्षा शुरू करें",
  cert_question_of: "प्रश्न {n} / 10",
  cert_next: "अगला प्रश्न",
  cert_submit: "परीक्षा सबमिट करें",
  cert_practical_title: "प्रायोगिक कार्य",
  cert_practical_upload: "अपना टास्क वीडियो अपलोड करें",
  cert_evaluating: "आपके उत्तर मूल्यांकन हो रहे हैं...",
  cert_passed_title: "बधाई हो! आप पास हो गए!",
  cert_score_label: "MCQ स्कोर",
  cert_practical_label: "प्रायोगिक वीडियो",
  cert_practical_accepted: "स्वीकृत",
  cert_view_certificate: "अपना सर्टिफिकेट देखें",
  cert_certificate_title: "उपलब्धि प्रमाण पत्र",
  cert_issued_to: "यह प्रमाणित किया जाता है कि",
  cert_competency: "में बेसिक लेवल योग्यता प्रदर्शित की है",
  cert_basic_level: "बेसिक लेवल सर्टिफिकेशन",
  cert_download: "सर्टिफिकेट डाउनलोड करें",
  cert_no_cert: "कोई सर्टिफिकेशन नहीं मिली",
  cert_go_dashboard: "डैशबोर्ड पर जाएं",
};

const ml: Translations = {
  nav_home: "ഹോം",
  nav_communities: "കമ്മ്യൂണിറ്റികൾ",
  nav_requests: "അഭ്യർത്ഥനകൾ",
  nav_dashboard: "ഡാഷ്‌ബോർഡ്",
  nav_logout: "ലോഗ് ഔട്ട്",
  nav_login: "ലോഗിൻ",
  nav_worker: "തൊഴിലാളി",
  nav_citizen: "പൗരൻ",
  nav_my_dashboard: "എന്റെ ഡാഷ്‌ബോർഡ്",
  nav_learning_requests: "പഠന അഭ്യർത്ഥനകൾ",
  nav_community_suffix: "കമ്മ്യൂണിറ്റി",

  home_hero_title_1: "കഴിവുള്ള",
  home_hero_title_2: "പ്രൊഫഷനലുകളെ",
  home_hero_title_3: "കണ്ടെത്തൂ",
  home_hero_welcome: "സ്വാഗതം",
  home_hero_showing_near: "സമീപത്ത് തൊഴിലാളികളെ കാണിക്കുന്നു",
  home_hero_connect:
    "വിശ്വസ്ത ആശാരികൾ, തയ്യൽക്കാർ, പ്ലംബർമാർ, കുശിനിക്കാർ എന്നിവരുമായി ബന്ധപ്പെടൂ.",
  stat_professionals: "പ്രൊഫഷനലുകൾ",
  stat_skill_types: "കഴിവ് തരങ്ങൾ",
  stat_avg_trust: "ശരാശരി വിശ്വാസം",
  stat_badged: "ബാഡ്ജ് ലഭിച്ചവർ",
  filter_sorted_trust: "വിശ്വാസ സ്കോർ അനുസരിച്ച് ക്രമീകരിച്ചു",
  filter_showing: "കാണിക്കുന്നു",
  filter_professionals: "പ്രൊഫഷനൽ",
  filter_in: "ൽ",
  search_placeholder: "കഴിവ്, പേര്, അല്ലെങ്കിൽ സ്ഥലം തിരയൂ...",
  dist_any: "ഏത് ദൂരവും",
  dist_5km: "5 കി.മീ ഉള്ളിൽ",
  dist_10km: "10 കി.മീ ഉള്ളിൽ",
  dist_20km: "20 കി.മീ ഉള്ളിൽ",

  login_join_community: "കമ്മ്യൂണിറ്റിയിൽ ചേരൂ",
  login_subtitle: "പൗരനായി ബന്ധപ്പെടൂ അല്ലെങ്കിൽ നിങ്ങളുടെ തൊഴിൽ കഴിവുകൾ രജിസ്റ്റർ ചെയ്യൂ",
  login_im_citizen: "ഞാൻ ഒരു പൗരനാണ്",
  login_im_worker: "ഞാൻ ഒരു തൊഴിലാളിയാണ്",
  login_your_name: "നിങ്ങളുടെ പേര്",
  login_your_skill: "നിങ്ങളുടെ കഴിവ്",
  login_your_location: "നിങ്ങളുടെ സ്ഥലം",
  login_bio: "പരിചയം",
  login_video_profile: "വീഡിയോ പ്രൊഫൈൽ",
  login_optional: "ഐച്ഛിക",
  login_enter_name: "നിങ്ങളുടെ പൂർണ്ണ പേര് നൽകൂ",
  login_enter_city: "നിങ്ങളുടെ നഗരം അല്ലെങ്കിൽ പ്രദേശം നൽകൂ",
  login_select_skill: "നിങ്ങളുടെ പ്രാഥമിക കഴിവ് തിരഞ്ഞെടുക്കൂ",
  login_bio_placeholder: "നിങ്ങളുടെ അനുഭവത്തെക്കുറിച്ചും വൈദഗ്ധ്യത്തെക്കുറിച്ചും പറയൂ...",
  login_upload_video: "നിങ്ങളുടെ കഴിവ് വീഡിയോ അപ്‌ലോഡ് ചെയ്യാൻ ക്ലിക്ക് ചെയ്യൂ",
  login_video_formats: "MP4, MOV, AVI 100MB വരെ",
  login_ready_upload: "അപ്‌ലോഡ് ചെയ്യാൻ തയ്യാർ",
  login_remove: "നീക്കം ചെയ്യൂ",
  login_enter_as_citizen: "പൗരനായി പ്രവേശിക്കൂ",
  login_register_as_worker: "തൊഴിലാളിയായി രജിസ്റ്റർ ചെയ്യൂ",
  login_finding_workers: "നിങ്ങളുടെ സമീപത്ത് തൊഴിലാളികളെ തിരയുന്നു...",
  login_creating_profile: "നിങ്ങളുടെ പ്രൊഫൈൽ സൃഷ്ടിക്കുന്നു...",
  login_citizen_hint:
    "ഒരു പൗരനെന്ന നിലയിൽ, നിങ്ങൾ നിങ്ങളുടെ പ്രദേശത്ത് കഴിവുള്ള തൊഴിലാളികളെ കാണാനും പഠന അഭ്യർത്ഥനകൾ അയക്കാനും കഴിയും.",
  login_welcome_citizen: "നിങ്ങളുടെ സമീപത്ത് തൊഴിലാളികളെ തിരയുന്നു...",
  login_welcome_worker: "നിങ്ങളുടെ പ്രൊഫൈൽ ലൈവ് ആണ്.",
  login_location_label: "സ്ഥലം",

  profile_back: "ഫീഡിലേക്ക് തിരിച്ച് പോകൂ",
  profile_about: "കുറിച്ച്",
  profile_trust_score: "വിശ്വാസ സ്കോർ",
  profile_endorsements: "അംഗീകാരങ്ങൾ",
  profile_km_away: "കി.മീ അകലെ",
  profile_badge_progress: "വിശ്വാസ ബാഡ്ജ് പുരോഗതി",
  profile_achieved: "നേടിയിരിക്കുന്നു ✓",
  profile_endorse: "അംഗീകരിക്കൂ",
  profile_endorsing: "അംഗീകരിക്കുന്നു...",
  profile_endorsed: "അംഗീകരിച്ചു!",
  profile_request_learn: "പഠന അഭ്യർത്ഥന",
  profile_send_request: "അഭ്യർത്ഥന അയക്കൂ",
  profile_sending: "അയക്കുന്നു...",
  profile_cancel: "റദ്ദ് ചെയ്യൂ",
  profile_your_name: "നിങ്ങളുടെ പേര്",
  profile_message: "സന്ദേശം",
  profile_learn_placeholder: "ഒരു പഠന അഭ്യർത്ഥന അയക്കൂ...",
  profile_watch_external: "ബാഹ്യ ലിങ്കിൽ കാണൂ →",
  profile_not_found: "പ്രൊഫൈൽ കണ്ടെത്തിയില്ല",
  profile_not_found_desc: "ഈ പ്രൊഫഷണൽ ഇല്ലായിരിക്കാം അല്ലെങ്കിൽ എന്തോ തകരാർ സംഭവിച്ചു.",

  community_back: "ഫീഡിലേക്ക് തിരിച്ച് പോകൂ",
  community_loading: "അംഗങ്ങളെ ലോഡ് ചെയ്യുന്നു...",
  community_members_suffix: "ഈ കമ്മ്യൂണിറ്റിയിൽ പ്രൊഫഷനലുകൾ",
  community_failed: "കമ്മ്യൂണിറ്റി ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
  community_no_members: "ഇതുവരെ അംഗങ്ങൾ ഇല്ല",
  community_empty_desc: "ഈ കമ്മ്യൂണിറ്റി അതിന്റെ ആദ്യ അംഗങ്ങൾ ചേരാൻ കാത്തിരിക്കുന്നു.",
  community_browse: "എല്ലാ പ്രൊഫഷനലുകളെയും ബ്രൗസ് ചെയ്യൂ",
  community_sorted: "വിശ്വാസ സ്കോർ അനുസരിച്ച് ക്രമീകരിച്ചു",

  dashboard_title: "തൊഴിലാളി ഡാഷ്‌ബോർഡ്",
  dashboard_your_stats: "നിങ്ങളുടെ സ്ഥിതിവിവരക്കണക്കുകൾ",
  dashboard_trust_score: "വിശ്വാസ സ്കോർ",
  dashboard_endorsements: "അംഗീകാരങ്ങൾ",
  dashboard_badge_level: "ബാഡ്ജ് തലം",
  dashboard_badge_progress: "ബാഡ്ജ് പുരോഗതി",
  dashboard_endorsements_count: "അംഗീകാരങ്ങൾ",
  dashboard_video_title: "നിങ്ങളുടെ വീഡിയോ പ്രൊഫൈൽ",
  dashboard_video_live: "നിങ്ങളുടെ വീഡിയോ പ്രൊഫൈൽ ലൈവ് ആണ് മേലും പൗരന്മാർക്ക് ദൃശ്യമാണ്",
  dashboard_no_video: "ഇതുവരെ വീഡിയോ അപ്‌ലോഡ് ചെയ്തിട്ടില്ല",
  dashboard_add_video: "കൂടുതൽ ക്ലയന്റുകളെ ആകർഷിക്കാൻ ഒരു വീഡിയോ പ്രൊഫൈൽ ചേർക്കൂ",
  dashboard_requests_title: "ലഭിച്ച പഠന അഭ്യർത്ഥനകൾ",
  dashboard_no_requests: "ഇതുവരെ അഭ്യർത്ഥനകൾ ഇല്ല",
  dashboard_requests_hint:
    "പൗരന്മാർ നിങ്ങളിൽ നിന്ന് പഠിക്കാൻ ആഗ്രഹിക്കുമ്പോൾ, അവരുടെ അഭ്യർത്ഥനകൾ ഇവിടെ ദൃശ്യമാകും.",
  dashboard_pending: "തീർപ്പ് കല്പിക്കാത്ത",
  dashboard_about_you: "നിങ്ങളെക്കുറിച്ച്",

  requests_title: "പഠന അഭ്യർത്ഥനകൾ",
  requests_submitted: "അഭ്യർത്ഥന(കൾ) സമർപ്പിച്ചു",
  requests_failed: "അഭ്യർത്ഥനകൾ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു",
  requests_none: "ഇതുവരെ പഠന അഭ്യർത്ഥനകൾ ഇല്ല",
  requests_none_desc:
    "ആരെങ്കിലും ഒരു പ്രൊഫഷണലിൽ നിന്ന് പഠിക്കാൻ അഭ്യർത്ഥിക്കുമ്പോൾ, അത് ഇവിടെ ദൃശ്യമാകും.",
  requests_browse: "പ്രൊഫഷനലുകളെ ബ്രൗസ് ചെയ്യൂ",

  error_profile_not_found: "പ്രൊഫൈൽ കണ്ടെത്തിയില്ല",
  error_load_professionals: "പ്രൊഫഷനലുകളെ ലോഡ് ചെയ്യാൻ കഴിയുന്നില്ല",
  error_no_professionals: "പ്രൊഫഷനലുകൾ കണ്ടെത്തിയില്ല",
  error_adjust_filters: "നിങ്ങളുടെ ഫിൽട്ടറുകൾ ക്രമീകരിക്കൂ അല്ലെങ്കിൽ മറ്റൊരു കഴിവ് തിരയൂ.",
  error_something_wrong: "എന്തോ തകരാർ സംഭവിച്ചു. ദയവായി റിഫ്രഷ് ചെയ്ത് വീണ്ടും ശ്രമിക്കൂ.",
  error_please_fill: "ദയവായി എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കൂ",
  error_please_fill_required: "ദയവായി പേര്, കഴിവ്, സ്ഥലം എന്നിവ പൂരിപ്പിക്കൂ",
  error_backend_not_ready: "ബാക്കൻഡ് ഇതുവരെ തയ്യാറായിട്ടില്ല, ദയവായി ഒരു നിമിഷം കാത്തിരിക്കൂ",
  error_registration_failed: "രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കൂ.",
  error_endorse_failed: "അംഗീകരിക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കൂ.",
  error_request_failed: "അഭ്യർത്ഥന അയക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കൂ.",
  error_enter_name: "ദയവായി നിങ്ങളുടെ പേര് നൽകൂ.",
  error_enter_message: "ദയവായി ഒരു സന്ദേശം നൽകൂ.",
  success_endorsed: "അംഗീകാരം സമർപ്പിച്ചു! 🎉",
  success_request_sent: "പഠന അഭ്യർത്ഥന അയച്ചു! 📚",

  voice_listening: "ശ്രദ്ധിക്കുന്നു... ഒരു കഴിവ് പേര് പറയൂ",
  voice_heard: "കേട്ടു",
  voice_failed: "വോയ്‌സ് സെർച്ച് പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കൂ.",
  voice_chrome_required: "വോയ്‌സ് സെർച്ചിന് Chrome അല്ലെങ്കിൽ Edge ബ്രൗസർ ആവശ്യമാണ്.",

  skill_all: "എല്ലാം",
  skill_carpenter: "ആശാരി",
  skill_tailor: "തയ്യൽക്കാരൻ",
  skill_plumber: "പ്ലംബർ",
  skill_potter: "കുശിനിക്കാരൻ",
  skill_electrician: "ഇലക്ട്രീഷ്യൻ",
  skill_painter: "ചിത്രകാരൻ",
  skill_mason: "കൽപ്പണിക്കാരൻ",
  skill_welder: "വെൽഡർ",
  skill_blacksmith: "കൊല്ലൻ",
  skill_cobbler: "ചെരുപ്പ് നിർമ്മാതാവ്",
  skill_barber: "ക്ഷുരകൻ",
  skill_chef: "പാചകക്കാരൻ",
  skill_driver: "ഡ്രൈവർ",
  skill_farmer: "കർഷകൻ",

  badge_bronze: "വെങ്കലം",
  badge_silver: "വെള്ളി",
  badge_gold: "സ്വർണ്ണം",
  badge_member: "അംഗം",
  badge_portfolio: "പോർട്ട്ഫോളിയോ",
  community_link_suffix: "കമ്മ്യൂണിറ്റി →",

  profile_share: "പ്രൊഫൈൽ ഷെയർ ചെയ്യൂ",
  profile_share_copied: "പ്രൊഫൈൽ ലിങ്ക് ക്ലിപ്‌ബോർഡിലേക്ക് കോപ്പി ചെയ്തു!",
  profile_contact: "ബന്ധപ്പെടൂ",
  notif_title: "അറിയിപ്പുകൾ",
  notif_mark_read: "എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തൂ",
  notif_empty: "ഇതുവരെ അറിയിപ്പുകൾ ഇല്ല",
  notif_endorsement: "നിങ്ങളുടെ പ്രൊഫൈൽ അംഗീകരിച്ചു",
  notif_learning_request: "ഒരു പഠന അഭ്യർത്ഥന അയച്ചു",
  notif_profile_view: "നിങ്ങളുടെ പ്രൊഫൈൽ കണ്ടു",
  nearby_workers_label: "സമീപ തൊഴിലാളികൾ",
  search_by_name_hint: "പേര് അല്ലെങ്കിൽ കഴിവ് വഴി സമീപ തൊഴിലാളികളെ കണ്ടെത്തൂ",

  cert_section_title: "പീർ വാലിഡേഷൻ",
  cert_not_tested: "ഇതുവരെ സർട്ടിഫൈ ചെയ്തിട്ടില്ല",
  cert_not_tested_desc: "ബേസിക് ലെവൽ സർട്ടിഫിക്കറ്റ് നേടാൻ സ്കിൽ ടെസ്റ്റ് എടുക്കൂ",
  cert_take_test: "സർട്ടിഫിക്കേഷൻ ടെസ്റ്റ് എടുക്കൂ",
  cert_passed: "സർട്ടിഫൈഡ് – ബേസിക് ലെവൽ",
  cert_view_cert: "സർട്ടിഫിക്കറ്റ് കാണൂ",
  cert_failed: "ടെസ്റ്റ് പാസ് ആയില്ല",
  cert_retry: "ടെസ്റ്റ് വീണ്ടും എടുക്കൂ",
  cert_test_intro_title: "സ്കിൽ സർട്ടിഫിക്കേഷൻ ടെസ്റ്റ്",
  cert_test_intro_desc:
    "10 ചോദ്യങ്ങൾ (9 വീഡിയോ MCQ + 1 പ്രാക്ടിക്കൽ). പാസ് ആകാൻ 6/9 ശരിയായ ഉത്തരം നൽകി പ്രാക്ടിക്കൽ വീഡിയോ സമർപ്പിക്കൂ.",
  cert_start_test: "ടെസ്റ്റ് ആരംഭിക്കൂ",
  cert_question_of: "ചോദ്യം {n} / 10",
  cert_next: "അടുത്ത ചോദ്യം",
  cert_submit: "ടെസ്റ്റ് സമർപ്പിക്കൂ",
  cert_practical_title: "പ്രാക്ടിക്കൽ ടാസ്ക്",
  cert_practical_upload: "നിങ്ങളുടെ ടാസ്ക് വീഡിയോ അപ്‌ലോഡ് ചെയ്യൂ",
  cert_evaluating: "നിങ്ങളുടെ ഉത്തരങ്ങൾ മൂല്യനിർണ്ണയം ചെയ്യുന്നു...",
  cert_passed_title: "അഭിനന്ദനങ്ങൾ! നിങ്ങൾ പാസ് ആയി!",
  cert_score_label: "MCQ സ്കോർ",
  cert_practical_label: "പ്രാക്ടിക്കൽ വീഡിയോ",
  cert_practical_accepted: "അംഗീകരിച്ചു",
  cert_view_certificate: "നിങ്ങളുടെ സർട്ടിഫിക്കറ്റ് കാണൂ",
  cert_certificate_title: "നേട്ടത്തിന്റെ സർട്ടിഫിക്കറ്റ്",
  cert_issued_to: "ഇത് സാക്ഷ്യപ്പെടുത്തുന്നു",
  cert_competency: "ൽ ബേസിക് ലെവൽ കഴിവ് തെളിയിച്ചിട്ടുണ്ട്",
  cert_basic_level: "ബേസിക് ലെവൽ സർട്ടിഫിക്കേഷൻ",
  cert_download: "സർട്ടിഫിക്കറ്റ് ഡൗൺലോഡ് ചെയ്യൂ",
  cert_no_cert: "സർട്ടിഫിക്കേഷൻ കണ്ടെത്തിയില്ല",
  cert_go_dashboard: "ഡാഷ്‌ബോർഡിലേക്ക് പോകൂ",
};

const kn: Translations = {
  nav_home: "ಹೋಮ್",
  nav_communities: "ಸಮುದಾಯಗಳು",
  nav_requests: "ವಿನಂತಿಗಳು",
  nav_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  nav_logout: "ಲಾಗ್ ಔಟ್",
  nav_login: "ಲಾಗಿನ್",
  nav_worker: "ಕಾರ್ಮಿಕ",
  nav_citizen: "ನಾಗರಿಕ",
  nav_my_dashboard: "ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  nav_learning_requests: "ಕಲಿಕೆ ವಿನಂತಿಗಳು",
  nav_community_suffix: "ಸಮುದಾಯ",

  home_hero_title_1: "ಕೌಶಲ್ಯವುಳ್ಳ",
  home_hero_title_2: "ವೃತ್ತಿಪರರನ್ನು",
  home_hero_title_3: "ಕಂಡುಹಿಡಿಯಿರಿ",
  home_hero_welcome: "ಸ್ವಾಗತ",
  home_hero_showing_near: "ಸಮೀಪದಲ್ಲಿ ಕಾರ್ಮಿಕರನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ",
  home_hero_connect:
    "ವಿಶ್ವಾಸಾರ್ಹ ಬಡಗಿಗಳು, ಟೈಲರ್‌ಗಳು, ಪ್ಲಂಬರ್‌ಗಳು, ಕುಂಬಾರರು ಮತ್ತು ಇತರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ.",
  stat_professionals: "ವೃತ್ತಿಪರರು",
  stat_skill_types: "ಕೌಶಲ್ಯ ವಿಧಗಳು",
  stat_avg_trust: "ಸರಾಸರಿ ವಿಶ್ವಾಸ",
  stat_badged: "ಬ್ಯಾಡ್ಜ್ ಪಡೆದವರು",
  filter_sorted_trust: "ವಿಶ್ವಾಸ ಸ್ಕೋರ್ ಪ್ರಕಾರ ವಿಂಗಡಿಸಲಾಗಿದೆ",
  filter_showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
  filter_professionals: "ವೃತ್ತಿಪರ",
  filter_in: "ನಲ್ಲಿ",
  search_placeholder: "ಕೌಶಲ್ಯ, ಹೆಸರು, ಅಥವಾ ಸ್ಥಳದ ಮೂಲಕ ಹುಡುಕಿ...",
  dist_any: "ಯಾವುದೇ ದೂರ",
  dist_5km: "5 ಕಿ.ಮೀ ಒಳಗೆ",
  dist_10km: "10 ಕಿ.ಮೀ ಒಳಗೆ",
  dist_20km: "20 ಕಿ.ಮೀ ಒಳಗೆ",

  login_join_community: "ಸಮುದಾಯಕ್ಕೆ ಸೇರಿ",
  login_subtitle: "ನಾಗರಿಕರಾಗಿ ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ನಿಮ್ಮ ವೃತ್ತಿ ಕೌಶಲ್ಯಗಳನ್ನು ನೋಂದಾಯಿಸಿ",
  login_im_citizen: "ನಾನು ನಾಗರಿಕ",
  login_im_worker: "ನಾನು ಕಾರ್ಮಿಕ",
  login_your_name: "ನಿಮ್ಮ ಹೆಸರು",
  login_your_skill: "ನಿಮ್ಮ ಕೌಶಲ್ಯ",
  login_your_location: "ನಿಮ್ಮ ಸ್ಥಳ",
  login_bio: "ಪರಿಚಯ",
  login_video_profile: "ವೀಡಿಯೊ ಪ್ರೊಫೈಲ್",
  login_optional: "ಐಚ್ಛಿಕ",
  login_enter_name: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ",
  login_enter_city: "ನಿಮ್ಮ ನಗರ ಅಥವಾ ಪ್ರದೇಶ ನಮೂದಿಸಿ",
  login_select_skill: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಕೌಶಲ್ಯ ಆಯ್ಕೆ ಮಾಡಿ",
  login_bio_placeholder: "ನಿಮ್ಮ ಅನುಭವ ಮತ್ತು ಪರಿಣತಿ ಬಗ್ಗೆ ಹೇಳಿ...",
  login_upload_video: "ನಿಮ್ಮ ಕೌಶಲ್ಯ ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  login_video_formats: "MP4, MOV, AVI 100MB ವರೆಗೆ",
  login_ready_upload: "ಅಪ್‌ಲೋಡ್‌ಗೆ ಸಿದ್ಧ",
  login_remove: "ತೆಗೆದುಹಾಕಿ",
  login_enter_as_citizen: "ನಾಗರಿಕರಾಗಿ ಪ್ರವೇಶಿಸಿ",
  login_register_as_worker: "ಕಾರ್ಮಿಕರಾಗಿ ನೋಂದಾಯಿಸಿ",
  login_finding_workers: "ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
  login_creating_profile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
  login_citizen_hint:
    "ನಾಗರಿಕರಾಗಿ, ನೀವು ನಿಮ್ಮ ಪ್ರದೇಶದ ಕುಶಲ ಕಾರ್ಮಿಕರನ್ನು ನೋಡಬಹುದು ಮತ್ತು ಕಲಿಕೆ ವಿನಂತಿಗಳನ್ನು ಕಳುಹಿಸಬಹುದು.",
  login_welcome_citizen: "ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
  login_welcome_worker: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಲೈವ್ ಆಗಿದೆ.",
  login_location_label: "ಸ್ಥಳ",

  profile_back: "ಫೀಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  profile_about: "ಬಗ್ಗೆ",
  profile_trust_score: "ವಿಶ್ವಾಸ ಸ್ಕೋರ್",
  profile_endorsements: "ಬೆಂಬಲಗಳು",
  profile_km_away: "ಕಿ.ಮೀ ದೂರ",
  profile_badge_progress: "ವಿಶ್ವಾಸ ಬ್ಯಾಡ್ಜ್ ಪ್ರಗತಿ",
  profile_achieved: "ಸಾಧಿಸಲಾಗಿದೆ ✓",
  profile_endorse: "ಬೆಂಬಲಿಸಿ",
  profile_endorsing: "ಬೆಂಬಲಿಸಲಾಗುತ್ತಿದೆ...",
  profile_endorsed: "ಬೆಂಬಲಿಸಲಾಗಿದೆ!",
  profile_request_learn: "ಕಲಿಕೆ ವಿನಂತಿ",
  profile_send_request: "ವಿನಂತಿ ಕಳುಹಿಸಿ",
  profile_sending: "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
  profile_cancel: "ರದ್ದು ಮಾಡಿ",
  profile_your_name: "ನಿಮ್ಮ ಹೆಸರು",
  profile_message: "ಸಂದೇಶ",
  profile_learn_placeholder: "ಕಲಿಕೆ ವಿನಂತಿ ಕಳುಹಿಸಿ...",
  profile_watch_external: "ಬಾಹ್ಯ ಲಿಂಕ್‌ನಲ್ಲಿ ನೋಡಿ →",
  profile_not_found: "ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ",
  profile_not_found_desc: "ಈ ವೃತ್ತಿಪರ ಇಲ್ಲದಿರಬಹುದು ಅಥವಾ ಏನೋ ತಪ್ಪಾಗಿದೆ.",

  community_back: "ಫೀಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  community_loading: "ಸದಸ್ಯರನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  community_members_suffix: "ಈ ಸಮುದಾಯದಲ್ಲಿ ವೃತ್ತಿಪರರು",
  community_failed: "ಸಮುದಾಯ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
  community_no_members: "ಇನ್ನೂ ಸದಸ್ಯರಿಲ್ಲ",
  community_empty_desc: "ಈ ಸಮುದಾಯ ತನ್ನ ಮೊದಲ ಸದಸ್ಯರು ಸೇರಲು ಕಾಯುತ್ತಿದೆ.",
  community_browse: "ಎಲ್ಲ ವೃತ್ತಿಪರರನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
  community_sorted: "ವಿಶ್ವಾಸ ಸ್ಕೋರ್ ಪ್ರಕಾರ ವಿಂಗಡಿಸಲಾಗಿದೆ",

  dashboard_title: "ಕಾರ್ಮಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  dashboard_your_stats: "ನಿಮ್ಮ ಅಂಕಿಅಂಶಗಳು",
  dashboard_trust_score: "ವಿಶ್ವಾಸ ಸ್ಕೋರ್",
  dashboard_endorsements: "ಬೆಂಬಲಗಳು",
  dashboard_badge_level: "ಬ್ಯಾಡ್ಜ್ ಹಂತ",
  dashboard_badge_progress: "ಬ್ಯಾಡ್ಜ್ ಪ್ರಗತಿ",
  dashboard_endorsements_count: "ಬೆಂಬಲಗಳು",
  dashboard_video_title: "ನಿಮ್ಮ ವೀಡಿಯೊ ಪ್ರೊಫೈಲ್",
  dashboard_video_live: "ನಿಮ್ಮ ವೀಡಿಯೊ ಪ್ರೊಫೈಲ್ ಲೈವ್ ಆಗಿದ್ದು ನಾಗರಿಕರಿಗೆ ಗೋಚರಿಸುತ್ತಿದೆ",
  dashboard_no_video: "ಇನ್ನೂ ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ",
  dashboard_add_video: "ಹೆಚ್ಚು ಕ್ಲೈಂಟ್‌ಗಳನ್ನು ಆಕರ್ಷಿಸಲು ವೀಡಿಯೊ ಪ್ರೊಫೈಲ್ ಸೇರಿಸಿ",
  dashboard_requests_title: "ಸ್ವೀಕರಿಸಿದ ಕಲಿಕೆ ವಿನಂತಿಗಳು",
  dashboard_no_requests: "ಇನ್ನೂ ವಿನಂತಿಗಳಿಲ್ಲ",
  dashboard_requests_hint:
    "ನಾಗರಿಕರು ನಿಮ್ಮಿಂದ ಕಲಿಯಲು ಬಯಸಿದಾಗ, ಅವರ ವಿನಂತಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.",
  dashboard_pending: "ಬಾಕಿ",
  dashboard_about_you: "ನಿಮ್ಮ ಬಗ್ಗೆ",

  requests_title: "ಕಲಿಕೆ ವಿನಂತಿಗಳು",
  requests_submitted: "ವಿನಂತಿ(ಗಳು) ಸಲ್ಲಿಸಲಾಗಿದೆ",
  requests_failed: "ವಿನಂತಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
  requests_none: "ಇನ್ನೂ ಕಲಿಕೆ ವಿನಂತಿಗಳಿಲ್ಲ",
  requests_none_desc: "ಯಾರಾದರೂ ವೃತ್ತಿಪರರಿಂದ ಕಲಿಯಲು ವಿನಂತಿಸಿದಾಗ, ಅದು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತದೆ.",
  requests_browse: "ವೃತ್ತಿಪರರನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",

  error_profile_not_found: "ಪ್ರೊಫೈಲ್ ಕಂಡುಬಂದಿಲ್ಲ",
  error_load_professionals: "ವೃತ್ತಿಪರರನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ",
  error_no_professionals: "ವೃತ್ತಿಪರರು ಕಂಡುಬಂದಿಲ್ಲ",
  error_adjust_filters: "ನಿಮ್ಮ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ ಅಥವಾ ಬೇರೆ ಕೌಶಲ್ಯ ಹುಡುಕಿ.",
  error_something_wrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯಮಾಡಿ ರಿಫ್ರೆಶ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  error_please_fill: "ದಯಮಾಡಿ ಎಲ್ಲ ಕ್ಷೇತ್ರಗಳನ್ನು ತುಂಬಿಸಿ",
  error_please_fill_required: "ದಯಮಾಡಿ ಹೆಸರು, ಕೌಶಲ್ಯ ಮತ್ತು ಸ್ಥಳ ತುಂಬಿಸಿ",
  error_backend_not_ready: "ಬ್ಯಾಕೆಂಡ್ ಇನ್ನೂ ಸಿದ್ಧವಾಗಿಲ್ಲ, ದಯಮಾಡಿ ಸ್ವಲ್ಪ ಸಮಯ ಕಾಯಿರಿ",
  error_registration_failed: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  error_endorse_failed: "ಬೆಂಬಲಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  error_request_failed: "ವಿನಂತಿ ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  error_enter_name: "ದಯಮಾಡಿ ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ.",
  error_enter_message: "ದಯಮಾಡಿ ಒಂದು ಸಂದೇಶ ನಮೂದಿಸಿ.",
  success_endorsed: "ಬೆಂಬಲ ಸಲ್ಲಿಸಲಾಗಿದೆ! 🎉",
  success_request_sent: "ಕಲಿಕೆ ವಿನಂತಿ ಕಳುಹಿಸಲಾಗಿದೆ! 📚",

  voice_listening: "ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಒಂದು ಕೌಶಲ್ಯ ಹೆಸರು ಹೇಳಿ",
  voice_heard: "ಕೇಳಿದೆ",
  voice_failed: "ವಾಯ್ಸ್ ಸರ್ಚ್ ವಿಫಲವಾಗಿದೆ. ದಯಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  voice_chrome_required: "ವಾಯ್ಸ್ ಸರ್ಚ್‌ಗೆ Chrome ಅಥವಾ Edge ಬ್ರೌಸರ್ ಅಗತ್ಯ.",

  skill_all: "ಎಲ್ಲಾ",
  skill_carpenter: "ಬಡಗಿ",
  skill_tailor: "ದರ್ಜಿ",
  skill_plumber: "ಪ್ಲಂಬರ್",
  skill_potter: "ಕುಂಬಾರ",
  skill_electrician: "ಎಲೆಕ್ಟ್ರಿಶಿಯನ್",
  skill_painter: "ಚಿತ್ರಕಾರ",
  skill_mason: "ಗಾರೆ ಕೆಲಸಗಾರ",
  skill_welder: "ವೆಲ್ಡರ್",
  skill_blacksmith: "ಕಮ್ಮಾರ",
  skill_cobbler: "ಚಪ್ಪಲಿ ಹೊಲಿಗಾರ",
  skill_barber: "ಕ್ಷೌರಿಕ",
  skill_chef: "ಅಡುಗೆಯವರು",
  skill_driver: "ಚಾಲಕ",
  skill_farmer: "ರೈತ",

  badge_bronze: "ಕಂಚು",
  badge_silver: "ಬೆಳ್ಳಿ",
  badge_gold: "ಚಿನ್ನ",
  badge_member: "ಸದಸ್ಯ",
  badge_portfolio: "ಪೋರ್ಟ್‌ಫೋಲಿಯೋ",
  community_link_suffix: "ಸಮುದಾಯ →",

  profile_share: "ಪ್ರೊಫೈಲ್ ಶೇರ್ ಮಾಡಿ",
  profile_share_copied: "ಪ್ರೊಫೈಲ್ ಲಿಂಕ್ ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ಕಾಪಿ ಆಗಿದೆ!",
  profile_contact: "ಸಂಪರ್ಕಿಸಿ",
  notif_title: "ಅಧಿಸೂಚನೆಗಳು",
  notif_mark_read: "ಎಲ್ಲವನ್ನು ಓದಿದ್ದಾಗಿ ಗುರುತಿಸಿ",
  notif_empty: "ಇನ್ನೂ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",
  notif_endorsement: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಬೆಂಬಲಿಸಿದ್ದಾರೆ",
  notif_learning_request: "ಕಲಿಕೆ ವಿನಂತಿ ಕಳುಹಿಸಿದ್ದಾರೆ",
  notif_profile_view: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಡಿದ್ದಾರೆ",
  nearby_workers_label: "ಸಮೀಪದ ಕಾರ್ಮಿಕರು",
  search_by_name_hint: "ಹೆಸರು ಅಥವಾ ಕೌಶಲ್ಯದ ಮೂಲಕ ಸಮೀಪದ ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ",

  cert_section_title: "ಪೀರ್ ವ್ಯಾಲಿಡೇಶನ್",
  cert_not_tested: "ಇನ್ನೂ ಸರ್ಟಿಫೈ ಆಗಿಲ್ಲ",
  cert_not_tested_desc: "ನಿಮ್ಮ ಬೇಸಿಕ್ ಲೆವೆಲ್ ಸರ್ಟಿಫಿಕೆಟ್ ಪಡೆಯಲು ಕೌಶಲ್ಯ ಪರೀಕ್ಷೆ ತೆಗೆದುಕೊಳ್ಳಿ",
  cert_take_test: "ಸರ್ಟಿಫಿಕೇಶನ್ ಪರೀಕ್ಷೆ ತೆಗೆದುಕೊಳ್ಳಿ",
  cert_passed: "ಸರ್ಟಿಫೈಡ್ – ಬೇಸಿಕ್ ಲೆವೆಲ್",
  cert_view_cert: "ಸರ್ಟಿಫಿಕೆಟ್ ನೋಡಿ",
  cert_failed: "ಪರೀಕ್ಷೆ ಪಾಸ್ ಆಗಿಲ್ಲ",
  cert_retry: "ಪರೀಕ್ಷೆ ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ",
  cert_test_intro_title: "ಕೌಶಲ್ಯ ಸರ್ಟಿಫಿಕೇಶನ್ ಪರೀಕ್ಷೆ",
  cert_test_intro_desc:
    "10 ಪ್ರಶ್ನೆಗಳು (9 ವೀಡಿಯೊ MCQ + 1 ಪ್ರಾಯೋಗಿಕ). ಪಾಸ್ ಆಗಲು 6/9 ಸರಿಯಾದ ಉತ್ತರ ನೀಡಿ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ವೀಡಿಯೊ ಸಲ್ಲಿಸಿ.",
  cert_start_test: "ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
  cert_question_of: "ಪ್ರಶ್ನೆ {n} / 10",
  cert_next: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
  cert_submit: "ಪರೀಕ್ಷೆ ಸಲ್ಲಿಸಿ",
  cert_practical_title: "ಪ್ರಾಯೋಗಿಕ ಕಾರ್ಯ",
  cert_practical_upload: "ನಿಮ್ಮ ಟಾಸ್ಕ್ ವೀಡಿಯೊ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
  cert_evaluating: "ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  cert_passed_title: "ಅಭಿನಂದನೆಗಳು! ನೀವು ಪಾಸ್ ಆದಿರಿ!",
  cert_score_label: "MCQ ಸ್ಕೋರ್",
  cert_practical_label: "ಪ್ರಾಯೋಗಿಕ ವೀಡಿಯೊ",
  cert_practical_accepted: "ಒಪ್ಪಿಕೊಳ್ಳಲಾಗಿದೆ",
  cert_view_certificate: "ನಿಮ್ಮ ಸರ್ಟಿಫಿಕೆಟ್ ನೋಡಿ",
  cert_certificate_title: "ಸಾಧನೆಯ ಪ್ರಮಾಣ ಪತ್ರ",
  cert_issued_to: "ಇದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತದೆ",
  cert_competency: "ನಲ್ಲಿ ಬೇಸಿಕ್ ಲೆವೆಲ್ ಕೌಶಲ್ಯ ತೋರಿಸಿದ್ದಾರೆ",
  cert_basic_level: "ಬೇಸಿಕ್ ಲೆವೆಲ್ ಸರ್ಟಿಫಿಕೇಶನ್",
  cert_download: "ಸರ್ಟಿಫಿಕೆಟ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
  cert_no_cert: "ಸರ್ಟಿಫಿಕೇಶನ್ ಕಂಡುಬಂದಿಲ್ಲ",
  cert_go_dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
};

export const TRANSLATIONS: Record<LangCode, Translations> = {
  en,
  te,
  hi,
  ml,
  kn,
};

export const LANGUAGE_OPTIONS: Array<{
  code: LangCode;
  label: string;
  flag: string;
  shortLabel: string;
  bcp47: string;
}> = [
  {
    code: "en",
    label: "English",
    flag: "🇬🇧",
    shortLabel: "EN",
    bcp47: "en-IN",
  },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", shortLabel: "తె", bcp47: "te-IN" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳", shortLabel: "हि", bcp47: "hi-IN" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳", shortLabel: "മ", bcp47: "ml-IN" },
  { code: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳", shortLabel: "ಕ", bcp47: "kn-IN" },
];

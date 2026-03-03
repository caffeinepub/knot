import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileVideo,
  Loader2,
  PlayCircle,
  Shield,
  Trophy,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { BannerAd, PopupAd } from "../components/PopupAd";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { getAuthUser } from "../utils/auth";

// ─── Text-to-Speech ─────────────────────────────────────────────────────────

const LANG_BCP47: Record<string, string> = {
  en: "en-IN",
  te: "te-IN",
  hi: "hi-IN",
  ml: "ml-IN",
  kn: "kn-IN",
};

// BCP-47 prefix fallbacks so we still get a regional voice if exact locale missing
const LANG_PREFIX_FALLBACK: Record<string, string> = {
  en: "en",
  te: "te",
  hi: "hi",
  ml: "ml",
  kn: "kn",
};

function pickVoice(targetLang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const exact = LANG_BCP47[targetLang] ?? "en-IN";
  const prefix = LANG_PREFIX_FALLBACK[targetLang] ?? "en";

  // 1. exact locale match (e.g. "te-IN")
  let voice = voices.find((v) => v.lang.toLowerCase() === exact.toLowerCase());
  if (voice) return voice;

  // 2. prefix match (e.g. any voice starting with "te")
  voice = voices.find((v) =>
    v.lang.toLowerCase().startsWith(prefix.toLowerCase()),
  );
  if (voice) return voice;

  // 3. For non-English languages without a local voice, prefer a neutral English voice
  //    over silently failing — the text won't be in English but at least something plays.
  //    Actually: just return null and let the browser use its default for that lang code.
  return null;
}

function speakText(text: string, langCode: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  function doSpeak() {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_BCP47[langCode] ?? "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voice = pickVoice(langCode);
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Voices may not be loaded yet on first call — wait for them
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak();
  } else {
    // One-time listener: fires when voices load, then immediately removed
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        onVoicesChanged,
      );
      doSpeak();
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    // Safety timeout: speak anyway after 800ms in case event never fires
    setTimeout(() => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        onVoicesChanged,
      );
      doSpeak();
    }, 800);
  }
}

// ─── Question Bank ─────────────────────────────────────────────────────────────

interface MCQQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3
}

interface PracticalQuestion {
  id: number;
  description: string;
}

interface QuestionBank {
  mcq: MCQQuestion[];
  practical: PracticalQuestion;
}

function getQuestionBank(skill: string, lang: string): QuestionBank {
  const s = skill.toLowerCase();

  const isCarpenter =
    s.includes("carpenter") ||
    s.includes("wood") ||
    s.includes("బడ") ||
    s.includes("वढई") ||
    s.includes("bada");

  const isTailor =
    s.includes("tailor") ||
    s.includes("seam") ||
    s.includes("stitch") ||
    s.includes("దర్జీ") ||
    s.includes("दर्जी");

  const isPlumber =
    s.includes("plumb") ||
    s.includes("pipe") ||
    s.includes("పైప్") ||
    s.includes("प्लंबर");

  // ── Carpenter ──────────────────────────────────────────────────────────────
  if (isCarpenter) {
    if (lang === "te") {
      return {
        mcq: [
          {
            id: 1,
            question: "వడ్రంగిలో అత్యంత బలమైన చెక్క జాయింట్ ఏది?",
            options: ["డవ్‌టెయిల్", "బట్ జాయింట్", "మోర్టైస్", "లాప్ జాయింట్"],
            correctIndex: 0,
          },
          {
            id: 2,
            question: "వంపు కట్స్ కోసం ఏ టూల్ బెస్ట్?",
            options: ["సర్క్యులర్ సా", "జిగ్‌సా", "హ్యాండ్ సా", "టేబుల్ సా"],
            correctIndex: 1,
          },
          {
            id: 3,
            question: "ఫర్నిచర్ కోసం ప్లైవుడ్ స్టాండర్డ్ మందం?",
            options: ["6mm", "12mm", "18mm", "25mm"],
            correctIndex: 2,
          },
          {
            id: 4,
            question: "ముడి చెక్కపై మొదట ఏ ఫినిష్ వేయాలి?",
            options: ["పెయింట్", "లాక్కర్", "శాండ్‌పేపర్ (80 గ్రిట్)", "ప్రైమర్"],
            correctIndex: 2,
          },
          {
            id: 5,
            question: "బాహ్య ఫర్నిచర్ కోసం ఏ చెక్క బెస్ట్?",
            options: ["పైన్", "టీక్", "MDF", "బాల్సా"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "చెక్కలో 'గ్రెయిన్ డైరెక్షన్' దేనిని ప్రభావితం చేస్తుంది?",
            options: ["రంగు", "బరువు", "బలం & చీలిక", "ఖర్చు"],
            correctIndex: 2,
          },
          {
            id: 7,
            question: "చెక్కపై పని కోసం అత్యంత వాడుకలో ఉన్న స్క్రూ రకం ఏది?",
            options: ["ఫిలిప్స్", "ఫ్లాట్", "టోర్క్స్", "హెక్స్"],
            correctIndex: 0,
          },
          {
            id: 8,
            question: "వుడ్ పుట్టి యొక్క ప్రయోజనం?",
            options: ["పలకలు జోడించడం", "రంధ్రాలు నింపడం", "వాటర్‌ప్రూఫింగ్", "స్టెయినింగ్"],
            correctIndex: 1,
          },
          {
            id: 9,
            question: "కట్టింగ్ చేసేటప్పుడు ముఖ్యమైన సేఫ్టీ గేర్?",
            options: ["గ్లోవ్స్ మాత్రమే", "గాగుల్స్ మరియు మాస్క్", "అప్రన్ మాత్రమే", "ఏమీ లేదు"],
            correctIndex: 1,
          },
        ],
        practical: {
          id: 10,
          description:
            "ఒక సాధారణ చెక్క బాక్స్ ఫ్రేమ్ నిర్మించండి. మీరు కొలవడం, కట్ చేయడం మరియు జోడించడం రికార్డ్ చేయండి.",
        },
      };
    }
    if (lang === "hi") {
      return {
        mcq: [
          {
            id: 1,
            question: "बढ़ईगीरी में सबसे मजबूत लकड़ी का जोड़ कौन सा है?",
            options: ["डवटेल", "बट जॉइंट", "मोर्टाइस", "लैप जॉइंट"],
            correctIndex: 0,
          },
          {
            id: 2,
            question: "घुमावदार कट के लिए कौन सा उपकरण सबसे अच्छा है?",
            options: ["सर्कुलर सॉ", "जिगसॉ", "हैंड सॉ", "टेबल सॉ"],
            correctIndex: 1,
          },
          {
            id: 3,
            question: "फर्नीचर के लिए प्लाईवुड की मानक मोटाई?",
            options: ["6mm", "12mm", "18mm", "25mm"],
            correctIndex: 2,
          },
          {
            id: 4,
            question: "कच्ची लकड़ी पर पहले कौन सा फिनिश लगाएं?",
            options: ["पेंट", "लेकर", "सैंडपेपर (80 ग्रिट)", "प्राइमर"],
            correctIndex: 2,
          },
          {
            id: 5,
            question: "बाहरी फर्नीचर के लिए कौन सी लकड़ी सबसे अच्छी?",
            options: ["पाइन", "टीक", "MDF", "बाल्सा"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "लकड़ी में 'अनाज की दिशा' किसे प्रभावित करती है?",
            options: ["रंग", "वजन", "मजबूती और दरार", "कीमत"],
            correctIndex: 2,
          },
          {
            id: 7,
            question: "लकड़ी के काम में सबसे अधिक उपयोग होने वाला स्क्रू कौन सा है?",
            options: ["फिलिप्स", "फ्लैट", "टोर्क्स", "हेक्स"],
            correctIndex: 0,
          },
          {
            id: 8,
            question: "वुड पुट्टी का उद्देश्य?",
            options: ["तख्तों को जोड़ना", "छेद/गैप भरना", "वाटरप्रूफिंग", "स्टेनिंग"],
            correctIndex: 1,
          },
          {
            id: 9,
            question: "काटते समय आवश्यक सुरक्षा गियर?",
            options: ["केवल दस्ताने", "चश्मा और मास्क", "केवल एप्रन", "कुछ नहीं"],
            correctIndex: 1,
          },
        ],
        practical: {
          id: 10,
          description:
            "एक साधारण लकड़ी का बॉक्स फ्रेम बनाएं। खुद को माप, काट और जोड़ते हुए रिकॉर्ड करें।",
        },
      };
    }
    // English (en), Malayalam (ml), Kannada (kn) — English fallback
    return {
      mcq: [
        {
          id: 1,
          question:
            "Which wood joint is considered the strongest for furniture?",
          options: ["Dovetail", "Butt joint", "Mortise", "Lap joint"],
          correctIndex: 0,
        },
        {
          id: 2,
          question: "Which tool is best for making curved cuts?",
          options: ["Circular saw", "Jigsaw", "Hand saw", "Table saw"],
          correctIndex: 1,
        },
        {
          id: 3,
          question:
            "What is the standard thickness of plywood used for furniture?",
          options: ["6mm", "12mm", "18mm", "25mm"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What finish should be applied first on raw wood?",
          options: ["Paint", "Lacquer", "Sandpaper (80 grit)", "Primer"],
          correctIndex: 2,
        },
        {
          id: 5,
          question: "Which wood is best for outdoor furniture?",
          options: ["Pine", "Teak", "MDF", "Balsa"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What does the 'grain direction' affect in woodworking?",
          options: ["Color", "Weight", "Strength & splitting", "Cost"],
          correctIndex: 2,
        },
        {
          id: 7,
          question: "Which screw type is most commonly used in woodworking?",
          options: ["Phillips", "Flat", "Torx", "Hex"],
          correctIndex: 0,
        },
        {
          id: 8,
          question: "What is the purpose of wood putty?",
          options: [
            "Joining planks",
            "Filling holes/gaps",
            "Waterproofing",
            "Staining",
          ],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "What safety gear is essential when cutting?",
          options: ["Gloves only", "Goggles and mask", "Apron only", "None"],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "Build a simple wooden box frame. Record yourself measuring, cutting and joining the pieces.",
      },
    };
  }

  // ── Tailor ─────────────────────────────────────────────────────────────────
  if (isTailor) {
    if (lang === "te") {
      return {
        mcq: [
          {
            id: 1,
            question: "రెండు బట్ట ముక్కలు కలపడానికి ఏ కుట్టు ఉపయోగిస్తారు?",
            options: ["చైన్ కుట్టు", "రన్నింగ్ కుట్టు", "స్ట్రెయిట్ కుట్టు", "జిగ్‌జాగ్ కుట్టు"],
            correctIndex: 2,
          },
          {
            id: 2,
            question: "వేసవి దుస్తులకు అత్యంత అనుకూలమైన బట్ట ఏది?",
            options: ["కాటన్", "సిల్క్", "పాలిస్టర్", "ఉల్"],
            correctIndex: 0,
          },
          {
            id: 3,
            question: "దుస్తులకు స్టాండర్డ్ సీమ్ అలవెన్స్ ఎంత?",
            options: ["5mm", "10mm", "15mm", "20mm"],
            correctIndex: 2,
          },
          {
            id: 4,
            question: "బట్టపై కటింగ్ లైన్లు గుర్తించడానికి ఏ టూల్ ఉపయోగిస్తారు?",
            options: ["పెన్", "చాక్", "మార్కర్", "పెన్సిల్"],
            correctIndex: 1,
          },
          {
            id: 5,
            question: "కట్ చేయడానికి ముందు బట్ట ఎలా సిద్ధం చేయాలి?",
            options: ["ఇస్త్రీ చేయి", "ఉతికి ఇస్త్రీ చేయి", "కేవలం కట్ చేయి", "తడిపించు"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "బాస్టింగ్ కుట్టు యొక్క ప్రయోజనం ఏమిటి?",
            options: ["అంతిమ జాయినింగ్", "తాత్కాలిక పట్టు", "అలంకరణ", "వాటర్‌ప్రూఫింగ్"],
            correctIndex: 1,
          },
          {
            id: 7,
            question: "భారీ బట్టకు ఏ సూది బెస్ట్?",
            options: ["9/65", "11/75", "16/100", "8/60"],
            correctIndex: 2,
          },
          {
            id: 8,
            question: "పాటర్న్ మేకింగ్‌లో 'ఈజ్' అంటే ఏమిటి?",
            options: ["స్ట్రెచ్", "కదలికకు అదనపు స్థలం", "బిగుతు", "ఒక కుట్టు రకం"],
            correctIndex: 1,
          },
          {
            id: 9,
            question: "పర్ఫెక్ట్ హెమ్ కోసం ఏమి చేయాలి?",
            options: [
              "రెండుసార్లు మడవండి మరియు కుట్టండి",
              "గ్లూ వాడండి",
              "రా వదిలేయండి",
              "తక్కువగా కట్ చేయండి",
            ],
            correctIndex: 0,
          },
        ],
        practical: {
          id: 10,
          description:
            "ఒక బట్ట ముక్కపై స్ట్రెయిట్ హెమ్ కొలిచి కుట్టండి. మీరు చేస్తుండగా రికార్డ్ చేయండి.",
        },
      };
    }
    if (lang === "hi") {
      return {
        mcq: [
          {
            id: 1,
            question:
              "दो कपड़े के टुकड़ों को जोड़ने के लिए कौन सी सिलाई उपयोग की जाती है?",
            options: ["चेन स्टिच", "रनिंग स्टिच", "स्ट्रेट स्टिच", "जिगजैग स्टिच"],
            correctIndex: 2,
          },
          {
            id: 2,
            question: "गर्मियों के कपड़ों के लिए सबसे उपयुक्त कपड़ा कौन सा है?",
            options: ["कॉटन", "सिल्क", "पॉलिएस्टर", "ऊन"],
            correctIndex: 0,
          },
          {
            id: 3,
            question: "कपड़ों के लिए मानक सीम अलाउंस क्या है?",
            options: ["5mm", "10mm", "15mm", "20mm"],
            correctIndex: 2,
          },
          {
            id: 4,
            question:
              "कपड़े पर कटिंग लाइन चिह्नित करने के लिए कौन सा टूल उपयोग करते हैं?",
            options: ["पेन", "चॉक", "मार्कर", "पेंसिल"],
            correctIndex: 1,
          },
          {
            id: 5,
            question: "काटने से पहले कपड़े को कैसे तैयार करें?",
            options: ["इस्त्री करें", "धोएं और इस्त्री करें", "बस काट लें", "गीला करें"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "बेस्टिंग स्टिच का उद्देश्य क्या है?",
            options: ["अंतिम जोड़", "अस्थायी पकड़", "सजावट", "वाटरप्रूफिंग"],
            correctIndex: 1,
          },
          {
            id: 7,
            question: "भारी कपड़े के लिए कौन सी सुई सबसे अच्छी है?",
            options: ["9/65", "11/75", "16/100", "8/60"],
            correctIndex: 2,
          },
          {
            id: 8,
            question: "पैटर्न मेकिंग में 'ईज़' क्या है?",
            options: [
              "खिंचाव",
              "हिलने के लिए अतिरिक्त जगह",
              "कसाव",
              "एक सिलाई प्रकार",
            ],
            correctIndex: 1,
          },
          {
            id: 9,
            question: "एक सही हेम के लिए क्या करना चाहिए?",
            options: [
              "दो बार मोड़ें और सिलें",
              "गोंद इस्तेमाल करें",
              "कच्चा छोड़ें",
              "छोटा काट लें",
            ],
            correctIndex: 0,
          },
        ],
        practical: {
          id: 10,
          description:
            "एक कपड़े के टुकड़े पर सीधी हेम मापें और सिलें। खुद को करते हुए रिकॉर्ड करें।",
        },
      };
    }
    // English fallback (ml, kn, en)
    return {
      mcq: [
        {
          id: 1,
          question: "What stitch is used for joining two fabric pieces?",
          options: [
            "Chain stitch",
            "Running stitch",
            "Straight stitch",
            "Zigzag stitch",
          ],
          correctIndex: 2,
        },
        {
          id: 2,
          question: "Which fabric is best suited for summer garments?",
          options: ["Cotton", "Silk", "Polyester", "Wool"],
          correctIndex: 0,
        },
        {
          id: 3,
          question: "What is the standard seam allowance for garments?",
          options: ["5mm", "10mm", "15mm", "20mm"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What tool is used to mark cutting lines on fabric?",
          options: ["Pen", "Chalk", "Marker", "Pencil"],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "How should fabric be prepared before cutting?",
          options: ["Iron it", "Wash and iron", "Just cut", "Wet it"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What is the purpose of a basting stitch?",
          options: [
            "Final join",
            "Temporary hold",
            "Decoration",
            "Waterproofing",
          ],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "Which needle is best for heavy fabric?",
          options: ["9/65", "11/75", "16/100", "8/60"],
          correctIndex: 2,
        },
        {
          id: 8,
          question: "What is 'ease' in pattern making?",
          options: [
            "Stretch",
            "Extra room for movement",
            "Tightness",
            "A stitch type",
          ],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "For a perfect hem, what should you do?",
          options: [
            "Fold twice and stitch",
            "Use glue",
            "Leave raw",
            "Cut shorter",
          ],
          correctIndex: 0,
        },
      ],
      practical: {
        id: 10,
        description:
          "Measure and stitch a straight hem on a piece of fabric. Record yourself doing it.",
      },
    };
  }

  // ── Plumber ────────────────────────────────────────────────────────────────
  if (isPlumber) {
    if (lang === "te") {
      return {
        mcq: [
          {
            id: 1,
            question: "మూడు పైపులను కలిపే ప్లంబింగ్ ఫిట్టింగ్ రకం ఏది?",
            options: ["ఎల్బో", "టీ", "కప్లర్", "రెడ్యూసర్"],
            correctIndex: 1,
          },
          {
            id: 2,
            question: "వేడి నీటికి ఏ పైప్ మెటీరియల్ బెస్ట్?",
            options: ["PVC", "CPVC", "HDPE", "ఐరన్"],
            correctIndex: 1,
          },
          {
            id: 3,
            question: "డ్రెయినేజ్ పైపులకు సరైన స్లోప్ ఎంత?",
            options: ["0.5%", "1%", "2%", "5%"],
            correctIndex: 2,
          },
          {
            id: 4,
            question: "కాపర్ పైపులు కట్ చేయడానికి ఏ టూల్ వాడాలి?",
            options: ["హ్యాక్సా", "పైప్ కట్టర్", "గ్రైండర్", "చిజెల్"],
            correctIndex: 1,
          },
          {
            id: 5,
            question: "పైప్ థ్రెడ్స్ కోసం ఏ సీలెంట్ వాడాలి?",
            options: ["ఫెవికాల్", "టెఫ్లాన్ టేప్", "సిలికోన్", "ఎపాక్సీ"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "ప్లంబింగ్ తర్వాత ఏ ప్రెషర్ టెస్ట్ చేస్తారు?",
            options: ["టెంపరేచర్ టెస్ట్", "వాటర్ ప్రెషర్ టెస్ట్", "గ్యాస్ టెస్ట్", "ఏదీ లేదు"],
            correctIndex: 1,
          },
          {
            id: 7,
            question: "P-ట్రాప్ దేన్ని నిరోధిస్తుంది?",
            options: ["నీటి ప్రవాహం", "మురుగు వాయువులు", "లీకేజీలు", "ప్రెషర్ తగ్గుదల"],
            correctIndex: 1,
          },
          {
            id: 8,
            question: "నీటి ప్రవాహాన్ని పూర్తిగా ఆపే వాల్వ్ ఏది?",
            options: ["బాల్ వాల్వ్", "గేట్ వాల్వ్", "చెక్ వాల్వ్", "ఫ్లోట్ వాల్వ్"],
            correctIndex: 0,
          },
          {
            id: 9,
            question: "లీకవుతున్న జాయింట్ కోసం మొదట ఏమి చేయాలి?",
            options: ["పైప్ రీప్లేస్ చేయి", "ఫిట్టింగ్ టైట్ చేయి", "సీలెంట్ వేయి", "సూపర్‌వైజర్‌ని పిలవు"],
            correctIndex: 1,
          },
        ],
        practical: {
          id: 10,
          description:
            "సిమ్యులేటెడ్ పైప్ జాయింట్ లీక్ ఫిక్స్ చేయండి. మీరు సమస్య గుర్తించి పరిష్కరించడం రికార్డ్ చేయండి.",
        },
      };
    }
    if (lang === "hi") {
      return {
        mcq: [
          {
            id: 1,
            question: "तीन पाइपों को जोड़ने वाली प्लंबिंग फिटिंग कौन सी है?",
            options: ["एल्बो", "टी", "कपलर", "रेड्यूसर"],
            correctIndex: 1,
          },
          {
            id: 2,
            question: "गर्म पानी के लिए कौन सा पाइप सामग्री सबसे अच्छी है?",
            options: ["PVC", "CPVC", "HDPE", "आयरन"],
            correctIndex: 1,
          },
          {
            id: 3,
            question: "ड्रेनेज पाइप के लिए सही ढलान क्या है?",
            options: ["0.5%", "1%", "2%", "5%"],
            correctIndex: 2,
          },
          {
            id: 4,
            question: "तांबे के पाइप काटने के लिए कौन सा उपकरण उपयोग करते हैं?",
            options: ["हैकसॉ", "पाइप कटर", "ग्राइंडर", "छेनी"],
            correctIndex: 1,
          },
          {
            id: 5,
            question: "पाइप थ्रेड के लिए कौन सा सीलेंट उपयोग करते हैं?",
            options: ["फेविकॉल", "टेफ्लॉन टेप", "सिलिकॉन", "एपॉक्सी"],
            correctIndex: 1,
          },
          {
            id: 6,
            question: "प्लंबिंग के बाद कौन सा दबाव परीक्षण किया जाता है?",
            options: [
              "तापमान परीक्षण",
              "पानी दबाव परीक्षण",
              "गैस परीक्षण",
              "कोई नहीं",
            ],
            correctIndex: 1,
          },
          {
            id: 7,
            question: "P-ट्रैप क्या रोकता है?",
            options: ["पानी का बहाव", "सीवर गैसें", "रिसाव", "दबाव में गिरावट"],
            correctIndex: 1,
          },
          {
            id: 8,
            question: "कौन सा वाल्व पानी का बहाव पूरी तरह रोकता है?",
            options: ["बॉल वाल्व", "गेट वाल्व", "चेक वाल्व", "फ्लोट वाल्व"],
            correctIndex: 0,
          },
          {
            id: 9,
            question: "लीकिंग जॉइंट के लिए सबसे पहले क्या करें?",
            options: ["पाइप बदलें", "फिटिंग कसें", "सीलेंट लगाएं", "सुपरवाइजर को बुलाएं"],
            correctIndex: 1,
          },
        ],
        practical: {
          id: 10,
          description:
            "एक नकली पाइप जॉइंट लीक ठीक करें। खुद को समस्या पहचानते और ठीक करते हुए रिकॉर्ड करें।",
        },
      };
    }
    // English fallback
    return {
      mcq: [
        {
          id: 1,
          question:
            "Which pipe fitting is used to connect three pipes together?",
          options: ["Elbow", "Tee", "Coupler", "Reducer"],
          correctIndex: 1,
        },
        {
          id: 2,
          question: "Which pipe material is best for hot water?",
          options: ["PVC", "CPVC", "HDPE", "Iron"],
          correctIndex: 1,
        },
        {
          id: 3,
          question: "What is the correct slope for drainage pipes?",
          options: ["0.5%", "1%", "2%", "5%"],
          correctIndex: 2,
        },
        {
          id: 4,
          question: "What tool is used to cut copper pipes?",
          options: ["Hacksaw", "Pipe cutter", "Grinder", "Chisel"],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "What sealant is used for pipe threads?",
          options: ["Fevicol", "Teflon tape", "Silicone", "Epoxy"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "What pressure test is done after plumbing?",
          options: [
            "Temperature test",
            "Water pressure test",
            "Gas test",
            "None",
          ],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "What does a P-trap prevent?",
          options: ["Water flow", "Sewer gases", "Leaks", "Pressure drop"],
          correctIndex: 1,
        },
        {
          id: 8,
          question: "Which valve completely stops water flow?",
          options: ["Ball valve", "Gate valve", "Check valve", "Float valve"],
          correctIndex: 0,
        },
        {
          id: 9,
          question: "For a leaking joint, you should first?",
          options: [
            "Replace pipe",
            "Tighten fitting",
            "Apply sealant",
            "Call supervisor",
          ],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "Fix a simulated pipe joint leak. Record yourself identifying and fixing the issue.",
      },
    };
  }

  // ── Generic fallback (all other skills) ───────────────────────────────────
  if (lang === "te") {
    return {
      mcq: [
        {
          id: 1,
          question: "ఈ పని కోసం ఏ సేఫ్టీ ఎక్విప్‌మెంట్ అవసరం?",
          options: ["గ్లోవ్స్", "గాగుల్స్", "మాస్క్", "అన్నీ"],
          correctIndex: 3,
        },
        {
          id: 2,
          question: "ఏ పని మొదలుపెట్టే ముందు మొదటి స్టెప్?",
          options: [
            "పని ప్రారంభించు",
            "టూల్స్ మరియు మెటీరియల్ అసెస్ చేయి",
            "సూపర్‌వైజర్‌ని పిలవు",
            "ఇన్‌స్పెక్షన్ స్కిప్ చేయి",
          ],
          correctIndex: 1,
        },
        {
          id: 3,
          question: "ప్రెసిషన్ వర్క్ కోసం అత్యంత ముఖ్యమైన టూల్?",
          options: ["రూలర్/మెజరింగ్ టేప్", "హ్యామర్", "బ్రష్", "రెంచ్"],
          correctIndex: 0,
        },
        {
          id: 4,
          question: "టూల్స్ ఎలా మెయింటెయిన్ చేయాలి?",
          options: [
            "మెయింటెనెన్స్ పట్టించుకోకు",
            "రెగ్యులర్‌గా క్లీన్ చేసి ఆయిల్ వేయి",
            "ప్రతి నెలా రీప్లేస్ చేయి",
            "మురికిగా వదిలేయి",
          ],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "టూల్ పాడైతే ఏమి చేయాలి?",
          options: ["అలాగే వాడు", "రిపోర్ట్ చేసి రీప్లేస్ చేయి", "దాచిపెట్టు", "స్వయంగా రిపేర్ చేయి"],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "వేస్ట్ డిస్పోసల్ కోసం బెస్ట్ ప్రాక్టీస్?",
          options: ["నేలపై వదిలేయి", "నిర్ణీత చోట వేయి", "కాల్చు", "పాతిపెట్టు"],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "పదునైన టూల్స్‌తో పని చేసేటప్పుడు?",
          options: [
            "తొందర పడు",
            "నెమ్మదిగా జాగ్రత్తగా పని చేయి",
            "బేర్ హ్యాండ్స్‌తో వాడు",
            "సేఫ్టీ రూల్స్ పట్టించుకోకు",
          ],
          correctIndex: 1,
        },
        {
          id: 8,
          question: "కస్టమర్ సంతృప్తి ఎలా సాధించాలి?",
          options: ["వేగంగా పని", "నాణ్యమైన పని", "చీప్ మెటీరియల్స్", "A మరియు B రెండూ"],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "కస్టమర్ ఫిర్యాదును ఎలా హ్యాండిల్ చేయాలి?",
          options: ["ఇగ్నోర్ చేయి", "వినాలి మరియు పరిష్కరించాలి", "వాదించు", "వెళ్ళిపో"],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "మీ నైపుణ్యం నుండి ఒక కోర్ టాస్క్ ప్రదర్శించండి. మీరు వృత్తిపరంగా పని చేస్తుండగా రికార్డ్ చేయండి.",
      },
    };
  }

  if (lang === "hi") {
    return {
      mcq: [
        {
          id: 1,
          question: "इस काम के लिए क्या safety equipment जरूरी है?",
          options: ["दस्ताने", "चश्मा", "मास्क", "सभी"],
          correctIndex: 3,
        },
        {
          id: 2,
          question: "कोई भी व्यावसायिक कार्य शुरू करने से पहले पहला कदम?",
          options: [
            "काम शुरू करें",
            "टूल्स और सामग्री का मूल्यांकन करें",
            "सुपरवाइजर को कॉल करें",
            "निरीक्षण छोड़ें",
          ],
          correctIndex: 1,
        },
        {
          id: 3,
          question: "सटीक काम के लिए सबसे महत्वपूर्ण उपकरण?",
          options: ["रूलर/मेजरिंग टेप", "हथौड़ा", "ब्रश", "रेंच"],
          correctIndex: 0,
        },
        {
          id: 4,
          question: "टूल्स कैसे रखरखाव करें?",
          options: [
            "रखरखाव की अनदेखी",
            "नियमित सफाई और तेल",
            "हर महीने बदलें",
            "गंदा छोड़ें",
          ],
          correctIndex: 1,
        },
        {
          id: 5,
          question: "अगर टूल खराब हो तो?",
          options: [
            "फिर भी इस्तेमाल करें",
            "रिपोर्ट करें और बदलें",
            "छुपाएं",
            "खुद ठीक करें",
          ],
          correctIndex: 1,
        },
        {
          id: 6,
          question: "अपशिष्ट निपटान के लिए सर्वोत्तम अभ्यास?",
          options: ["जमीन पर छोड़ें", "निर्धारित स्थान पर डालें", "जलाएं", "दफनाएं"],
          correctIndex: 1,
        },
        {
          id: 7,
          question: "तेज उपकरणों के साथ काम करते समय?",
          options: [
            "जल्दी करें",
            "धीरे और सावधानी से काम करें",
            "नंगे हाथों से उपयोग करें",
            "सुरक्षा नियमों की अनदेखी",
          ],
          correctIndex: 1,
        },
        {
          id: 8,
          question: "ग्राहक संतुष्टि कैसे प्राप्त करें?",
          options: ["तेज काम", "गुणवत्ता काम", "सस्ती सामग्री", "A और B दोनों"],
          correctIndex: 1,
        },
        {
          id: 9,
          question: "ग्राहक की शिकायत कैसे संभालें?",
          options: ["नजरअंदाज करें", "सुनें और हल करें", "बहस करें", "चले जाएं"],
          correctIndex: 1,
        },
      ],
      practical: {
        id: 10,
        description:
          "अपने कौशल से एक मुख्य कार्य प्रदर्शित करें। खुद को पेशेवर तरीके से काम करते हुए रिकॉर्ड करें।",
      },
    };
  }

  // English / Malayalam / Kannada fallback
  return {
    mcq: [
      {
        id: 1,
        question: "What safety equipment is essential for this task?",
        options: ["Gloves", "Goggles", "Mask", "All of the above"],
        correctIndex: 3,
      },
      {
        id: 2,
        question: "What is the first step before starting any vocational task?",
        options: [
          "Start working",
          "Assess tools and materials",
          "Call a supervisor",
          "Skip inspection",
        ],
        correctIndex: 1,
      },
      {
        id: 3,
        question: "Which tool is most important for precision work?",
        options: ["Ruler/measuring tape", "Hammer", "Brush", "Wrench"],
        correctIndex: 0,
      },
      {
        id: 4,
        question: "How should tools be maintained?",
        options: [
          "Ignore maintenance",
          "Clean and oil regularly",
          "Replace every month",
          "Leave dirty",
        ],
        correctIndex: 1,
      },
      {
        id: 5,
        question: "What should you do if a tool is damaged?",
        options: [
          "Use it anyway",
          "Report and replace",
          "Hide it",
          "Repair it yourself",
        ],
        correctIndex: 1,
      },
      {
        id: 6,
        question: "What is the best practice for waste disposal?",
        options: [
          "Leave on ground",
          "Dispose in designated area",
          "Burn it",
          "Bury it",
        ],
        correctIndex: 1,
      },
      {
        id: 7,
        question: "When working with sharp tools, you should?",
        options: [
          "Rush",
          "Work slowly and carefully",
          "Use bare hands",
          "Ignore safety rules",
        ],
        correctIndex: 1,
      },
      {
        id: 8,
        question: "Customer satisfaction is achieved by?",
        options: [
          "Quick work",
          "Quality work",
          "Cheap materials",
          "Both A and B",
        ],
        correctIndex: 1,
      },
      {
        id: 9,
        question: "How should you handle a customer complaint?",
        options: ["Ignore", "Listen and resolve", "Argue", "Walk away"],
        correctIndex: 1,
      },
    ],
    practical: {
      id: 10,
      description:
        "Demonstrate a core task from your skill. Record yourself performing the task professionally.",
    },
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type TestPhase = "intro" | "mcq" | "practical" | "evaluating" | "result";

interface TestResult {
  mcqScore: number;
  practicalPassed: boolean;
  passed: boolean;
  pendingReview: boolean;
}

// ─── Option Button ─────────────────────────────────────────────────────────────

function OptionButton({
  label,
  text,
  selected,
  onClick,
}: {
  label: string;
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-body text-sm transition-all duration-200 flex items-center gap-3 ${
        selected
          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
          : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-primary/5"
      }`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {label}
      </span>
      <span className="flex-1">{text}</span>
      {selected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function CertificationTestPage() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const { actor } = useActor();
  const { t, lang } = useLang();

  const skill = authUser?.skill ?? "General";
  // Recalculate bank reactively when language changes
  const bank = useMemo(() => getQuestionBank(skill, lang), [skill, lang]);

  // Map language codes to display names for the active language label
  const LANG_NAMES: Record<string, string> = {
    en: "English",
    te: "తెలుగు",
    hi: "हिन्दी",
    ml: "മലയാളം",
    kn: "ಕನ್ನಡ",
  };
  const langDisplayName = LANG_NAMES[lang] ?? "English";

  const [phase, setPhase] = useState<TestPhase>("intro");
  const [currentQ, setCurrentQ] = useState(0); // 0-8 for MCQ
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(9).fill(null),
  );
  const [practicalFile, setPracticalFile] = useState<File | null>(null);
  const [result, setResult] = useState<TestResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-read question aloud when phase or question changes
  useEffect(() => {
    if (phase === "mcq") {
      speakText(bank.mcq[currentQ].question, lang);
    }
  }, [phase, currentQ, lang, bank]);

  useEffect(() => {
    if (phase === "practical") {
      speakText(bank.practical.description, lang);
    }
  }, [phase, lang, bank]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  async function readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function selectAnswer(qIndex: number, optionIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  }

  function handleNext() {
    if (currentQ < 8) {
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("practical");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPracticalFile(file);
  }

  async function handleSubmit() {
    setPhase("evaluating");

    // Count correct answers first (synchronous, no delay)
    const mcqScore = answers.reduce<number>((count, answer, idx) => {
      return (
        count +
        (answer !== null && answer === bank.mcq[idx].correctIndex ? 1 : 0)
      );
    }, 0);
    const practicalPassed = practicalFile !== null;

    // Show evaluation animation for at least 2.5s but never hang
    await new Promise((res) => setTimeout(res, 2500));

    if (mcqScore >= 6 && practicalPassed && authUser) {
      // Submit practical video for admin review — with a strict 10s timeout so it never hangs
      try {
        const base64 = await readFileAsBase64(practicalFile!);
        if (actor) {
          await Promise.race([
            actor.submitPracticalVideo(
              authUser.id,
              authUser.name,
              skill,
              base64,
            ),
            new Promise<void>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 10000),
            ),
          ]);
        }
      } catch {
        // Continue even if backend upload fails or times out
      }

      // Store pending review status
      const workerIdStr = authUser.id.toString();
      localStorage.setItem(`knot_cert_status_${workerIdStr}`, "pending_review");
      localStorage.setItem(`knot_cert_mcq_${workerIdStr}`, mcqScore.toString());

      // Save practical submission to localStorage so the admin panel can find it
      try {
        const base64ForAdmin = await readFileAsBase64(practicalFile!);
        const practicalSubmission = {
          workerId: workerIdStr,
          workerName: authUser.name,
          skill,
          videoDataURI: base64ForAdmin,
          status: "pending",
          submittedAt: Date.now(),
        };
        localStorage.setItem(
          `knot_practical_submission_${workerIdStr}`,
          JSON.stringify(practicalSubmission),
        );
      } catch {
        // Continue even if the base64 conversion fails (large files)
      }
      // Save cert data as pending (not passed yet)
      localStorage.setItem(
        `knot_cert_${workerIdStr}`,
        JSON.stringify({
          passed: false,
          skill,
          mcqScore,
          practicalPassed: true,
          certificateId: "",
          level: "",
          issuedDate: Date.now(),
          workerId: workerIdStr,
          pendingReview: true,
        }),
      );

      // Submit MCQ result to backend (passed=false until admin approves)
      try {
        if (actor) {
          await Promise.race([
            actor.submitTestResult(authUser.id, BigInt(mcqScore), false),
            new Promise<void>((_, reject) =>
              setTimeout(() => reject(new Error("timeout")), 5000),
            ),
          ]);
        }
      } catch {
        // Continue even if backend fails or times out
      }

      setResult({
        mcqScore,
        practicalPassed: true,
        passed: false,
        pendingReview: true,
      });
    } else {
      // Failed — mcq score too low or no practical video
      if (authUser) {
        const workerIdStr = authUser.id.toString();
        localStorage.setItem(`knot_cert_status_${workerIdStr}`, "failed");
        localStorage.removeItem("knot_cert_passed");
        localStorage.setItem(
          `knot_cert_${workerIdStr}`,
          JSON.stringify({
            passed: false,
            skill,
            mcqScore,
            practicalPassed,
            certificateId: "",
            level: "",
            issuedDate: Date.now(),
            workerId: workerIdStr,
            pendingReview: false,
          }),
        );
        try {
          if (actor) {
            await Promise.race([
              actor.submitTestResult(
                authUser.id,
                BigInt(mcqScore),
                practicalPassed,
              ),
              new Promise<void>((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 5000),
              ),
            ]);
          }
        } catch {
          // Continue even if backend fails or times out
        }
      }
      setResult({
        mcqScore,
        practicalPassed,
        passed: false,
        pendingReview: false,
      });
    }

    setPhase("result");
  }

  if (!authUser || authUser.role !== "worker") {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="font-display font-semibold text-foreground">
              {t("cert_take_test")}
            </p>
            <Button className="mt-4" onClick={() => navigate({ to: "/login" })}>
              {t("nav_login")}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const progressPct =
    phase === "intro"
      ? 0
      : phase === "practical"
        ? 90
        : phase === "result"
          ? 100
          : ((currentQ + 1) / 10) * 90;

  return (
    <main className="flex-1 bg-background min-h-screen">
      {/* Print styles */}
      <style>
        {"@media print { .no-print { display: none !important; } }"}
      </style>

      {/* Header bar */}
      <div className="bg-navy py-4 px-4 no-print">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/80" />
            <span className="font-display font-bold text-white text-lg">
              {t("cert_test_intro_title")}
            </span>
          </div>
          {phase !== "intro" && phase !== "result" && (
            <span className="font-body text-sm text-white/60">
              {t("cert_question_of").replace(
                "{n}",
                phase === "practical" ? "10" : String(currentQ + 1),
              )}
            </span>
          )}
        </div>
        {/* Progress bar */}
        {phase !== "intro" && (
          <div className="container mx-auto mt-3">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <PopupAd />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* ── Intro Phase ── */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <Card className="border border-border shadow-card overflow-hidden">
                <div className="bg-gradient-to-br from-navy to-navy-deep p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="font-display font-bold text-2xl text-white mb-2">
                    {t("cert_test_intro_title")}
                  </h1>
                  <p className="text-white/70 font-body text-sm">
                    {skill} — {t("cert_basic_level")}
                  </p>
                  <p className="text-white/50 font-body text-xs mt-1">
                    🌐 {langDisplayName}
                  </p>
                </div>
                <CardContent className="p-8">
                  <p className="font-body text-muted-foreground text-center leading-relaxed mb-8">
                    {t("cert_test_intro_desc")}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: "📋",
                        label: "9 MCQs",
                        sub: t("cert_next"),
                      },
                      {
                        icon: "🔧",
                        label: t("cert_practical_title"),
                        sub: t("cert_practical_upload"),
                      },
                      {
                        icon: "🏆",
                        label: "6/9+",
                        sub: t("cert_view_cert"),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-4 rounded-xl bg-muted/50 border border-border"
                      >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <p className="font-body font-semibold text-xs text-foreground">
                          {item.label}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full h-12 font-body font-semibold text-base gap-2"
                    onClick={() => setPhase("mcq")}
                  >
                    <PlayCircle className="w-5 h-5" />
                    {t("cert_start_test")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── MCQ Phase ── */}
          {phase === "mcq" && (
            <motion.div
              key={`mcq-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-5">
                {/* Question counter */}
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("cert_question_of").replace("{n}", String(currentQ + 1))}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-body">
                      🌐 {skill} — {langDisplayName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body font-semibold">
                      MCQ
                    </span>
                  </div>
                </div>

                {/* Scenario ad card */}
                <Card className="overflow-hidden border border-border shadow-sm">
                  <div
                    className="aspect-video relative flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #ea580c 40%, #dc2626 70%, #b91c1c 100%)",
                    }}
                  >
                    {/* AD badge */}
                    <span className="absolute top-3 right-3 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-widest uppercase shadow">
                      AD
                    </span>
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-black/20 blur-3xl" />
                    {/* Skill emoji */}
                    <div className="flex flex-col items-center gap-3 z-10">
                      <span className="text-[clamp(48px,10vw,96px)] drop-shadow-xl select-none">
                        {(() => {
                          const s = skill.toLowerCase();
                          if (
                            s.includes("carpenter") ||
                            s.includes("wood") ||
                            s.includes("joiner")
                          )
                            return "🪵";
                          if (
                            s.includes("tailor") ||
                            s.includes("seam") ||
                            s.includes("stitch") ||
                            s.includes("fashion")
                          )
                            return "🧵";
                          if (
                            s.includes("plumb") ||
                            s.includes("pipe") ||
                            s.includes("water")
                          )
                            return "🔧";
                          if (
                            s.includes("potter") ||
                            s.includes("pot") ||
                            s.includes("clay") ||
                            s.includes("ceramic")
                          )
                            return "🏺";
                          if (s.includes("electr") || s.includes("wire"))
                            return "⚡";
                          if (s.includes("paint")) return "🎨";
                          if (
                            s.includes("mason") ||
                            s.includes("brick") ||
                            s.includes("cement")
                          )
                            return "🧱";
                          if (s.includes("weld")) return "🔩";
                          if (s.includes("barber") || s.includes("hair"))
                            return "✂️";
                          if (
                            s.includes("chef") ||
                            s.includes("cook") ||
                            s.includes("food")
                          )
                            return "👨‍🍳";
                          if (s.includes("driver") || s.includes("auto"))
                            return "🚗";
                          if (s.includes("farm") || s.includes("agri"))
                            return "🌾";
                          return "🛠️";
                        })()}
                      </span>
                      <span className="text-white/90 font-body text-sm font-semibold tracking-wide uppercase bg-black/20 px-4 py-1 rounded-full">
                        {t("cert_test_intro_desc").split(".")[0]}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Question */}
                <Card className="border border-border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-display font-bold text-base text-foreground leading-snug">
                      {bank.mcq[currentQ].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 pb-4">
                    {bank.mcq[currentQ].options.map((opt, idx) => (
                      <OptionButton
                        key={["A", "B", "C", "D"][idx]}
                        label={["A", "B", "C", "D"][idx]}
                        text={opt}
                        selected={answers[currentQ] === idx}
                        onClick={() => selectAnswer(currentQ, idx)}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Banner ad between question and next button */}
                <BannerAd />

                {/* Navigation */}
                <Button
                  className="w-full h-11 gap-2 font-body font-semibold"
                  disabled={answers[currentQ] === null}
                  onClick={handleNext}
                >
                  {currentQ < 8 ? t("cert_next") : t("cert_practical_title")}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Practical Phase ── */}
          {phase === "practical" && (
            <motion.div
              key="practical"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("cert_question_of").replace("{n}", "10")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-body font-semibold">
                    🔧 {t("cert_practical_title")}
                  </span>
                </div>

                <Card className="border border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display font-bold text-base text-foreground">
                      {t("cert_practical_title")}: {skill}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    {/* Task description */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="font-body text-amber-900 leading-relaxed text-sm">
                        {bank.practical.description}
                      </p>
                    </div>

                    {/* Upload area */}
                    <div>
                      <p className="font-body font-semibold text-sm text-foreground mb-3">
                        {t("cert_practical_upload")}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                          practicalFile
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        {practicalFile ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <FileVideo className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-body font-semibold text-sm text-foreground">
                                {practicalFile.name}
                              </p>
                              <p className="font-body text-xs text-muted-foreground mt-0.5">
                                {(practicalFile.size / 1024 / 1024).toFixed(1)}{" "}
                                MB — {t("cert_submit")}
                              </p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-body font-semibold text-sm text-foreground">
                                {t("cert_practical_upload")}
                              </p>
                              <p className="font-body text-xs text-muted-foreground mt-1">
                                {t("login_video_formats")}
                              </p>
                            </div>
                          </div>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/mov,video/quicktime,video/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>

                    <Button
                      className="w-full h-12 gap-2 font-body font-semibold text-base"
                      disabled={!practicalFile}
                      onClick={handleSubmit}
                    >
                      <Trophy className="w-5 h-5" />
                      {t("cert_submit")}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* ── Evaluating Phase ── */}
          {phase === "evaluating" && (
            <motion.div
              key="evaluating"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border shadow-card">
                <CardContent className="py-20 flex flex-col items-center gap-6 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-foreground mb-2">
                      {t("cert_evaluating")}
                    </h2>
                    <p className="font-body text-muted-foreground text-sm">
                      {t("cert_test_intro_desc")}
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* ── Result Phase ── */}
          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Pending Review Card */}
              {result.pendingReview ? (
                <Card className="border-2 border-blue-300 shadow-card overflow-hidden">
                  <div className="p-8 text-center bg-gradient-to-br from-blue-500 to-blue-600">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <Clock className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="font-display font-bold text-2xl text-white mb-1">
                      Under Review
                    </h2>
                    <p className="text-white/80 font-body text-sm">
                      Admin will evaluate your practical video
                    </p>
                  </div>
                  <CardContent className="p-8 space-y-6">
                    {/* Score display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                        <p className="font-body text-xs text-blue-600 mb-1">
                          {t("cert_score_label")}
                        </p>
                        <p className="font-display font-bold text-3xl text-blue-800">
                          {result.mcqScore}
                          <span className="text-blue-500 text-xl">/9</span>
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                        <p className="font-body text-xs text-blue-600 mb-1">
                          Practical Video
                        </p>
                        <p className="font-display font-bold text-base text-blue-800">
                          ✅ Submitted
                        </p>
                      </div>
                    </div>

                    {/* Progress bar for MCQ */}
                    <div>
                      <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
                        <span>{t("cert_score_label")}</span>
                        <span>{result.mcqScore}/9 ✓ Passed MCQ</span>
                      </div>
                      <Progress
                        value={(result.mcqScore / 9) * 100}
                        className="h-2"
                      />
                    </div>

                    {/* Status message */}
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-body font-semibold text-sm text-blue-800 mb-1">
                            MCQ Passed! ({result.mcqScore}/9 correct)
                          </p>
                          <p className="font-body text-sm text-blue-700 leading-relaxed">
                            Your practical video has been submitted for admin
                            review. You will be notified in your bell when
                            approved or rejected.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-12 gap-2 font-body font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => navigate({ to: "/worker-dashboard" })}
                    >
                      {t("cert_go_dashboard")}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                /* Pass / Fail Card */
                <Card
                  className={`border-2 shadow-card overflow-hidden ${result.passed ? "border-green-300" : "border-orange-300"}`}
                >
                  {/* Result header */}
                  <div
                    className={`p-8 text-center ${
                      result.passed
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : "bg-gradient-to-br from-orange-400 to-orange-500"
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4"
                    >
                      {result.passed ? (
                        <Trophy className="w-10 h-10 text-white" />
                      ) : (
                        <AlertCircle className="w-10 h-10 text-white" />
                      )}
                    </motion.div>
                    <h2 className="font-display font-bold text-2xl text-white">
                      {result.passed
                        ? t("cert_passed_title")
                        : t("cert_failed")}
                    </h2>
                  </div>

                  <CardContent className="p-8 space-y-6">
                    {/* Score breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                        <p className="font-body text-xs text-muted-foreground mb-1">
                          {t("cert_score_label")}
                        </p>
                        <p className="font-display font-bold text-3xl text-foreground">
                          {result.mcqScore}
                          <span className="text-muted-foreground text-xl">
                            /9
                          </span>
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
                        <p className="font-body text-xs text-muted-foreground mb-1">
                          {t("cert_practical_label")}
                        </p>
                        <p
                          className={`font-display font-bold text-xl ${result.practicalPassed ? "text-green-600" : "text-orange-500"}`}
                        >
                          {result.practicalPassed
                            ? t("cert_practical_accepted")
                            : t("cert_failed")}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar for MCQ */}
                    <div>
                      <div className="flex justify-between font-body text-xs text-muted-foreground mb-2">
                        <span>{t("cert_score_label")}</span>
                        <span>{result.mcqScore}/9</span>
                      </div>
                      <Progress
                        value={(result.mcqScore / 9) * 100}
                        className="h-2"
                      />
                    </div>

                    {result.passed ? (
                      <div className="space-y-3">
                        <Button
                          className="w-full h-12 gap-2 font-body font-semibold text-base bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => navigate({ to: "/certificate" })}
                        >
                          <Trophy className="w-5 h-5" />
                          {t("cert_view_certificate")}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full font-body"
                          onClick={() => navigate({ to: "/worker-dashboard" })}
                        >
                          {t("cert_go_dashboard")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-center font-body text-sm text-orange-600 font-medium">
                          Need 6+ MCQ correct AND a practical video to pass.
                        </p>
                        <Button
                          className="w-full h-12 gap-2 font-body font-semibold"
                          onClick={() => {
                            setPhase("intro");
                            setCurrentQ(0);
                            setAnswers(Array(9).fill(null));
                            setPracticalFile(null);
                            setResult(null);
                          }}
                        >
                          {t("cert_retry")}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full font-body"
                          onClick={() => navigate({ to: "/worker-dashboard" })}
                        >
                          {t("cert_go_dashboard")}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

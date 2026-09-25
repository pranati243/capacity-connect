export type Lang = 'en' | 'hi'

const dict = {
  portalName: { en: 'CAPACITY CONNECT', hi: 'क्षमता कनेक्ट' },
  portalTagline: { en: 'Digital Capacity Building & Learning Management Portal', hi: 'डिजिटल क्षमता निर्माण एवं शिक्षण प्रबंधन पोर्टल' },
  ministry: { en: 'Ministry of Earth Sciences', hi: 'पृथ्वी विज्ञान मंत्रालय' },
  govt: { en: 'Government of India', hi: 'भारत सरकार' },
  skipToMain: { en: 'Skip to main content', hi: 'मुख्य सामग्री पर जाएं' },
  screenReader: { en: 'Screen Reader Access', hi: 'स्क्रीन रीडर एक्सेस' },
  darkMode: { en: 'Dark mode', hi: 'डार्क मोड' },
  textSize: { en: 'Text size', hi: 'पाठ आकार' },
  sitemap: { en: 'Sitemap', hi: 'साइटमैप' },
  login: { en: 'Login', hi: 'लॉग इन' },
  register: { en: 'Register', hi: 'पंजीकरण' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  myPortal: { en: 'My Portal', hi: 'मेरा पोर्टल' },
  whatsNew: { en: "What's New", hi: 'नया क्या है' },
  pause: { en: 'Pause', hi: 'रोकें' },
  play: { en: 'Play', hi: 'चलाएं' },

  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ' },
  navAbout: { en: 'About', hi: 'परिचय' },
  navCourses: { en: 'Courses', hi: 'पाठ्यक्रम' },
  navNotices: { en: 'Notice Board', hi: 'सूचना पट्ट' },
  navVerify: { en: 'Verify Certificate', hi: 'प्रमाणपत्र सत्यापन' },
  navHelp: { en: 'Help', hi: 'सहायता' },
  navDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  navProfile: { en: 'My Profile', hi: 'मेरी प्रोफ़ाइल' },
  navLibrary: { en: 'Trainer Library', hi: 'प्रशिक्षक पुस्तकालय' },
  navAssessments: { en: 'Assessments', hi: 'मूल्यांकन' },
  navCertificates: { en: 'Certificates', hi: 'प्रमाणपत्र' },
  navQuestionnaires: { en: 'Questionnaires', hi: 'प्रश्नावली' },
  navPerformance: { en: 'Trainee Performance', hi: 'प्रशिक्षु प्रदर्शन' },
  navApprovals: { en: 'User Approvals', hi: 'उपयोगकर्ता अनुमोदन' },
  navCourseMgmt: { en: 'Course Management', hi: 'पाठ्यक्रम प्रबंधन' },
  navCompetency: { en: 'Competency Map', hi: 'दक्षता मानचित्र' },
  navPublish: { en: 'Publish Content', hi: 'सामग्री प्रकाशन' },

  roleTrainee: { en: 'Trainee Portal', hi: 'प्रशिक्षु पोर्टल' },
  roleTrainer: { en: 'Trainer Portal', hi: 'प्रशिक्षक पोर्टल' },
  roleAdmin: { en: 'Administrator Portal', hi: 'प्रशासक पोर्टल' },

  heroTitle: { en: 'Building capacity for a weather-ready, climate-smart nation', hi: 'मौसम-तैयार, जलवायु-सजग राष्ट्र के लिए क्षमता निर्माण' },
  heroBody: {
    en: 'One portal for training, competency development and knowledge sharing across the Ministry of Earth Sciences and its institutions.',
    hi: 'पृथ्वी विज्ञान मंत्रालय एवं इसके संस्थानों में प्रशिक्षण, दक्षता विकास और ज्ञान साझा करने हेतु एक पोर्टल।',
  },
  getStarted: { en: 'Register Now', hi: 'अभी पंजीकरण करें' },
  services: { en: 'Services', hi: 'सेवाएं' },
  atAGlance: { en: 'Portal at a Glance', hi: 'पोर्टल एक नज़र में' },
  featuredCourses: { en: 'Featured Courses', hi: 'प्रमुख पाठ्यक्रम' },
  announcements: { en: 'Announcements', hi: 'घोषणाएं' },
  achievements: { en: 'Achievements', hi: 'उपलब्धियां' },
  newContent: { en: 'Newly Added Learning Content', hi: 'नई शिक्षण सामग्री' },
  viewAll: { en: 'View all', hi: 'सभी देखें' },

  footerAbout: {
    en: 'CAPACITY CONNECT supports organisational training, competency development and knowledge sharing for officers and staff.',
    hi: 'क्षमता कनेक्ट अधिकारियों एवं कर्मचारियों के लिए संगठनात्मक प्रशिक्षण, दक्षता विकास और ज्ञान साझाकरण में सहायता करता है।',
  },
  quickLinks: { en: 'Quick Links', hi: 'त्वरित लिंक' },
  policies: { en: 'Policies', hi: 'नीतियां' },
  contactUs: { en: 'Contact Us', hi: 'संपर्क करें' },
  contentOwned: {
    en: 'Content owned and maintained by the Ministry of Earth Sciences, Government of India.',
    hi: 'सामग्री का स्वामित्व एवं रखरखाव पृथ्वी विज्ञान मंत्रालय, भारत सरकार द्वारा।',
  },
  lastUpdated: { en: 'Last updated', hi: 'अंतिम अद्यतन' },
  prototypeNote: { en: 'Prototype for Smart India Hackathon 2026 (SIH26075)', hi: 'स्मार्ट इंडिया हैकथॉन 2026 (SIH26075) हेतु प्रोटोटाइप' },
} satisfies Record<string, Record<Lang, string>>

export type TKey = keyof typeof dict

export function translate(lang: Lang, key: TKey) {
  return dict[key][lang]
}

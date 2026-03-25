export type Language = 'en' | 'km';

export interface Translation {
  title: string;
  subtitle: string;
  codeGen: string;
  debugger: string;
  testGen: string;
  explainer: string;
  inputPlaceholder: string;
  generate: string;
  debug: string;
  test: string;
  explain: string;
  clear: string;
  copy: string;
  copied: string;
  rootCause: string;
  solution: string;
  stepByStep: string;
  loading: string;
  darkMode: string;
  lightMode: string;
  generalChat: string;
  preview: string;
  code: string;
  home: string;
  getStarted: string;
  askAiAnything: string;
  yourQuestion: string;
  getAnswer: string;
  tryItNow: string;
  forStudents: string;
  forEducators: string;
  poweredBy: string;
  codeGenerator: string;
  smartDebugging: string;
  codeExplanation: string;
  testGeneration: string;
  history: string;
  settings: string;
  profile: string;
  logout: string;
  newChat: string;
  recentChats: string;
  backToHome: string;
  continueToAsk: string;
  codeGenDescription: string;
  start: string;
  studentFeature1: string;
  studentFeature2: string;
  studentFeature3: string;
  studentFeature4: string;
  educatorFeature1: string;
  educatorFeature2: string;
  educatorFeature3: string;
  educatorFeature4: string;
  speak: string;
  stop: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    title: "FNB",
    subtitle: "I'm here to help you",
    codeGen: "Code Generator",
    debugger: "Smart Debugging",
    testGen: "Test Generation",
    explainer: "Code Explanation",
    inputPlaceholder: "ask anything here .......",
    generate: "Generate Code",
    debug: "Debug Code",
    test: "Generate Tests",
    explain: "Explain Code",
    clear: "Clear",
    copy: "Copy",
    copied: "Copied!",
    rootCause: "Root Cause",
    solution: "Solution",
    stepByStep: "Step-by-Step Breakdown",
    loading: "AI is thinking...",
    darkMode: "mode",
    lightMode: "mode",
    generalChat: "General Chat",
    preview: "Live Preview",
    code: "Code View",
    home: "General Chat",
    getStarted: "Get Started",
    askAiAnything: "Ask AI Anything",
    yourQuestion: "Your Question:",
    getAnswer: "Get Answer",
    tryItNow: "Try it now",
    forStudents: "FOR STUDENTS & DEVELOPERS",
    forEducators: "FOR EDUCATORS",
    poweredBy: "Powered by Groq & Gemini AI",
    codeGenerator: "Code Generator",
    smartDebugging: "Smart Debugging",
    codeExplanation: "Code Explanation",
    testGeneration: "Test Generation",
    history: "History",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    newChat: "New Chat",
    recentChats: "Recent Chats",
    backToHome: "Back to General Chat",
    continueToAsk: "Continue to ask...",
    codeGenDescription: "Debug and fix code errors efficiently",
    start: "Start",
    studentFeature1: "Debug and fix code errors efficiently",
    studentFeature2: "Understand complex algorithms step-by-step",
    studentFeature3: "Learn best practices and optimization",
    studentFeature4: "Get instant coding assistance 24/7",
    educatorFeature1: "Generate comprehensive documentation",
    educatorFeature2: "Create test cases for assignments",
    educatorFeature3: "Provide code examples and explanations",
    educatorFeature4: "Save time on content creation",
    speak: "Speak",
    stop: "Stop",
  },
  km: {
    title: "FNB",
    subtitle: "ខ្ញុំនៅទីនេះដើម្បីជួយអ្នក",
    codeGen: "អ្នកបង្កើតកូដ",
    debugger: "ការដោះស្រាយកំហុសឆ្លាតវៃ",
    testGen: "ការបង្កើតតេស្ត",
    explainer: "ការពន្យល់កូដ",
    inputPlaceholder: "សួរអ្វីក៏បាននៅទីនេះ .......",
    generate: "បង្កើតកូដ",
    debug: "កែសម្រួលកំហុស",
    test: "បង្កើតតេស្ត",
    explain: "ពន្យល់កូដ",
    clear: "សម្អាត",
    copy: "ចម្លង",
    copied: "បានចម្លង!",
    rootCause: "មូលហេតុឫសគល់",
    solution: "ដំណោះស្រាយ",
    stepByStep: "ការបំបែកជាជំហានៗ",
    loading: "AI កំពុងគិត...",
    darkMode: "របៀបងងឹត",
    lightMode: "របៀបភ្លឺ",
    generalChat: "ការជជែកទូទៅ",
    preview: "មើលផ្ទាល់",
    code: "មើលកូដ",
    home: "ការជជែកទូទៅ",
    getStarted: "ចាប់ផ្តើម",
    askAiAnything: "សួរ AI អ្វីក៏បាន",
    yourQuestion: "សំណួររបស់អ្នក៖",
    getAnswer: "ទទួលបានចម្លើយ",
    tryItNow: "សាកល្បងឥឡូវនេះ",
    forStudents: "សម្រាប់សិស្ស និងអ្នកអភិវឌ្ឍន៍",
    forEducators: "សម្រាប់អ្នកអប់រំ",
    poweredBy: "ដំណើរការដោយ Groq & Gemini AI",
    codeGenerator: "អ្នកបង្កើតកូដ",
    smartDebugging: "ការដោះស្រាយកំហុសឆ្លាតវៃ",
    codeExplanation: "ការពន្យល់កូដ",
    testGeneration: "ការបង្កើតតេស្ត",
    history: "ប្រវត្តិ",
    settings: "ការកំណត់",
    profile: "ប្រវត្តិរូប",
    logout: "ចាកចេញ",
    newChat: "ការជជែកថ្មី",
    recentChats: "ការជជែកថ្មីៗ",
    backToHome: "ត្រឡប់ទៅការជជែកទូទៅ",
    continueToAsk: "បន្តសួរ...",
    codeGenDescription: "កែសម្រួល និងជួសជុលកំហុសកូដប្រកបដោយប្រសិទ្ធភាព",
    start: "ចាប់ផ្តើមភាគ",
    studentFeature1: "ដោះស្រាយ និងជួសជុលកំហុសកូដប្រកបដោយប្រសិទ្ធភាព",
    studentFeature2: "ស្វែងយល់ពីអាល់ហ្គោរីតដែលស្មុគស្មាញជាជំហានៗ",
    studentFeature3: "រៀនពីការអនុវត្តល្អបំផុត និងការបង្កើនប្រសិទ្ធភាព",
    studentFeature4: "ទទួលបានជំនួយការសរសេរកូដភ្លាមៗ ២៤/៧",
    educatorFeature1: "បង្កើតឯកសារណែនាំដ៏ទូលំទូលាយ",
    educatorFeature2: "បង្កើតតេស្តសាកល្បងសម្រាប់កិច្ចការ",
    educatorFeature3: "ផ្តល់ឧទាហរណ៍កូដ និងការពន្យល់",
    educatorFeature4: "សន្សំសំចៃពេលវេលាក្នុងការបង្កើតមាតិកា",
    speak: "អាន",
    stop: "បញ្ឈប់",
  }
};

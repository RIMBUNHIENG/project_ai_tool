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
}

export const translations: Record<Language, Translation> = {
  en: {
    title: "FNB AI PRO",
    subtitle: "AI-Powered Code Assistant for Learning & Development",
    codeGen: "Code Generation",
    debugger: "Smart Debugging",
    testGen: "Test Generation",
    explainer: "Code Explanation",
    inputPlaceholder: "Describe your idea here , Agent will bring it to life .....",
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
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    generalChat: "General Chat",
    preview: "Live Preview",
    code: "Code View",
    home: "General Chat",
    getStarted: "Get Started",
    askAiAnything: "Ask AI Anything",
    yourQuestion: "Your Question:",
    getAnswer: "Get Answer",
    tryItNow: "Try it now",
    forStudents: "For Students & Developers",
    forEducators: "For Educators",
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
    codeGenDescription: "Translates natural language prompts into functional code in multiple programming language, and more. Includes inline comments and explanations.",
  },
  km: {
    title: "FNB AI PRO",
    subtitle: "ជំនួយការកូដ AI សម្រាប់ការរៀន និងការអភិវឌ្ឍន៍",
    codeGen: "ការបង្កើតកូដ",
    debugger: "ការកែសម្រួលកំហុសវៃឆ្លាត",
    testGen: "ការបង្កើតតេស្ត",
    explainer: "ការពន្យល់កូដ",
    inputPlaceholder: "រៀបរាប់ពីគំនិតរបស់អ្នកនៅទីនេះ ភ្នាក់ងារនឹងនាំវាឱ្យមានជីវិត .....",
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
    smartDebugging: "ការកែសម្រួលកំហុសវៃឆ្លាត",
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
    codeGenDescription: "បកប្រែការណែនាំភាសាធម្មជាតិទៅជាកូដមុខងារក្នុងភាសាកម្មវិធីជាច្រើន និងច្រើនទៀត។ រួមបញ្ចូលមតិយោបល់ក្នុងជួរ និងការពន្យល់។",
  }
};

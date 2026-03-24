import { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Bug, 
  TestTube2, 
  BookOpen, 
  Send, 
  Trash2, 
  Loader2, 
  Sparkles,
  Cpu,
  Eye,
  Code,
  MessageSquare,
  Sun,
  Moon,
  Languages,
  ArrowRight,
  Home,
  CheckCircle2,
  LayoutDashboard,
  History,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  Monitor,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
// import { GoogleGenAI } from "@google/genai";

import { Language, translations } from './constants';
import LanguageToggle from './components/LanguageToggle';
import FeatureCard from './components/FeatureCard';
import FeatureGridCard from './components/FeatureGridCard';
import CodeBlock from './components/CodeBlock';
import InteractiveBackground from './components/InteractiveBackground';
import SplashScreen from './components/SplashScreen';
import CurlyCursor from './components/CurlyCursor';
import CopyButton from './components/CopyButton';

type Tab = 'home' | 'chat' | 'generate' | 'debug' | 'test' | 'explain';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [recentChats, setRecentChats] = useState<{title: string, input: string, output: string, tab: Tab}[]>([]);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', parts: {text: string}[]}[]>([]);
  const [isContinuing, setIsContinuing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const t = translations[language];
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isUIRequest = (text: string) => {
    const uiKeywords = ['ui', 'component', 'template', 'page', 'button', 'card', 'layout', 'react', 'vue', 'html', 'css', 'design', 'style', 'interface', 'dashboard', 'landing', 'navbar', 'footer', 'form', 'modal', 'sidebar', 'grid', 'flex', 'tailwind', 'animation', 'transition', 'responsive', 'mobile', 'desktop', 'view', 'screen', 'widget', 'app', 'website', 'site'];
    const lowerText = text.toLowerCase();
    return uiKeywords.some(keyword => lowerText.includes(keyword));
  };

  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  const showPreviewOption = activeTab === 'generate' && isUIRequest(lastUserMessage);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleAIAction = async () => {
    if (!input.trim() || isLoading) return;

    // If we are on home, switch to chat tab so the user sees the full interface
    if (activeTab === 'home') {
      setActiveTab('chat');
    }

    setIsLoading(true);
    const currentInput = input.trim();
    setInput(''); // Clear input immediately for better UX
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: Date.now()
    };

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    // If not continuing, clear history and start fresh
    if (!isContinuing) {
      setChatHistory([]);
      setMessages([userMsg, assistantMsg]);
      setOutput(''); // Clear output as we use messages now
    } else {
      setMessages(prev => [...prev, userMsg, assistantMsg]);
    }
    
    setViewMode('code');
    
    try {
      let systemPrompt = `You are FNB AI PRO, an expert coding assistant and mentor. 
      Current language: ${language === 'en' ? 'English' : 'Khmer'}. 
      Respond in ${language === 'en' ? 'English' : 'Khmer'}.
      Theme: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}.`;

      const feature = activeTab === 'home' ? 'chat' : activeTab;

      if (feature === 'chat') {
        systemPrompt += `
You are an expert assistant. You can handle both general knowledge questions and complex technical/coding tasks. Follow these guidelines:

## Core Response Principles
- **Directness:** Answer the user's request directly. If they ask for "python list exercise", give them Python code exercises, not a React dashboard.
- **No Over-Engineering:** Do NOT wrap simple code snippets or exercises in complex UI components, dashboards, or templates unless the user explicitly asks for a "UI", "Dashboard", "Template", or "App".
- **Context Awareness:** If the user is in the "Code Generator" tab, focus on generating high-quality, functional code.

## Handling Different Request Types

### 1. General Knowledge Questions (Non-Coding)
- If the user asks about general topics, provide a **modern, detailed, and clear** response.
- **CRITICAL:** Do NOT include any code examples, snippets, or technical jargon unless specifically relevant to the topic.

### 2. Technical and Coding Questions
- If the user asks about programming, provide a comprehensive response with code examples.
- **Code Exercises:** If asked for exercises, provide the problem statement, starter code, and solution in separate markdown code blocks.

## Code Output Format
- ALWAYS wrap code in markdown code blocks with language identifier (e.g., \`\`\`jsx, \`\`\`python, \`\`\`html)
- Provide complete, runnable code examples when possible
- Include imports, dependencies, and basic setup instructions
- Add brief comments for complex logic

## Modern Framework Standards

### React (Functional Components)
- Use React 18+ patterns with hooks (useState, useEffect, useContext, useMemo, useCallback)
- Prefer TypeScript with proper type definitions
- Use Tailwind CSS for styling unless user specifies otherwise
- Implement proper error boundaries
- Show loading states and error handling
- Use react-router-dom v6 for navigation
- Structure: Component file organization, custom hooks for reusable logic

### Vue.js
- Support both Options API and Composition API (prefer Composition API with <script setup>)
- Use Pinia for state management when needed
- Include proper scoped styling
- Show reactive patterns (ref, reactive, computed)

### General Web Standards
- Follow WCAG 2.1 accessibility guidelines (semantic HTML, ARIA labels, keyboard navigation)
- Responsive design (mobile-first approach)
- Progressive enhancement
- Performance optimization (lazy loading, code splitting)

## Response Structure

### For Code Requests
1. **Brief explanation** of the approach (2-3 sentences)
2. **Complete code** with proper formatting
3. **Key concepts** explained (if complex)
4. **Potential improvements** or alternatives
5. **Usage instructions** (setup steps, dependencies)

### For Technical Questions
- Provide clear, concise explanations
- Include code examples to illustrate concepts
- Compare approaches when relevant (pros/cons)
- Link to official documentation when helpful

## Interaction Style
- **Ask clarifying questions** when requirements are ambiguous (but make reasonable assumptions first)
- **Explain your reasoning** for architectural decisions
- **Suggest best practices** without being pedantic
- **Handle edge cases** gracefully (empty states, errors, async operations)
- **Consider security implications** (XSS prevention, sanitization, authentication patterns)

## Quality Standards
- All code must be production-ready (no console.logs in final code unless debugging)
- Include error handling for async operations
- Provide fallbacks for unsupported features
- Use semantic naming conventions
- Follow framework-specific style guides

## Additional Considerations
- If a user asks for a "full stack" solution, suggest appropriate backend patterns (Node.js, Python, etc.)
- For complex apps, mention deployment considerations
- When appropriate, suggest testing strategies (Jest, Vitest, Cypress)
- Keep responses focused and actionable

## When to Keep It Simple
- If the user explicitly asks for a simple solution
- For learning/educational contexts, provide clear, well-commented code
- For prototypes, mention what would need to be production-hardened
`;
      } else if (feature === 'generate') {
        systemPrompt += `
Task: You are an expert UI/UX Engineer and Frontend Developer. Generate high-quality, professional, and modern UI components or full page layouts based on the user's description.

Guidelines:
1. **Framework & Language Agnostic**: Default to **React (JSX/TSX)** with **Tailwind CSS** if no framework is specified. HOWEVER, you MUST strictly follow the user's requested language or framework (e.g., plain HTML/CSS/JS, Vue, Svelte, Angular, Python, Flutter, etc.) if they mention one.
2. **Code Blocks**: ALWAYS wrap your code in appropriate markdown code blocks with the correct language identifier (e.g., \`\`\`jsx, \`\`\`html, \`\`\`css, \`\`\`vue).
3. **Self-Contained Code**: Whenever possible, provide a complete, self-contained implementation in ONE code block so it can be easily copied and previewed. If multiple files (like index.html, style.css, script.js) are explicitly needed, separate them clearly into sequential code blocks.
4. **Modern Design Aesthetics**: Apply elegant typography (Inter/system-ui), generous whitespace, refined shadows, and smooth transitions. Incorporate modern UI trends like glassmorphism, bento grids, or minimalist styling where appropriate.
5. **Responsiveness & Accessibility**: Ensure all components and layouts are fully responsive (mobile-first approach) and adhere to WCAG accessibility standards (semantic HTML, ARIA attributes).
6. **Icons & Assets**: Use modern icon libraries (e.g., Lucide React, FontAwesome) or provide clean inline SVGs. For images, use high-quality Unsplash placeholders (e.g., \`https://images.unsplash.com/photo-...\`).
7. **Best Practices**: Ensure the code is production-ready, clean, well-commented, and follows the idiomatic best practices of the chosen framework. Use functional components and hooks for React, and Composition API for Vue.
8. **Explanation**: Provide a brief, professional explanation of the architectural approach, key stylistic choices, and any necessary usage or setup instructions below the code.
`;
      } else if (feature === 'debug') {
        systemPrompt += `
Task: Analyze the provided code for errors, bugs, or performance issues.
Guidelines:
1. Identify the root cause of the problem clearly.
2. Provide a step-by-step explanation of why the error occurred.
3. Provide the corrected, optimized version of the code.
4. Suggest best practices to avoid similar issues in the future.
5. Use code blocks for all code snippets.
`;
      } else if (feature === 'test') {
        systemPrompt += `
Task: Generate comprehensive unit tests for the provided code.
Guidelines:
1. Use appropriate frameworks based on the language (e.g., Jest/Vitest for JS/TS, PyTest for Python).
2. Include edge cases, error handling, and positive/negative scenarios.
3. Ensure the tests are easy to read and follow standard testing patterns.
4. Provide a brief explanation of the test coverage.
`;
      } else if (feature === 'explain') {
        systemPrompt += `
Task: Provide a detailed, step-by-step breakdown of the code snippet.
Guidelines:
1. Explain the purpose of each function, class, and logic block.
2. Use simple, clear language that a beginner can understand.
3. Highlight any complex or interesting parts of the code.
4. Use markdown formatting (bolding, lists) to make the explanation easy to scan.
`;
      }

      // Prepare contents with history if continuing
      const currentMessage = { role: 'user' as const, parts: [{ text: currentInput }] };
      const contents = isContinuing ? [...chatHistory, currentMessage] : [currentMessage];
      
      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...contents.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts[0].text
        }))
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: groqMessages,
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to API');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') break;
              if (!dataStr) continue;

              try {
                const data = JSON.parse(dataStr);
                if (data.error) throw new Error(data.error);
                if (data.content) {
                  fullText += data.content;
                  setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastMsg = newMsgs[newMsgs.length - 1];
                    if (lastMsg && lastMsg.role === 'assistant') {
                      lastMsg.content = fullText;
                    }
                    return newMsgs;
                  });
                  setOutput(fullText); // Keep output for preview extraction
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        }
      }

      // Update history
      const modelResponse = { role: 'model' as const, parts: [{ text: fullText }] };
      setChatHistory(prev => [...prev, currentMessage, modelResponse]);
      setIsContinuing(false); // Reset after action

      // Add to recent chats
      const title = currentInput.split('\n')[0].substring(0, 35) + (currentInput.length > 35 ? '...' : '');
      setRecentChats(prev => {
        const filtered = prev.filter(c => c.title !== title);
        // For recent chats, we still store a flattened version for simplicity or we could store messages
        const finalOutput = isContinuing ? output + fullText : `**User:** ${currentInput}\n\n---\n\n${fullText}`;
        return [{ title, input: currentInput, output: finalOutput, tab: activeTab === 'home' ? 'chat' : activeTab }, ...filtered].slice(0, 10);
      });
    } catch (error) {
      console.error("AI Error:", error);
      setOutput("Error: Failed to connect to AI. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAIAction();
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const extractCode = (markdown: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    let hasReact = false;
    let hasVue = false;
    
    const blocks: {lang: string, code: string}[] = [];
    while ((match = codeBlockRegex.exec(markdown)) !== null) {
      blocks.push({ lang: (match[1] || '').toLowerCase(), code: match[2] });
    }

    // Fallback: if no blocks but text looks like code
    if (blocks.length === 0 && markdown.trim().length > 50) {
      const trimmed = markdown.trim();
      if (trimmed.includes('import React') || trimmed.includes('<div') || trimmed.includes('function ') || trimmed.includes('const ')) {
        blocks.push({ lang: 'jsx', code: trimmed });
      } else if (trimmed.includes('Vue.createApp') || trimmed.includes('<template>')) {
        blocks.push({ lang: 'html', code: trimmed });
      }
    }

    if (blocks.length === 0) {
      return { code: '', hasReact: false, hasVue: false };
    }

    let scripts = '';
    let styles = '';
    let html = '';

    blocks.forEach(block => {
      let { lang, code } = block;
      
      // Detect React content
      const isReact = lang === 'jsx' || lang === 'tsx' || code.includes('import React') || code.includes('useState') || code.includes('useEffect');
      // Detect Vue content
      const isVue = lang === 'vue' || code.includes('Vue.createApp') || code.includes('<template>') || code.includes('export default {');
      
      if (isReact) {
        hasReact = true;
        // Clean up React code for browser-side Babel
        code = code.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]lucide-react['"];?/g, (match, p1) => {
          return `const { ${p1} } = window.LucideReact;`;
        });
        code = code.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]framer-motion['"];?/g, (match, p1) => {
          return `const { ${p1} } = window.framerMotion;`;
        });
        code = code.replace(/import\s+\{([\s\S]*?)\}\s+from\s+['"]react-router-dom['"];?/g, (match, p1) => {
          return `const { ${p1} } = window.ReactRouterDom;`;
        });
        code = code.replace(/import\s+[\s\S]*?from\s+['"].*?['"];?/g, '');
        code = code.replace(/export\s+default\s+/g, '');
        code = code.replace(/export\s+(?:const|function|class)\s+/g, (m) => m.replace('export ', ''));
        scripts += `\n${code}\n`;
      } else if (isVue) {
        hasVue = true;
        if (code.includes('<template>')) {
          const templateMatch = /<template>([\s\S]*?)<\/template>/.exec(code);
          const scriptMatch = /<script.*?>([\s\S]*?)<\/script>/.exec(code);
          const styleMatch = /<style.*?>([\s\S]*?)<\/style>/.exec(code);
          
          if (templateMatch) html += `\n<div id="app-template" style="display:none;">${templateMatch[1]}</div>\n`;
          if (scriptMatch) {
            let sCode = scriptMatch[1].replace(/export\s+default\s+/, 'const vueOptions = ');
            scripts += `\n${sCode}\n`;
          }
          if (styleMatch) styles += `\n${styleMatch[1]}\n`;
        } else {
          scripts += `\n${code}\n`;
        }
      } else if (lang === 'css') {
        styles += `\n${code}\n`;
      } else if (lang === 'js' || lang === 'javascript') {
        scripts += `\n${code}\n`;
      } else if (lang === 'html' || code.includes('<div') || code.includes('<section') || code.includes('<html')) {
        html += `\n${code}\n`;
      } else {
        if (code.includes('<style')) {
          styles += `\n${code.replace(/<\/?style>/g, '')}\n`;
        } else if (code.includes('<script')) {
          scripts += `\n${code.replace(/<\/?script.*?>/g, '')}\n`;
        } else {
          html += `\n${code}\n`;
        }
      }
    });

    let combinedContent = '';
    if (hasReact) {
      const componentNames = [...scripts.matchAll(/(?:function|class|const)\s+([A-Z]\w*)/g)].map(m => m[1]);
      const mainComponent = componentNames.find(name => name === 'App') || componentNames[0] || 'App';
      
      scripts = scripts.replace(/ReactDOM\.render[\s\S]*?;/g, '');
      scripts = scripts.replace(/ReactDOM\.createRoot[\s\S]*?\.render[\s\S]*?;/g, '');
      
      scripts += `\n
        try {
          const rootElement = document.getElementById('root');
          if (rootElement) {
            const root = ReactDOM.createRoot(rootElement);
            root.render(<${mainComponent} />);
            setTimeout(() => {
              if (window.lucide) window.lucide.createIcons();
            }, 100);
          }
        } catch (e) {
          console.error('Render error:', e);
          document.body.innerHTML += '<div style="color:red;padding:20px;">Render Error: ' + e.message + '</div>';
        }
      `;
      combinedContent = `<style>${styles}</style>${html}<script type="text/babel">${scripts}<\/script>`;
    } else if (hasVue) {
      scripts += `\n
        try {
          const { createApp } = Vue;
          const options = typeof vueOptions !== 'undefined' ? vueOptions : {};
          if (document.getElementById('app-template')) {
            options.template = document.getElementById('app-template').innerHTML;
          }
          createApp(options).mount('#root');
        } catch (e) {
          console.error('Vue Render error:', e);
        }
      `;
      combinedContent = `<style>${styles}</style>${html}<script>${scripts}<\/script>`;
    } else {
      combinedContent = `<style>${styles}</style>${html}<script>${scripts}<\/script>`;
    }
    
    return { code: combinedContent, hasReact, hasVue };
  };

  const getPreviewContent = () => {
    const { code, hasReact, hasVue } = extractCode(output);
    // If no code found, show a friendly message
    if (!code.trim()) {
      return `
        <body style="display:flex;align-items:center;justify-content:center;height:100vh;color:#52525b;font-family:sans-serif;background:#09090b;">
          <div style="text-align:center;">
            <p style="font-size:0.875rem;">No previewable code found in the response.</p>
          </div>
        </body>
      `;
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                  },
                },
              },
            }
          </script>
          ${hasReact ? `
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://unpkg.com/lucide@latest"></script>
          <script>
            // Global error handler
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              const errorDiv = document.createElement('div');
              errorDiv.style.cssText = 'color:#ef4444;padding:20px;background:#18181b;border:1px solid #ef4444;border-radius:8px;margin:20px;font-family:monospace;font-size:12px;white-space:pre-wrap;';
              errorDiv.innerHTML = '<strong>Preview Error:</strong><br/>' + msg + (lineNo ? '<br/>Line: ' + lineNo : '');
              document.body.appendChild(errorDiv);
              return false;
            };

            // Mock lucide-react for the preview environment
            window.LucideReact = new Proxy({}, {
              get: (target, name) => {
                return (props) => {
                  const iconName = name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
                  return React.createElement('i', { 
                    ...props, 
                    'data-lucide': iconName,
                    style: { 
                      display: 'inline-block', 
                      width: props.size || 24, 
                      height: props.size || 24,
                      ...props.style 
                    } 
                  });
                };
              }
            });
            // Also mock common imports
            window.framerMotion = { motion: { div: 'div', section: 'section', button: 'button', h1: 'h1', h2: 'h2', p: 'p', span: 'span' } };
            
            // Mock react-router-dom
            window.ReactRouterDom = {
              BrowserRouter: ({ children }) => React.createElement('div', null, children),
              Routes: ({ children }) => React.createElement('div', null, children),
              Route: () => null,
              Link: ({ to, children, ...props }) => React.createElement('a', { ...props, href: '#', onClick: (e) => e.preventDefault() }, children),
              NavLink: ({ to, children, ...props }) => React.createElement('a', { ...props, href: '#', onClick: (e) => e.preventDefault() }, children),
              useNavigate: () => () => {},
              useLocation: () => ({ pathname: '/' }),
              useParams: () => ({}),
            };
            // Expose Link globally as it's a very common error
            window.Link = window.ReactRouterDom.Link;
          </script>
          ` : ''}
          ${hasVue ? `
          <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
          ` : ''}
          <style>
            body { 
              background-color: #09090b; 
              color: white; 
              margin: 0; 
              padding: 0; 
              min-height: 100vh; 
              font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; 
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: #18181b; }
            ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #52525b; }
          </style>
        </head>
        <body>
          <div id="root">${hasReact || hasVue ? '' : code}</div>
          ${hasReact || hasVue ? code : ''}
        </body>
      </html>
    `;
  };

  return (
    <div className={`h-screen flex overflow-hidden font-sans transition-colors duration-300 ${theme} ${theme === 'dark' ? 'bg-brand-bg text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen 
            key="splash" 
            theme={theme} 
            onComplete={() => setShowSplash(false)} 
          />
        )}
      </AnimatePresence>

      <InteractiveBackground theme={theme as 'light' | 'dark'} />
      <CurlyCursor />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel transition-transform duration-300 transform lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200/60'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className={`p-6 flex items-center gap-3 border-b ${theme === 'dark' ? 'border-slate-800/50' : 'border-slate-200/60'}`}>
            <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              <Code2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.title}</h1>
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>PRO VERSION</p>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 custom-scrollbar">
            <button
              onClick={() => { 
                setInput(''); 
                setOutput(''); 
                setChatHistory([]);
                setMessages([]);
                setIsContinuing(false);
                setActiveTab('home'); 
                setIsSidebarOpen(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-accent text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-accent-hover transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-4"
            >
              <Plus size={16} />
              {t.newChat}
            </button>

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1"
            >
              {[
                { id: 'home', label: t.home, icon: Home },
                { id: 'generate', label: t.codeGenerator, icon: Code2 },
                { id: 'debug', label: t.smartDebugging, icon: Bug },
                { id: 'explain', label: t.codeExplanation, icon: BookOpen },
                { id: 'test', label: t.testGeneration, icon: TestTube2 },
              ].map((tab) => (
                <motion.div
                  key={tab.id}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    show: { opacity: 1, x: 0 }
                  }}
                >
                  <FeatureCard
                    icon={tab.icon}
                    title={tab.label}
                    isActive={activeTab === tab.id}
                    onClick={() => { 
                      if (activeTab !== tab.id) {
                        setInput('');
                        setOutput('');
                        setChatHistory([]);
                        setMessages([]);
                        setIsContinuing(false);
                      }
                      setActiveTab(tab.id as Tab); 
                      setIsSidebarOpen(false); 
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-8">
              <p className={`px-4 text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'} mb-4`}>{t.recentChats}</p>
              <div className="flex flex-col gap-1">
                {recentChats.filter(c => c.tab === (activeTab === 'home' ? 'chat' : activeTab)).length === 0 ? (
                  <p className={`px-4 text-[10px] italic ${theme === 'dark' ? 'text-slate-700' : 'text-slate-400'}`}>No recent {activeTab === 'home' ? 'chats' : activeTab}s</p>
                ) : (
                  recentChats
                    .filter(c => c.tab === (activeTab === 'home' ? 'chat' : activeTab))
                    .map((chat, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setInput(chat.input);
                          setOutput(chat.output);
                          setActiveTab(chat.tab);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all text-left truncate ${theme === 'dark' ? 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                      >
                        <MessageSquare size={14} className="shrink-0" />
                        <span className="truncate">{chat.title}</span>
                      </button>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Header */}
        <header className={`h-16 border-b flex items-center justify-between px-6 backdrop-blur-md ${theme === 'dark' ? 'bg-brand-bg/50 border-slate-800/50' : 'bg-white/80 border-slate-200/60'}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg transition-colors lg:hidden ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <LayoutDashboard size={16} className="hidden sm:block" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Dashboard</span>
              <span className={`hidden sm:block ${theme === 'dark' ? 'text-slate-700' : 'text-slate-300'}`}>/</span>
              <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{activeTab}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle current={language} onToggle={setLanguage} />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16"
            >
              {/* Hero Section */}
              <motion.section 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center flex flex-col items-center gap-6 relative"
              >
                <div className="absolute top-0 right-0 pointer-events-none opacity-50">
                  <div className="flex flex-col gap-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex gap-2">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className={`w-2 h-2 rounded-full ${Math.random() > 0.7 ? 'bg-brand-accent' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles size={12} />
                  {t.poweredBy}
                </div>
                
                <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {t.title}
                </h2>
                <p className={`text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.subtitle}
                </p>
                
                <button 
                  onClick={() => {
                    const chatSection = document.getElementById('home-chat-section');
                    if (chatSection) {
                      chatSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-brand-accent text-white font-bold uppercase tracking-widest hover:bg-brand-accent-hover transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                >
                  {t.getStarted}
                  <ArrowRight size={18} />
                </button>
              </motion.section>

              {/* Chat Interface (Ask AI Anything) */}
              <motion.section 
                id="home-chat-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl mx-auto w-full"
              >
                <div className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${theme === 'dark' ? 'bg-brand-card border-slate-800' : 'bg-white border-slate-200'}`}>
                  <div className={`p-6 border-b flex items-center gap-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t.askAiAnything}</h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Get instant answers to your coding questions</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t.yourQuestion}</label>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t.inputPlaceholder}
                        className={`w-full h-32 border rounded-xl p-4 text-sm focus:outline-none focus:border-brand-accent/50 transition-all resize-none ${theme === 'dark' ? 'bg-slate-950/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-[10px] italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Press Ctrl+Enter to submit</p>
                      <button
                        onClick={handleAIAction}
                        disabled={isLoading || !input.trim()}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-xs font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {isLoading ? (language === 'en' ? 'Sending...' : 'កំពុងផ្ញើ...') : t.getAnswer}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Output for Home Chat */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-6 border rounded-2xl p-6 shadow-xl flex items-center gap-4 ${theme === 'dark' ? 'bg-brand-card border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                            className="w-2 h-2 rounded-full bg-brand-accent"
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI is thinking...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 border rounded-2xl p-6 shadow-xl ${theme === 'dark' ? 'bg-brand-card border-slate-800' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-brand-accent">
                        <Sparkles size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Conversation</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Preview removed from general chat as per request */}
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {/* Preview removed from general chat as per request */}
                      <div className="flex flex-col gap-8">
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              {msg.role === 'user' ? (
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                                  <div className="flex items-center gap-2 mb-1 opacity-50">
                                    <User size={12} />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">You</span>
                                  </div>
                                  {msg.content}
                                </div>
                              ) : (
                                <div className="w-full">
                                  <div className="flex items-center gap-2 mb-4 opacity-50">
                                    <div className="p-1 rounded bg-brand-accent/20 text-brand-accent">
                                      <Cpu size={12} />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold">FNB AI PRO</span>
                                  </div>
                                  <div className="markdown-body">
                                    <ReactMarkdown
                                      components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                          const match = /language-(\w+)/.exec(className || '');
                                          return !inline && match ? (
                                            <CodeBlock
                                              code={String(children).replace(/\n$/, '')}
                                              language={match[1]}
                                            />
                                          ) : (
                                            <code className={className} {...props}>
                                              {children}
                                            </code>
                                          );
                                        }
                                      }}
                                    >
                                      {msg.content}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />

                          {!isLoading && messages.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 pt-8 border-t border-slate-800/50"
                            >
                              <button
                                onClick={() => {
                                  setIsContinuing(true);
                                  inputRef.current?.focus();
                                  inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className="flex items-center gap-2 text-brand-accent hover:text-brand-accent-hover transition-colors group"
                              >
                                <div className="p-2 rounded-full bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors">
                                  <Plus size={16} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{t.continueToAsk}</span>
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
              </motion.section>

              {/* Feature Grid */}
              <motion.section 
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <FeatureGridCard 
                  icon={Code2}
                  title={t.codeGenerator}
                  description={t.codeGenDescription}
                  iconColor="bg-blue-500"
                  onClick={() => { setInput(''); setOutput(''); setChatHistory([]); setIsContinuing(false); setActiveTab('generate'); }}
                  tryItNowLabel={t.tryItNow}
                />
                <FeatureGridCard 
                  icon={Bug}
                  title={t.smartDebugging}
                  description="Identify and fix errors with AI assistance"
                  iconColor="bg-pink-500"
                  onClick={() => { setInput(''); setOutput(''); setChatHistory([]); setIsContinuing(false); setActiveTab('debug'); }}
                  tryItNowLabel={t.tryItNow}
                />
                <FeatureGridCard 
                  icon={BookOpen}
                  title={t.codeExplanation}
                  description="Understand complex code step-by-step"
                  iconColor="bg-purple-500"
                  onClick={() => { setInput(''); setOutput(''); setChatHistory([]); setIsContinuing(false); setActiveTab('explain'); }}
                  tryItNowLabel={t.tryItNow}
                />
                <FeatureGridCard 
                  icon={TestTube2}
                  title={t.testGeneration}
                  description="Automatically create comprehensive test cases"
                  iconColor="bg-emerald-500"
                  onClick={() => { setInput(''); setOutput(''); setChatHistory([]); setIsContinuing(false); setActiveTab('test'); }}
                  tryItNowLabel={t.tryItNow}
                />
              </motion.section>

              {/* Info Sections */}
              <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className={`border rounded-2xl p-8 transition-colors ${theme === 'dark' ? 'bg-brand-card/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-6">{t.forStudents}</h4>
                  <ul className="flex flex-col gap-4">
                    {[
                      "Debug and fix code errors efficiently",
                      "Understand complex algorithms step-by-step",
                      "Learn best practices and optimization",
                      "Get instant coding assistance 24/7"
                    ].map((item, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        <CheckCircle2 size={16} className="text-brand-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`border rounded-2xl p-8 transition-colors ${theme === 'dark' ? 'bg-brand-card/50 border-brand-accent/20' : 'bg-white border-brand-accent/20 shadow-sm'}`}>
                  <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-6">{t.forEducators}</h4>
                  <ul className="flex flex-col gap-4">
                    {[
                      "Generate comprehensive documentation",
                      "Create test cases for assignments",
                      "Provide code examples and explanations",
                      "Save time on content creation"
                    ].map((item, i) => (
                      <li key={i} className={`flex items-center gap-3 text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        <CheckCircle2 size={16} className="text-brand-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6 lg:h-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-bold uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {activeTab === 'generate' ? t.codeGenerator : 
                     activeTab === 'debug' ? t.smartDebugging : 
                     activeTab === 'explain' ? t.codeExplanation : 
                     activeTab === 'test' ? t.testGeneration : 
                     activeTab === 'chat' ? t.askAiAnything : t.codeGenerator}
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {activeTab === 'generate' ? "Generate high-quality code from descriptions" : 
                     activeTab === 'debug' ? "Find and fix bugs in your code" : 
                     activeTab === 'explain' ? "Get a detailed breakdown of your code" : 
                     activeTab === 'test' ? "Create unit tests for your functions" : 
                     activeTab === 'chat' ? "Get instant answers to your coding questions" : "Transform natural language into functional code"}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {t.backToHome}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:flex-1 lg:min-h-0">
                {/* Input Area */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex-1 flex flex-col gap-4">
                      <div className="flex-1 relative min-h-[400px]">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t.inputPlaceholder}
                          className={`w-full h-full border rounded-2xl p-6 text-sm font-mono focus:outline-none focus:border-brand-accent/50 transition-all resize-none ${theme === 'dark' ? 'bg-brand-card border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm'}`}
                        />
                         <div className="absolute bottom-4 right-4 flex items-center gap-2">
                          {input && <CopyButton text={input} className={`${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`} />}
                          <button
                            onClick={() => setInput('')}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        <button
                          onClick={handleAIAction}
                          disabled={isLoading || !input.trim()}
                          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-brand-accent text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-accent-hover transition-all disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                          {activeTab === 'generate' ? t.generate : 
                           activeTab === 'debug' ? t.debug : 
                           activeTab === 'explain' ? t.explain : 
                           activeTab === 'test' ? t.test : 
                           activeTab === 'chat' ? t.getAnswer : t.generate}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className={`lg:col-span-7 flex flex-col border rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-brand-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className={`px-6 py-3 border-b flex items-center justify-between ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-2 text-brand-accent">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI Response</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {output && showPreviewOption && (
                        <div className={`flex items-center rounded-lg p-1 border ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
                          <button
                            onClick={() => setViewMode('code')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                              viewMode === 'code' ? (theme === 'dark' ? 'bg-slate-800 text-brand-accent' : 'bg-slate-100 text-brand-accent') : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {t.code}
                          </button>
                          <button
                            onClick={() => setViewMode('preview')}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                              viewMode === 'preview' ? (theme === 'dark' ? 'bg-slate-800 text-brand-accent' : 'bg-slate-100 text-brand-accent') : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {t.preview}
                          </button>
                        </div>
                      )}
                      {viewMode === 'preview' && output && showPreviewOption && (
                        <button 
                          onClick={() => {
                            const iframe = document.querySelector('iframe');
                            if (iframe) (iframe as any).srcDoc = getPreviewContent();
                          }}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                          title="Refresh Preview"
                        >
                          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto custom-scrollbar" ref={outputRef}>
                    {messages.length > 0 ? (
                      viewMode === 'preview' && showPreviewOption ? (
                        <div className="h-full flex flex-col gap-4">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {isLoading ? 'Live Syncing...' : 'Preview Ready'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setPreviewDevice('desktop')}
                                className={`p-1.5 rounded transition-colors ${previewDevice === 'desktop' ? 'bg-brand-accent/20 text-brand-accent' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                <Monitor size={14} />
                              </button>
                              <button 
                                onClick={() => setPreviewDevice('mobile')}
                                className={`p-1.5 rounded transition-colors ${previewDevice === 'mobile' ? 'bg-brand-accent/20 text-brand-accent' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                <Smartphone size={14} />
                              </button>
                            </div>
                          </div>
                          <div className={`flex-1 relative rounded-xl overflow-hidden border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} transition-all duration-300 ${previewDevice === 'mobile' ? 'max-w-[375px] mx-auto shadow-2xl' : 'w-full'}`}>
                            <iframe
                              srcDoc={getPreviewContent()}
                              className={`w-full h-full min-h-[400px] border-none ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`}
                              title="Live Preview"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-8">
                          {messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex flex-col gap-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              {msg.role === 'user' ? (
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm relative group ${theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                                  <div className="flex items-center justify-between gap-4 mb-1">
                                    <div className="flex items-center gap-2 opacity-50">
                                      <User size={12} />
                                      <span className="text-[10px] uppercase tracking-widest font-bold">You</span>
                                    </div>
                                    <CopyButton 
                                      text={msg.content} 
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1" 
                                    />
                                  </div>
                                  {msg.content}
                                </div>
                              ) : (
                                <div className="w-full">
                                  <div className="flex items-center justify-between gap-4 mb-4 group/header">
                                    <div className="flex items-center gap-2 opacity-50">
                                      <div className="p-1 rounded bg-brand-accent/20 text-brand-accent">
                                        <Cpu size={12} />
                                      </div>
                                      <span className="text-[10px] uppercase tracking-widest font-bold">FNB AI PRO</span>
                                    </div>
                                    <CopyButton 
                                      text={msg.content} 
                                      className="p-1 text-slate-500 hover:text-brand-accent" 
                                    />
                                  </div>
                                  <div className="markdown-body">
                                    <ReactMarkdown
                                      components={{
                                        code({ node, inline, className, children, ...props }: any) {
                                          const match = /language-(\w+)/.exec(className || '');
                                          return !inline && match ? (
                                            <CodeBlock
                                              code={String(children).replace(/\n$/, '')}
                                              language={match[1]}
                                            />
                                          ) : (
                                            <code className={className} {...props}>
                                              {children}
                                            </code>
                                          );
                                        }
                                      }}
                                    >
                                      {msg.content}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />

                          {!isLoading && messages.length > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 pt-8 border-t border-slate-800/50"
                            >
                              <button
                                onClick={() => {
                                  setIsContinuing(true);
                                  inputRef.current?.focus();
                                  inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className="flex items-center gap-2 text-brand-accent hover:text-brand-accent-hover transition-colors group"
                              >
                                <div className="p-2 rounded-full bg-brand-accent/10 group-hover:bg-brand-accent/20 transition-colors">
                                  <Plus size={16} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest">{t.continueToAsk}</span>
                              </button>
                            </motion.div>
                          )}
                        </div>
                      )
                    ) : (
                      <div className={`h-full flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>
                        <Cpu size={48} className="opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-widest">Awaiting Input</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className={`border-t py-4 transition-colors ${theme === 'dark' ? 'bg-brand-bg/50 border-slate-800/50' : 'bg-white border-slate-100'}`}>
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
            <p className={`text-[10px] font-bold uppercase tracking-widest text-center ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
              &copy; 2026 FNB AI PRO. {t.poweredBy}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

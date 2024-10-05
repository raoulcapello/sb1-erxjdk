import React, { useState, useEffect } from 'react';
import { Code, RefreshCw } from 'lucide-react';

const codeExamples = {
  HTML: `<h1>Hello, World!</h1>`,
  CSS: `.css-effect {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`,
  JavaScript: `function typeWriter(element, text, speed = 50) {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

const header = document.querySelector('h1');
typeWriter(header, "Hello, JS!");`
};

function App() {
  const [currentPhase, setCurrentPhase] = useState('HTML');
  const [showAllColumns, setShowAllColumns] = useState(false);
  const [headerContent, setHeaderContent] = useState('Hello, World!');
  const [isRestarting, setIsRestarting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const phases = ['HTML', 'CSS', 'JavaScript'];
    let currentIndex = 0;

    const cyclePhases = () => {
      if (currentIndex < phases.length) {
        setCurrentPhase(phases[currentIndex]);
        currentIndex++;
      } else {
        setShowAllColumns(true);
      }
    };

    const interval = setInterval(cyclePhases, 2000); // Changed to 2000ms (2 seconds)
    return () => clearInterval(interval);
  }, [isRestarting]);

  useEffect(() => {
    if (currentPhase === 'CSS') {
      setHeaderContent('Hello, CSS!');
    } else if (currentPhase === 'HTML') {
      setHeaderContent('Hello, World!');
    } else if (currentPhase === 'JavaScript') {
      setHeaderContent('');
      const typeWriter = (text: string, i = 0) => {
        if (i < text.length) {
          setHeaderContent(prev => prev + text.charAt(i));
          setTimeout(() => typeWriter(text, i + 1), 100);
        }
      };
      typeWriter('Hello, JS!');
    }
  }, [currentPhase]);

  const renderCodeBlock = (language: string) => (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center">
        <Code size={20} className="mr-2" />
        <span className="font-mono text-sm">{language}</span>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="language-markup">
          {codeExamples[language as keyof typeof codeExamples]}
        </code>
      </pre>
    </div>
  );

  const renderPhase = (phase: string) => (
    <div className="flex flex-col items-center">
      <h1 className={`text-4xl md:text-5xl lg:text-6xl mb-8 ${phase === 'CSS' ? 'css-effect' : ''}`}>
        {phase === 'HTML' && 'Hello, World!'}
        {phase === 'CSS' && 'Hello, CSS!'}
        {phase === 'JavaScript' && headerContent}
      </h1>
      {renderCodeBlock(phase)}
    </div>
  );

  const handleRestart = () => {
    setIsRestarting(true);
    setShowAllColumns(false);
    setCurrentPhase('HTML');
    setHeaderContent('Hello, World!');
    setTimeout(() => setIsRestarting(false), 100);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-8 transition-all duration-300 ${isHovering ? 'bg-black' : 'bg-gray-100'}`}>
      <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
        {!showAllColumns ? (
          renderPhase(currentPhase)
        ) : (
          <div className="w-full flex justify-center mb-12">
            <div className="flex flex-wrap justify-center gap-4 max-w-7xl">
              {['HTML', 'CSS', 'JavaScript'].map((lang) => (
                <div key={lang} className="flex-1 min-w-[300px] transition-all duration-1000 ease-in-out opacity-0 translate-y-10 animate-fade-in-up">
                  {renderPhase(lang)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showAllColumns && ( // Only render the button when showAllColumns is true
        <button
          onClick={handleRestart}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`restart-button group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl transition duration-300 ease-out ${isHovering ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          <span className={`absolute inset-0 w-full h-full ${isHovering ? 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700' : 'bg-gradient-to-br from-teal-400 via-indigo-500 to-purple-600'}`}></span>
          <span className={`absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 ${isHovering ? 'bg-yellow-600' : 'bg-purple-500'} rounded-full opacity-30 group-hover:rotate-90 ease`}></span>
          <span className="relative flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Restart
          </span>
        </button>
      )}
    </div>
  );
}

export default App;
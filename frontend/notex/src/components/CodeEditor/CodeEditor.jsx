import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { FaPlay, FaCode, FaRegCircleCheck } from "react-icons/fa6";
import LanguageDropdown from './LanguageDropdown';

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
];
  
const languageMap = {
  javascript: javascript(),
  python: python(),
  java: java(),
};
  
export const CodeEditor = ({ codeSnippet, setCodeSnippet }) => {
  const [codeOutput, setCodeOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  
  const handleRunCode = () => {
    try {
      setCodeOutput('');
  
      const code = codeSnippet;
      const originalConsoleLog = console.log;
      let outputBuffer = '';
  
      console.log = (...args) => {
      outputBuffer += args.join(' ') + '\n';
        setCodeOutput(outputBuffer);
      };
        
      eval(code);
  
      console.log = originalConsoleLog;
    } catch (error) {
      setCodeOutput(`Error: ${error.message}`);
    }
  }

  return (
    <div>
      <div className='relative flex justify-between items-center text-xs text-neutral-100 p-1 bg-darkCharcoal rounded-t'>
        <div className='relative flex items-center p-1'>
          <FaCode className='mr-2 text-green-500'/>
          CODE
        </div>
        <div className='flex items-center'>
          <LanguageDropdown
            languages={languages}
            selectedLanguage={languages.find(lang => lang.value === selectedLanguage)}
            setSelectedLanguage={(lang) => setSelectedLanguage(lang.value)}
          />
          <button 
            className='relative flex items-center mr-2 px-2 cursor-pointer p-1 rounded hover:bg-neutral-700 transition-all ease-in-out'
            onClick={handleRunCode}
          >
            <FaPlay className='mr-2 text-gray-400'/>
            Run
          </button>
        </div>
      </div>
      <CodeMirror
        value={codeSnippet}
        height="310px"
        theme={vscodeDark}
        extensions={[languageMap[selectedLanguage]]}
        onChange={(value) => setCodeSnippet(value)}
        className='text-xs'
      />
      <div className='mt-4'>
        <div className='relative flex items-center text-xs text-neutral-100 p-2 bg-darkCharcoal rounded-t'>
          <FaRegCircleCheck className='mr-2 text-green-500'/>
          OUTPUT
        </div>
        <pre className='bg-darkGray p-2 h-32 text-xs text-neutral-100 text-wrap overflow-y-auto scrollbar-custom'>{codeOutput}</pre>
      </div>
    
        {/* <CodeMirror
          value={code}
          theme={darcula}
          options={{
            mode: 'javascript',
            lineNumbers: true
          }}
          onChange={(editor, data, value) => setCode(value)}
        /> */}

    </div>
  );
};

export default CodeEditor;

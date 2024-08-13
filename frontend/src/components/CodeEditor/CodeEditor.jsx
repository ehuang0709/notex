import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
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
  
export const CodeEditor = ({ codeSnippet, setCodeSnippet, selectedLanguage, setSelectedLanguage }) => {
  const [codeOutput, setCodeOutput] = useState('');
  const [loadingText, setLoadingText] = useState('Running');

  useEffect(() => {
    let interval;
    if (codeOutput === 'Running...') {
      interval = setInterval(() => {
        setLoadingText(prev => {
          if (prev === 'Running...') return 'Running';
          return prev + '.';
        });
      }, 200);
    } else {
      setLoadingText('Running');
    }

    return () => clearInterval(interval);
  }, [codeOutput]);
  
  const handleRunCode = async () => {
    if (!codeSnippet.trim()) {
      setCodeOutput("Error: Code snippet is empty.");
      return;
    }

    try {
      setCodeOutput('Running...');
  
      const code = codeSnippet;
      const errorIds = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

      const response = await axiosInstance.post("/execute-code", {
        code,
        language: selectedLanguage,
      });

      const { stdout, stderr, compile_output, status } = response.data;

      if (errorIds.includes(status.id)) {
        setCodeOutput(stderr != null ? `Error: ${stderr}` : `Error: ${compile_output}`);
      } else if (status.id === 3) { // status 3 = accepted
        setCodeOutput(stdout);
      } else {
        setCodeOutput(`An unknown error has occurred. Status ID: ${status.id}`);
      }
        
    } catch (error) {
      setCodeOutput(`Error: ${error.message}.\nYou have exceeded the DAILY quota on code executions.`);
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
            setSelectedLanguage={setSelectedLanguage}
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
        height="343px"
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
        <pre className='bg-darkGray p-2 h-32 text-xs text-neutral-100 text-wrap overflow-y-auto scrollbar-custom'>
          {codeOutput === 'Running...' ? loadingText : codeOutput}
        </pre>
      </div>

    </div>
  );
};

export default CodeEditor;

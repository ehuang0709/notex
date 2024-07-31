import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { MdClose } from 'react-icons/md';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditorModal = ({ codeSnippet, setCodeSnippet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-1/3 h-full shadow-lg p-4 transition-transform transform animation-slideIn">
        {/* <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-gray-100"
          onClick={onClose}
        >
          <MdClose className="text-xl text-gray-400" />
        </button>
        <h2 className="text-xl font-bold mb-4">Code Editor</h2>
        <CodeMirror
          value={codeSnippet}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
          }}
          onBeforeChange={(_, __, value) => {
            setCodeSnippet(value);
          }}
        /> */}
      </div>
    </div>
  );
};

export default CodeEditorModal;

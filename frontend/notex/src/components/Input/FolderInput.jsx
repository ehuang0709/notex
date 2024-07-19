import React from 'react';
import Select from 'react-select';

const FolderInput = ({ folders, selectedFolder, onFolderChange}) => {

  const folderOptions = folders.map(folder => ({
    value: folder._id,
    label: folder.name,
  }));

  const handleChange = (selectedOption) => {
    onFolderChange(selectedOption ? selectedOption.value : null);
  };

  const defaultValue = folderOptions.find(option => option.value === selectedFolder) || null;

  return (
    <>
      <Select
        className="text-sm bg-transparent outline-none"
        classNamePrefix="select"
        defaultValue={defaultValue}
        onChange={handleChange}
        isClearable={true}
        isSearchable={true}
        name="folder"
        options={folderOptions}
      />

      <div
        // style={{
        //   color: 'hsl(0, 0%, 40%)',
        //   display: 'inline-block',
        //   fontSize: 12,
        //   fontStyle: 'italic',
        //   marginTop: '1em',
        // }}
      >
      </div>
    </>
  );
};

export default FolderInput;

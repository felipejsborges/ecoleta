import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 1) {
        alert('Insira apenas uma imagem');
      } else {
        const file = acceptedFiles[0];

        const fileUrl = URL.createObjectURL(file);

        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
      }
    },
    [onFileUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="point_img" />
      ) : isDragActive ? (
        <p>
          <FiUpload />
          Solte a imagem aqui
        </p>
      ) : (
        <p>
          <FiUpload />
          <span>Arraste e solte aqui uma imagem do seu ponto de coleta,</span>
          <span>ou clique para selecionar.</span>
        </p>
      )}
    </div>
  );
};

export default Dropzone;

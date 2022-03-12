import { FileDropzoneProps } from '@GlobalTypes';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

const FileDropzone: React.FunctionComponent<FileDropzoneProps> = ({ files, onAcceptFile, onRemoveFile }) => {
  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.path));
    };
  }, [files]);

  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) return <p className='dropContainerMessageDefault'>Arraste o documento para cá...</p>;
    if (isDragReject) return <p className='dropContainerMessageDanger'>Arquivo não suportado...</p>;

    return <p className='dropContainerMessageSuccess'>Solte o documento aqui...</p>;
  };

  return (
    <>
      <Row>
        <Col sm={12}>
          <Dropzone
            accept={['image/*', 'text/plain', 'application/*']}
            onDropAccepted={(files) =>
              onAcceptFile(files.map((file) => ({ path: URL.createObjectURL(file), isNew: true, name: file.name, file: file })))
            }
          >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
              <div {...getRootProps()} className='dropContainer' style={{ borderColor: isDragReject ? '#e57878' : isDragActive ? '#78e5d5' : '' }}>
                <input {...getInputProps()} />
                {renderDragMessage(isDragActive, isDragReject)}
              </div>
            )}
          </Dropzone>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          <ul>
            {files.map((file, i) => (
              <li key={i}>
                <div>
                  <a href={file.path} target='_blank'>
                    {file.name}&nbsp;&nbsp;
                  </a>
                  <a onClick={() => onRemoveFile(file)}>
                    <i className='remove-icon' />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </>
  );
};

export default FileDropzone;

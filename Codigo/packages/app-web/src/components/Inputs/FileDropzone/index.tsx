import React, { useEffect } from 'react';
import './styles.css';
import { FileDropzoneProps, FileMixed, NewFile } from './types';
import { Col, Row } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { transformNewFile } from '@Utils/util';

const FileDropzone: React.FunctionComponent<FileDropzoneProps> = ({
  maxHeight,
  onRemoveFile,
  mimeTypes,
  label,
  hasError,
  ...props
}) => {
  useEffect(() => {
    return () => {
      if (props.singleFile) URL.revokeObjectURL(props.file?.path || '');
      else props.files.forEach((file) => URL.revokeObjectURL(file.path));
    };
  }, [props.singleFile]);

  const renderDragMessage = (isDragActive: boolean, isDragReject: boolean) => {
    if (!isDragActive) return <p className='dropContainerMessageDefault'>Arraste o documento para cá...</p>;
    if (isDragReject) return <p className='dropContainerMessageDanger'>Arquivo não suportado...</p>;

    return <p className='dropContainerMessageSuccess'>Solte o documento aqui...</p>;
  };

  return (
    <>
      <Row>
        <Col sm={12}>
          {label && <label className='label-with-loading'>{label}</label>}
          <Dropzone
            accept={mimeTypes}
            multiple={!props.singleFile}
            onDropAccepted={(files) =>
              props.singleFile
                ? props.onAcceptFile(transformNewFile(files[0]))
                : props.onAcceptFile(files.map((file) => transformNewFile(file)))
            }
          >
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
              <div
                {...getRootProps()}
                className={`dropContainer mb-3 ${hasError ? 'has-error' : ''}`}
                style={{ borderColor: isDragReject ? '#e57878' : isDragActive ? '#78e5d5' : '' }}
              >
                {(props.singleFile && !props.file) || (!props.singleFile && props.files.length === 0) ? (
                  <>
                    <input {...getInputProps()} />
                    {renderDragMessage(isDragActive, isDragReject)}
                  </>
                ) : (
                  (props.singleFile ? [props.file as FileMixed] : props.files).map((file) => (
                    <div
                      key={file.path}
                      className='drop-container-image-box'
                      title={file.name}
                      onClick={() => onRemoveFile(file)}
                    >
                      <img src={file.path} style={{ maxHeight: maxHeight }} />
                      <i className='fas fa-times' />
                    </div>
                  ))
                )}
              </div>
            )}
          </Dropzone>
        </Col>
      </Row>
      {!props.singleFile && (
        <Row>
          <Col sm={12}>
            <ul>
              {props.files.map((file, i) => (
                <li key={i}>
                  <div>
                    <a href={file.path} target='_blank' rel='noreferrer'>
                      {file.name}&nbsp;&nbsp;
                    </a>
                    <a onClick={() => onRemoveFile(file)}>
                      <i className='fas fa-times clickable ms-2 text-danger' />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      )}
    </>
  );
};

export default FileDropzone;

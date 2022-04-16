import IconRoundedButton from '@Components/buttons/IconRoundedButton';
import FileList from '@Components/lists/FileList';
import ImageList from '@Components/lists/ImageList';
import { GenericFileType } from '@GlobalTypes';
import { ChangeEvent } from 'react';
import Textarea from 'react-textarea-autosize';

type Setter<T> = (setter: ((state: T) => T) | T) => void;

type InputProps<T> = { value: T; onChange: Setter<T> };

type InputMultiValuesProps = {
  label?: string | JSX.Element;
  hasError?: boolean;
  textInput: InputProps<string>;
  fileInput: InputProps<GenericFileType[]>;
  imageInput: InputProps<GenericFileType[]>;
  readOnly?: boolean;
  isLoading?: boolean;
};

const InputMultiValues: React.FunctionComponent<InputMultiValuesProps> = ({
  label,
  hasError,
  textInput,
  fileInput,
  imageInput,
  readOnly,
}) => {
  const handleAddFile = (setter: Setter<GenericFileType[]>) => (event: ChangeEvent<HTMLInputElement>) => {
    const newFilesAux = event.target.files;

    if (newFilesAux && newFilesAux.length > 0) {
      setter((current) => {
        const newFiles = Array.from(newFilesAux);
        return [
          ...current,
          ...newFiles.map((file) => {
            const url = URL.createObjectURL(file);

            return {
              id: url,
              name: file.name,
              urlPath: url,
              file: file,
            };
          }),
        ];
      });
    }
  };

  const handleRemoveFile = (setter: Setter<GenericFileType[]>) => (file: GenericFileType) =>
    setter((current) => current.filter((f) => f !== file));

  const addFile = handleAddFile(fileInput.onChange);
  const addImage = handleAddFile(imageInput.onChange);

  const removeFile = handleRemoveFile(fileInput.onChange);
  const removeImage = handleRemoveFile(imageInput.onChange);

  return (
    <div className='row'>
      <label>{label ?? 'Resposta'}</label>
      <label
        className={`col-12 rounded-md p-3 ${readOnly ? 'input-multi-values-disabled' : ''}`}
        style={{ border: hasError ? '1px dashed red' : '1px solid grey' }}
      >
        <Textarea
          disabled={readOnly}
          className='no-border'
          minRows={2}
          style={{ width: '100%', resize: 'none' }}
          value={textInput.value}
          onChange={(e) => textInput.onChange(e.target.value)}
          onBlur={(e) => textInput.onChange(e.target.value.trim())}
        />
        <FileList files={fileInput.value} onRemoveFile={readOnly ? () => undefined : removeFile} />
        <ImageList roundImages files={imageInput.value} onRemoveFile={readOnly ? () => undefined : removeImage} />
      </label>

      <div className={'d-flex flex-row mt-3'}>
        <div style={{ visibility: readOnly ? 'hidden' : 'visible', pointerEvents: readOnly ? 'none' : undefined }}>
          <IconRoundedButton
            textGrey
            icon='fas fa-upload'
            iconColor='green'
            label={
              <label>
                Anexar
                <input multiple type='file' className='d-none' onChange={addFile} accept='image/*' />
              </label>
            }
          />
          <IconRoundedButton
            textGrey
            icon='fas fa-camera'
            iconColor='orange'
            label={
              <label>
                Anexar fotos
                <input multiple type='file' className='d-none' onChange={addImage} accept='image/*' />
              </label>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default InputMultiValues;

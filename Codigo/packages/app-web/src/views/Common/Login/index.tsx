import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Logo from '@Assets/img/logo.png';
import SLogo from '@Assets/img/s-logo.png';
import LoginBackground from '@Assets/img/login-background.jpg';
import InputControlled from '@Components/Inputs/InputControlled';
import Alert from '@Components/alert';
import { Link } from 'react-router-dom';
import { AuthContext, SignInSuccess, SignInFail } from '~/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APIError } from '~/error/APIError';
import { urlPrefix } from '~/routes';

interface FormInput {
  email: string;
  password: string;
}

interface CommonLoginViewProps {
  cardHeader: JSX.Element;
  onSubmit: (data: FormInput) => Promise<SignInSuccess | SignInFail>;
}

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const CommonLoginView: React.FunctionComponent<CommonLoginViewProps> = ({ onSubmit, cardHeader }) => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    signOut();
    console.log('signOut rerender');
  }, [signOut]);

  const handleOnSubmit = async (data: FormInput): Promise<void> => {
    try {
      setIsSending(true);

      const response = await onSubmit(data);

      console.log(response);

      if (response.success === true) {
        navigate(urlPrefix[response.type]);
      } else {
        setMessage(response.message || '');
      }
    } catch (error: any) {
      if (error instanceof APIError) setMessage(error.message);
      else setMessage('Erro interno. Por favor, tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='container-fluid login-background' style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div style={{ height: '100vh' }} className='row'>
        <div className='flex-center d-md-flex col-md-6' style={{ height: '100%', display: 'none', zIndex: 3 }}>
          <img src={SLogo} alt='Logo' style={{ position: 'absolute', height: '40px', top: 15, left: 15 }} />
          <img src={Logo} alt='Logo' style={{ width: '360px' }} />
        </div>
        <div className='flex-center col-sm-12 col-md-6 login-background-light' style={{ height: '100%', zIndex: 3 }}>
          <div className='card col-sm-8 col-md-10 col-lg-10 col-xl-7 d-flex flex-column p-5 px-sm-3 px-md-5 align-items-center rounded-md'>
            <img className='d-md-none card-img-top' src={Logo} alt='Logo' style={{ maxWidth: '200px' }} />
            <div className='card-body'>
              <div className='mb-3'>{cardHeader}</div>
              <Alert title='Atenção!' text={message} variant='danger' isShow={message !== ''} />
              <form onSubmit={submitter(handleOnSubmit)}>
                <div className='mb-3'>
                  <InputControlled
                    isRequired
                    control={control}
                    hasError={!!errors.email}
                    type='email'
                    defaultValue={''}
                    name='email'
                    label='E-mail'
                    onBlur={() => setMessage('')}
                  />
                </div>
                <div className='mb-3'>
                  <InputControlled
                    isRequired
                    control={control}
                    hasError={!!errors.password}
                    type='password'
                    defaultValue={''}
                    name='password'
                    label='Senha'
                    onBlur={() => setMessage('')}
                  />
                </div>
                <div className='mb-3'>
                  <Link to={'/administrador/esqueci-minha-senha'}>Esqueci minha senha</Link>
                </div>
                <div className='mb-3'>
                  {isSending ? (
                    <button type='button' className='btn btn-success w-100'>
                      Processando...
                    </button>
                  ) : (
                    <button type='submit' className='btn btn-success w-100'>
                      Login
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonLoginView;

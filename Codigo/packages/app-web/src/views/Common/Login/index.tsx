import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Logo from '@Assets/img/logo.png';
import SLogo from '@Assets/img/s-logo.png';
import LoginBackground from '@Assets/img/login-background.jpg';
import InputControlled from '@Components/Inputs/InputControlled';
import Alert from '@Components/alert';
import { Link } from 'react-router-dom';
import { AuthContext, SignInSuccess, SignInFail, SignInWarning } from '~/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { APIError } from '~/error/APIError';
import { urlPrefix } from '~/routes';

interface FormInput {
  name?: string;
  email: string;
  password: string;
}

interface CommonLoginViewProps {
  cardHeader: JSX.Element;
  onSubmit: (data: FormInput) => Promise<SignInSuccess | SignInWarning | SignInFail>;
  onForgotPassword?: { label: string; href: string };
  onRequestNewAccount?: { label: string; href: string };
  showNameField?: boolean;
}

const CommonLoginView: FunctionComponent<CommonLoginViewProps> = ({
  onSubmit,
  cardHeader,
  onForgotPassword,
  onRequestNewAccount,
  showNameField,
}) => {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const schema: yup.SchemaOf<FormInput> = yup.object().shape({
    name: yup.string(),
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const {
    handleSubmit: submitter,
    control,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [accountUnderReview, setAccountUnderReview] = useState(false);

  useEffect(() => {
    signOut();
  }, [signOut]);

  const handleOnSubmit = async ({ email, password, name }: FormInput): Promise<void> => {
    try {
      setIsSending(true);

      const response = await onSubmit({ email: email.trim(), password, name: name?.trim() });

      if (response.status === 'SUCCESS') {
        navigate(urlPrefix[response.type] + '/');
      } else if (response.status === 'WARNING') {
        setAccountUnderReview(true);
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
              {accountUnderReview ? (
                <>
                  <div className='mb-3'>
                    <h4>Obrigado pelo cadastro,</h4>a sua conta está em análise para a utilização do sistema.
                  </div>
                  <div>
                    Aguarde enquanto nossa equipe realiza a conferência das informações (aproximadamente 3 dias úteis).
                  </div>
                </>
              ) : (
                <>
                  <div className='mb-3'>{cardHeader}</div>
                  <Alert title='Atenção!' text={message} variant='danger' isShow={message !== ''} />
                  <form onSubmit={submitter(handleOnSubmit)}>
                    <div className='mb-3'>
                      {showNameField && (
                        <InputControlled
                          isRequired
                          control={control}
                          hasError={!!errors.name}
                          type='text'
                          defaultValue={''}
                          name='name'
                          label='Nome completo'
                          onBlur={() => setMessage('')}
                        />
                      )}
                      <InputControlled
                        isRequired
                        control={control}
                        hasError={!!errors.email}
                        type='email'
                        autoComplete='username'
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
                        autoComplete='current-password'
                        defaultValue={''}
                        name='password'
                        label='Senha'
                        onBlur={() => setMessage('')}
                      />
                    </div>
                    <div className='mb-3'>
                      {onForgotPassword && (
                        <Link className='d-block' to={onForgotPassword.href}>
                          {onForgotPassword.label}
                        </Link>
                      )}
                      {onRequestNewAccount && (
                        <Link className='d-block' to={onRequestNewAccount.href}>
                          {onRequestNewAccount.label}
                        </Link>
                      )}
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
                      <button className='btn btn-secondary w-100 mt-1' onClick={() => navigate('/')}>
                        Voltar
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonLoginView;

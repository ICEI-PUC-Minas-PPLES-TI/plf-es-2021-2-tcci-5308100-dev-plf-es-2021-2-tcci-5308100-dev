import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Logo from '@Assets/img/logo.png';
import LoginBackground from '@Assets/img/login-background.jpg';
import InputControlled from '@Components/Inputs/InputControlled';
import Alert from '@Components/alert';
import { Link } from 'react-router-dom';

interface FormInput {
  email: string;
  password: string;
}

const schema: yup.SchemaOf<FormInput> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const CommonLoginView = () => {
  const { register, handleSubmit, control } = useForm<FormInput>({
    resolver: yupResolver(schema),
  });

  const [isShow, setIsShow] = useState(false);

  const onSubmit = async (data: FormInput): Promise<void> => {};

  return (
    <div className='container-fluid login-background' style={{ backgroundImage: `url(${LoginBackground})` }}>
      <div style={{ height: '100vh' }} className='row'>
        <div className='flex-center d-md-flex col-md-6' style={{ height: '100%', display: 'none', zIndex: 3 }}>
          <img src={Logo} alt='Logo' style={{ width: '360px' }} />
        </div>
        <div className='flex-center col-sm-12 col-md-6 login-background-light' style={{ height: '100%', zIndex: 3 }}>
          <div className='card col-sm-8 col-md-10 col-lg-10 col-xl-7 d-flex flex-column p-5 px-sm-3 px-md-5 align-items-center rounded-md'>
            <img className='d-md-none card-img-top' src={Logo} alt='Logo' style={{ maxWidth: '200px' }} />
            <div className='card-body'>
              <div className='mb-3'>
                <h4>Bem-vindo, Explorador!</h4>
                Faça login um sua conta utilizando sua conta Shopify
              </div>
              <Alert title='Atenção!' text='E-mail e/ou senha incorretos.' variant='danger' isShow={isShow} />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-3'>
                  <InputControlled isRequired control={control} type='email' defaultValue={''} name='email' label='E-mail' />
                </div>
                <div className='mb-3'>
                  <InputControlled isRequired control={control} type='password' defaultValue={''} name='password' label='Senha' />
                </div>
                <div className='mb-3'>
                  <Link to={'/administrador/esqueci-minha-senha'}>Esqueci minha senha</Link>
                </div>
                <div className='mb-3'>
                  <button type='button' className='btn btn-success w-100'>
                    Login
                  </button>
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

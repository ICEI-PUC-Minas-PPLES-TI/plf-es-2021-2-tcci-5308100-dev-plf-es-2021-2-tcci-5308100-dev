import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';

const SweetAlertSendSuccessfully = () => {
  const navigate = useNavigate();

  return (
    <SweetAlert
      success
      title='Tudo certo!'
      showCloseButton
      onCancel={() => navigate('/explorador/perfil')}
      onConfirm={() => navigate('/explorador/perfil')}
      showConfirm
      confirmBtnBsStyle='outline-success'
      confirmBtnText={
        <>
          Ok! <i className='far fa-grin-beam ms-1' />
        </>
      }
    >
      Resposta enviada!
      <br />
      Agora é só aguardar.
    </SweetAlert>
  );
};

export default SweetAlertSendSuccessfully;

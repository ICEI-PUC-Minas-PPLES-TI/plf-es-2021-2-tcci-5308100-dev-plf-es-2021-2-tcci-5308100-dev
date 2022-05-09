import React from 'react';
import { Card, Col, Collapse, Container, Row } from 'react-bootstrap';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const ErrorCatcher: React.FunctionComponent = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={process.env.NODE_ENV === 'development' ? alert : undefined}
    >
      {children}
    </ErrorBoundary>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const [collapsibleAccordion, setCollapsibleAccordion] = React.useState(-1);

  return (
    <Container fluid>
      <Row>
        <Col sm='12'>
          <Card>
            <Card.Header>
              <Card.Title as='h4'>Algo deu errado.</Card.Title>
              <button className='btn btn-secondary' onClick={resetErrorBoundary}>
                Tentar novamente
              </button>
            </Card.Header>
            <Card.Body>
              <div className='accordions' id='accordion'>
                <Card>
                  <Card.Header style={{ textAlign: 'left' }}>
                    <Card.Title as='h4'>
                      <a
                        aria-expanded={collapsibleAccordion === 1}
                        data-toggle='collapse'
                        href='#pablo'
                        onClick={(e) => {
                          e.preventDefault();
                          collapsibleAccordion === 1 ? setCollapsibleAccordion(-1) : setCollapsibleAccordion(1);
                        }}
                      >
                        Informação de depuração <b className='caret'></b>
                      </a>
                    </Card.Title>
                  </Card.Header>
                  <Collapse className='card-collapse' in={collapsibleAccordion === 1}>
                    <Card.Body>
                      <pre>{error.message}</pre>
                      <pre>{error.stack}</pre>
                    </Card.Body>
                  </Collapse>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ErrorCatcher;

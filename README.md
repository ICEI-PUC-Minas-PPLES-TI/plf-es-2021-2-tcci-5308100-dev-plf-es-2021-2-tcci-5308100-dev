# Sistema de Engajamento de Clientes
O Sistema de Engajamento de Clientes tem como objetivo envolver os clientes da empresa que o utiliza, a fim de acelerar o crescimento de sua marca. Para isso, os clientes devem ter acesso a desafios que determinam regras para concluí-los e receber premiações em produtos da marca e outros benefícios. As regras estabelecidas geralmente são relacionadas a atividades que estimulam a divulgação da marca ou dos produtos da empresa. 

O sistema promove as redes sociais da empresa, apresentando publicações e hashtags relacionadas à marca. O programa possui 2 tipos usuários distintos: Exploradores que são clientes da empresa que desejam participar dos desafios a fim de conquistar as premiações e Administradores que são funcionários da empresa responsáveis pela gestão do sistema e dos Exploradores.

## Alunos integrantes da equipe

* Luiz Felipe de Castro Baia Antunes
* Wesley Mouraria Pereira

## Professores orientadores

* José Laerte Xavier
* Lesandro Ponciano
* Alexandre Teixeira

## Requerimentos
- **Obrigatórios:**
  - Node.JS v16
  - Yarn 2
  - MySQL
- **Opcionais:**
  - Docker
  - Docker Compose
  - LocalStack
  - MailHog

## Instruções de utilização

Este projeto utiliza **Node.JS v16** para a execução do código e utiliza **Yarn 2** como gerenciador de pacotes. É importante que seja utilizado o **Yarn 2** ou superior, pois é através do **Yarn Workspaces** que o sistema de mono repositório é configurado. O sistema foi implementado utilizando **TypeScript** como linguagem principal.

Também utilizamos ferramentas auxiliares para o desenvolvimento através do **Docker**. O arquivo `docker-compose.yml` utiliza o **Docker Compose** para disponibilizar as ferramentas **LocalStack** e **MailHog**. O MailHog permite simular localmente um servidor de e-mail SMTP e fornece uma interface de usuário amigável que pode ser acessada através do navegador no endereço `localhost:8025`. A ferramenta **LocalStack** permite simular localmente os serviços da Amazon, como a AWS. Para configurar a ferramenta **LocalStack**, é necessário iniciar os serviços utilizando o **Docker Compose** e executar os seguintes comandos:
- `docker exec -it localstack_sec aws --endpoint-url=http://localhost:4566 s3 mb s3://sec-hardz`
- `docker exec -it localstack_sec aws --endpoint-url=http://localhost:4566 s3api put-bucket-acl --bucket sec-hardz --acl public-read`
Esses comandos acessam o container do Docker onde a ferramenta do LocalStack está sendo executada e utilizam o AWS CLI para configurar os serviços. O primeiro comando cria um bucket S3 chamado `sec-hardz`. O segundo comando define as permissões desse bucket para que o arquivos salvos nele possam ser acessados pelos módulos do nosso sistema.

Para o banco de dados, utilizamos **MySQL**.

#### Instalar dependências do projeto

A pasta **Codigo** contém todo o código implementado. Para instalar as dependências do projeto, basta executar o comando `yarn` ou `yarn install` nessa pasta. Esse comando deve instalar as dependências de todos os módulos do sistema.

#### Preparar o banco de dados

O projeto utiliza o TypeORM, um *Object Relational Mapper* (ORM) e utiliza migrations e seeds para configurar o banco de dados. Para realizar as migrações (migrations), deve se executar o comando:
- `yarn server orm:run` ou `yarn run server run orm:run`

Para fazer semear (seed) o banco de dados, deve se executar o comando:
- `yarn server orm:seed ./packages/server/src/database/seeder.worker.ts` ou `yarn run server run orm:seed ./packages/server/src/database/seeder.worker.ts`
Esse comando irá executar os seeds **ProfileSeed**, **ExplorerSeed**, **UserSeed** e **SocialMediaSeed**, localizados na pasta `Codigo/packages/server/src/database/seeds`.


#### Execução

Para executar o projeto em modo de desenvolvimento, deve se executar os seguintes comandos, **nessa ordem**, na pasta **Codigo**:
- `yarn dev:common` ou `yarn run dev:common`
- `yarn dev:server` ou `yarn run dev:server`
- `yarn dev:app-web` ou `yarn run dev:app-web`
# seu-ze-stock-control

## Rodando a aplicação

Para rodar a aplicação faça um clone do repositório e siga os seguintes passos:

1. Primeiramente deve-se definir as variáveis de ambiente. Para isso, crie um arquivo .env na raíz do projeto.
   As variáveis necessárias estão descritas no .env.example, basta copiar e colar e atribuir os valores em cada uma. Exemplo:

   ```shell
   MONGODB_USERNAME=user
   ```

   _Importante_: a variável ambiente MONGODB_HOST deve permanecer com o valor explicitado em .env.example enquanto o nome do serviço
   do mongodb não for alterado no docker-compose.

2. Depois, para rodar o sistema basta rodar em um terminal (na raiz do projeto):

   ```shell
   sh start.sh
   ```

3. Pronto, agora espere uns instantes enquanto a aplicação inicia (tem que instalar os pacotes npm), e acesse:

   <http://localhost:3000/orders>

   Obs.: para ver os logs da aplicação:

   ```shell
   docker logs stock-control-api
   ```

   Você verá que está onlie quando essa mensagem aparecer:
   '🌴 starting again node server on port 3000...'

## Como usar a api

Os endpoints disponíveis da api são:

- [GET] /products/:name:
  Obtém dados de um produto informado via route param. Exemplo:

  <http://localhost:3000/products/Kiwi>

- [POST] /orders:
  Cria um pedido. O corpo da requisição deve estar no seguinte formato:

  <http://localhost:3000/orders>

  ```json
  {
    "products": [
      {
        "name": "Kiwi",
        "quantity": 1
      }
    ]
  }
  ```

- [GET] /orders?page=:page
  Busca lista paginada de pedidos criados. Para usá-lo:

  <http://localhost:3000/orders?page=2>

- [GET] /orders/:id
  Obtém dados de um pedido criado. Para usá-lo:

  <http://localhost:3000/orders/6017f347d5089c0043a0f1c0>

  Obs.: O formato do campo id deve ser: <https://docs.mongodb.com/manual/reference/method/ObjectId/>

## Rodando os testes

Para verificar os testes é necessário instalar o _yarn_ (gerenciador de pacotes equivalente ao npm). Após instalação, execute na raiz do projeto:

`yarn install && yarn test`

## Usar aplicação em modo de desenvolvimento

Altere o comando utilizado no arquivo .docker/entrypoint.sh, de:

```shell
yarn run start
```

para:

```shell
yarn run dev:server
```

E para ter efeito é necessário recriar o container da aplicação. Sugiro usar:

```shell
docker-compose stop && docker-compose rm -f && docker-compose up --build -d
```

## Coisas a melhorar

- [ ] Otimizar tamanho do container
- [ ] Trabalhar com transactions no mongodb (não consegui encontrar solução via typeorm)
- [ ] Criar autenticação via JWT
- [ ] Subir aplicação para dockerhub
- [ ] Configurar arquivos do kubernetes para deploy

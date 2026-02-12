# Como Usar Diretórios do Host no Docker

## Opção 1: Usando arquivo `.env` (Recomendado)

1. Crie um arquivo `.env` no diretório raiz do projeto:

```bash
cp .env.example .env
```

2.Edite o arquivo `.env` com seus caminhos:

```env
SOURCE_DIR=/home/seu_usuario/Imagens
OUTPUT_DIR=/home/seu_usuario/Imagens_Organizadas
```

3.Inicie o container:

```bash
docker-compose up -d
```

## Opção 2: Usando variáveis de ambiente inline

```bash
SOURCE_DIR=/caminho/fonte OUTPUT_DIR=/caminho/destino docker-compose up -d
```

## Opção 3: Editar diretamente no docker-compose.yml

Edite o arquivo `docker-compose.yml` e substitua os valores entre `${}`:

```yaml
volumes:
  - /caminho/absoluto/suas/fotos:/app/arquivos
  - /caminho/absoluto/fotos/organizadas:/app/organizados
```

## Pontos Importantes

- **Caminhos Absolutos**: Recomenda-se usar caminhos absolutos (ex: `/home/usuario/fotos`)
- **Permissões**: O container precisa de permissão de leitura/escrita nos diretórios
- **Linux/Mac**: Use caminhos normais (ex: `/home/usuario/fotos`)
- **Windows**: Use caminhos com barra (ex: `C:/Users/usuario/fotos`) ou use caminhos WSL

## Verificar se está funcionando

Após iniciar o container, acesse: `http://localhost:8080`

Você deve conseguir ver e navegar pelos diretórios do host mapeados.

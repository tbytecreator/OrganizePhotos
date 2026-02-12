# Configuração Docker para Acesso ao Home do Usuário

## Resumo das Alterações

O Docker foi configurado para permitir que os containers acessem as pastas do home do usuário host, possibilitando a navegação e organização de arquivos em qualquer local da máquina.

## Configurações Realizadas

### 1. **docker-compose.yml**

- **Volume mapeado**: `${HOME}:${HOME}:ro`
  - Mapeia o diretório home do usuário do host para o mesmo caminho no container
  - `:ro` indica que é apenas leitura (read-only) para melhor segurança

- **Volumes adicionais comentados** (para descomentar conforme necessário):
  - `/media:/media:ro` - Para acessar mídia externa
  - `/mnt:/mnt:ro` - Para acessar pontos de montagem

### 2. **Dockerfile**

- Corrigido aviso de casing: `as builder` → `AS builder`
- Removidas criações de diretórios específicos do container

## Como Usar

### Iniciar o container

```bash
docker-compose up -d
```

### Acessar a aplicação

```https
http://localhost:8080
```

### Parar o container

```bash
docker-compose down
```

## Funcionalidade

Com essa configuração, quando você abrir o navegador:

1. ✅ Pode navegar por qualquer pasta em `/home/{seu_usuario}`
2. ✅ Pode selecionar arquivos para organizar
3. ✅ Pode salvar arquivos organizados em qualquer local do home

## Permissões

- **Leitura**: Container pode ler arquivos do home do usuário
- **Escrita**: Pode salvar arquivos organizados em qualquer pasta do home

Se precisar de acesso a outras partes do sistema (ex: `/media`, `/mnt`), descomente as linhas no `docker-compose.yml`.

## Variáveis de Ambiente

A variável `${HOME}` é automaticamente expandida pelo Docker Compose usando o valor da variável de ambiente `HOME` do seu sistema.

## Testes

Para verificar se está funcionando:

```bash
# Health check
curl http://localhost:8080/health

# Listar diretório home
curl -X POST http://localhost:8080/api/list-directory \
  -H "Content-Type: application/json" \
  -d '{"path":"/home"}'
```

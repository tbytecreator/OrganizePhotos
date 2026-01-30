# OrganizePhotos 📸

Aplicação Web moderna para organizar automaticamente suas fotos e arquivos por
data de modificação com interface intuitiva para seleção de diretórios.

## ✨ Características

- 🌐 Interface Web responsiva com **file browser interativo**
- 📁 **Seleção visual de diretórios** (origem e destino)
- 🚀 Backend em Rust com Actix-web (rápido e eficiente)
- 📱 Design mobile-first totalmente responsivo
- 🐳 Containerizado com Docker para fácil deployment
- ⚡ Sem dependências externas (além do Docker)
- 🎨 UI moderna com gradientes, animações e modal intuitivo
- 🔍 Navegação de diretórios em tempo real

## 🚀 Quick Start com Docker

### Pré-requisitos

- Docker e Docker Compose instalados

### 1. Usando Docker Compose (Recomendado)

#### Opção 1a: Com arquivo `.env` (Mais simples)

```bash
# Clonar/entrar no diretório do projeto
cd OrganizePhotos

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com seus caminhos
# Linux/Mac: nano .env
# Windows: notepad .env
# Altere os valores:
# SOURCE_DIR=/caminho/para/suas/fotos
# OUTPUT_DIR=/caminho/para/fotos/organizadas

# Iniciar a aplicação
docker-compose up -d

# Acessar a aplicação no navegador: http://localhost:8080
```

#### Opção 1b: Com variáveis inline (Sem arquivo .env)

```bash
# Iniciar com variáveis de ambiente na mesma linha

SOURCE_DIR=/home/tbytecreator/Documents OUTPUT_DIR=/home/tbytecreato/Pictures docker-compose up -d

# Ou para Windows (PowerShell):

$env:SOURCE_DIR="C:/Users/seu_usuario/Imagens"; $env:OUTPUT_DIR="C:/Users/seu_usuario/Imagens_Organizadas"; docker-compose up -d

# Acessar a aplicação no navegador: http://localhost:8080
```

#### Opção 1c: Editar docker-compose.yml diretamente

```bash
# Abrir e editar o arquivo docker-compose.yml
# Substituir os valores entre ${}:
# volumes:
#   - /caminho/absoluto/suas/fotos:/app/arquivos
#   - /caminho/absoluto/fotos/organizadas:/app/organizados

docker-compose up -d
```

### 2. Usando Docker Diretamente

```bash
# Build da imagem
docker build -t organize-photos .

# Executar o container
docker run -d \
  -p 8080:8080 \
  -v /:/app/root \
  --name organize_photos_web \
  organize-photos

# Acessar em http://localhost:8080
```

**Nota:** O volume `-v /:/app/root` permite acesso ao sistema de arquivos
 inteiro. Ajuste conforme sua necessidade de segurança.

## 💻 Desenvolvimento Local

### Setup

```bash
# Instalar dependências
cargo build

# Executar em desenvolvimento
cargo run

# A aplicação rodará em http://localhost:8080
```

## 🐛 Debugging com Visual Studio Code

### 1. Instalar Extensões Recomendadas

Abra o VS Code neste projeto e você verá uma sugestão para instalar as
extensões recomendadas, ou instale manualmente:

```ascii
- Rust Analyzer (rust-lang.rust-analyzer)
- CodeLLDB (vadimcn.vscode-lldb)
- Even Better TOML (tamasfe.even-better-toml)
- Crates (serayuzgur.crates)
- Error Lens (usernamehw.errorlens)
```

Clique em "Install" na notificação que aparece, ou:

```bash
code --install-extension rust-lang.rust-analyzer
code --install-extension vadimcn.vscode-lldb
code --install-extension tamasfe.even-better-toml
code --install-extension serayuzgur.crates
code --install-extension usernamehw.errorlens
```

### 2. Configurações Incluídas

O projeto inclui configurações de debug pré-configuradas em `.vscode/`:

- **launch.json**: Configurações para iniciar o debugger
- **tasks.json**: Tasks para build, run, test, clippy, etc.
- **settings.json**: Configurações do Rust Analyzer e editor
- **extensions.json**: Extensões recomendadas

### 3. Executar com Debugging

#### Opção 1: Via Command Palette

```powershell
Ctrl+Shift+D (ou Cmd+Shift+D no Mac)
```

Selecione uma das configurações de debug:

- **Rust: Debug (LLDB)** - Debug mode com breakpoints
- **Rust: Release Build** - Otimizado para release
- **Rust: Run with Cargo** - Executa normalmente
- **Rust: Attach to Process** - Conecta a um processo em execução

#### Opção 2: Via Tasks (Ctrl+Shift+B)

```bash
Ctrl+Shift+B
```

Execute uma das tasks:

- `rust: cargo build (debug)` - Compila em modo debug
- `rust: cargo run` - Executa a aplicação
- `rust: cargo test` - Roda testes
- `rust: cargo clippy` - Verifica código
- `rust: cargo fmt` - Formata código

### 4. Colocar Breakpoints

1. Abra um arquivo `.rs`
2. Clique à esquerda do número da linha para adicionar um breakpoint (ponto vermelho)
3. Pressione `F5` ou vá em Run → Start Debugging
4. Quando o código atingir o breakpoint, ele pausará
5. Use as teclas de controle (F10 step over, F11 step into, etc.)

### 5. Debug da API Web

Para debugar a API web:

1. Coloque breakpoints em `src/main.rs`
2. Inicie com `F5` (Debug)
3. Abra 'http://localhost:8080' no navegador
4. Interaja com a interface'
5. O debugger pausará nos breakpoints

### 6. Variáveis de Ambiente

Durante o debug, as seguintes variáveis estão configuradas:

```bash
RUST_BACKTRACE=full     # Backtrace completo em panics
RUST_LOG=debug          # Nível de logging aumentado
```

Para mudar, edite `.vscode/launch.json`:

```json
"env": {
    "RUST_BACKTRACE": "full",
    "RUST_LOG": "debug"
}
```

### 7. Atalhos Úteis

| Atalho          | Função                      |
|-----------------|-----------------------------|
| `F5`            | Iniciar/Continuar debug     |
| `F6`            | Pausar                      |
| `Shift+F5`      | Parar                       |
| `F10`           | Step Over (próxima linha)   |
| `F11`           | Step Into (entra em função) |
| `Shift+F11`     | Step Out (sai da função)    |
| `Ctrl+K Ctrl+I` | Hover Info                  |
| `Ctrl+Shift+D`  | Abrir Debug View            |
| `Ctrl+Shift+B`  | Executar Task de Build      |

### 8. Console de Debug

Na aba "Debug Console" você pode:

- Ver logs em tempo real
- Inspecionar variáveis
- Executar expressões Rust
- Ver backtrace de crashes

### 9. Troubleshooting de Debug

#### Problema: "LLDB not found"

```bash
# No macOS, instale LLDB
brew install llvm

# No Linux (Ubuntu/Debian)
sudo apt-get install lldb

# No Windows
# CodeLLDB geralmente inclui LLDB, mas pode precisar do LLVM
```

#### Problema: Breakpoints não funcionam**

- Certifique-se de compilar em modo debug (não release)
- Verifique se o arquivo está salvo
- Recompile com `cargo clean && cargo build`

#### Problema: Debugger muito lento

- Use `cargo build --release` e debug against release build
- Reduza a quantidade de breakpoints
- Aumente `timeout` em launch.json

## 📁 Estrutura do Projeto

```ansi
OrganizePhotos/
├── .vscode/                  # Configurações do VS Code
│   ├── launch.json          # Configuração de debug
│   ├── tasks.json           # Tasks de build/run/test
│   ├── settings.json        # Settings do Rust Analyzer
│   └── extensions.json      # Extensões recomendadas
├── src/
│   └── main.rs              # Backend Rust com API REST e endpoints de listagem
├── static/
│   ├── index.html           # Interface Web com modal de seleção
│   ├── style.css            # Estilos responsivos (inclui modal)
│   └── script.js            # Lógica JavaScript e file browser
├── Cargo.toml               # Dependências Rust
├── Dockerfile               # Build Docker otimizado (multi-stage)
├── docker-compose.yml       # Orquestração dos containers
└── README.md                # Este arquivo
```

## 🔌 API Endpoints

### Health Check

```http
GET /health
```

Resposta:

```json
{
  "status": "ok",
  "message": "Servidor funcionando normalmente"
}
```

### Listar Diretórios

```http
POST /api/list-directory
```

Payload:

```json
{
  "path": "/home/usuario/Documentos"
}
```

Resposta:

```json
{
  "current_path": "/home/usuario/Documentos",
  "entries": [
    {
      "name": "fotos",
      "path": "/home/usuario/Documentos/fotos",
      "is_dir": true,
      "size": 0
    },
    {
      "name": "documento.pdf",
      "path": "/home/usuario/Documentos/documento.pdf",
      "is_dir": false,
      "size": 1048576
    }
  ],
  "parent_path": "/home/usuario"
}
```

### Organizar Arquivos

```http
POST /api/organize
```

Payload:

```json
{
  "source_dir": "/home/usuario/Documentos/fotos",
  "output_dir": "/home/usuario/Documentos/fotos-organizadas"
}
```

Resposta:

```json
{
  "success": true,
  "message": "Arquivos organizados com sucesso!",
  "files_processed": 42,
  "files": [
    {
      "name": "foto1.jpg",
      "date": "2024-01-15",
      "size": 2048576
    }
  ]
}
```

## 🎯 Como Funciona

### Interface de Seleção de Diretórios

1. **Selecionar Pasta de Origem**
   - Clique em "🔍 Selecionar Pasta" na seção "Diretório de Origem"
   - Um modal abrirá com um file browser interativo
   - Navegue pelos diretórios clicando nas pastas
   - Clique em ".." para voltar ao diretório pai
   - Confirme a seleção com o botão "Confirmar Seleção"

2. **Selecionar Pasta de Destino**
   - Repita o processo para o "Diretório de Destino"

3. **Organizar Arquivos**
   - Clique em "🚀 Organizar Arquivos"
   - O sistema processará todos os arquivos
   - Os resultados serão exibidos com lista dos arquivos processados

### Estrutura de Saída

Os arquivos são organizados em subpastas por data (formato YYYY-MM-DD):

```ascii
/home/usuario/Documentos/fotos-organizadas/
├── 2024-01-15/
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── documento.pdf
├── 2024-01-16/
│   └── foto3.jpg
└── 2024-01-20/
    └── foto4.jpg
```

## 🎨 Interface Interativa

### Modal de Seleção de Diretórios

- **Path Bar**: Exibe o caminho completo (editável)
- **Botão Atualizar**: Recarrega a listagem do diretório atual
- **Lista de Itens**:
  - 📁 Pastas (clicáveis para navegar)
  - 📄 Arquivos (apenas exibição)
  - ⬆️ Voltar (".." para diretório pai)
- **Barra de Rodapé**: Botões para cancelar ou confirmar seleção

### Responsividade

A interface se adapta automaticamente:

- **Desktop**: Layout completo com modais espaçosos
- **Tablet**: Compactado mas funcional
- **Mobile**: Otimizado para toque, modais full-screen

## 🐳 Gerenciamento do Container

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f organize_photos

# Parar a aplicação
docker-compose down

# Limpar volumes (remover dados)
docker-compose down -v

# Reconstruir imagem
docker-compose build --no-cache
```

## 🔧 Variáveis de Ambiente

- `RUST_LOG`: Nível de logging (default: `info`)
  - Opções: `debug`, `info`, `warn`, `error`

Exemplo:

```bash
docker run -e RUST_LOG=debug organize-photos
```

## 📊 Performance

- **Build**: ~2-3 minutos (primeira vez)
- **Inicialização**: <1 segundo
- **Listagem de Diretórios**: < 100ms (típico)
- **Processamento**: 1000+ arquivos por segundo

## 🚨 Troubleshooting

### Porta 8080 já está em uso

```bash
# Mudar porta no docker-compose.yml
ports:
  - "8081:8080"  # Usar 8081 ao invés de 8080
```

### Erro: "Caminho não existe"

- Certifique-se de que o diretório existe no sistema de arquivos
- Verifique as permissões de leitura da pasta

### Modal não abre

- Limpe o cache do navegador (Ctrl+Shift+Delete ou Cmd+Shift+Delete)
- Tente em um navegador diferente

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs --tail=50 organize_photos

# Reconstruir
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Permissão negada ao ler diretórios

No Linux/Mac, pode ser necessário executar com:

```bash
sudo docker-compose up -d
```

Ou ajustar permissões:

```bash
chmod 755 /caminho/do/diretorio
```

## 📝 Licença

Ver arquivo [LICENSE](LICENSE)

## 👨‍💻 Desenvolvimento

### Adicionar Novas Funcionalidades

1. **Backend**: Editar `src/main.rs`
   - Adicione novos handlers de rota
   - Estenda as structs de request/response conforme necessário

2. **Frontend**: Editar arquivos em `static/`
   - HTML: `index.html` - estrutura
   - CSS: `style.css` - estilos
   - JavaScript: `script.js` - lógica

3. **Dependências**: Atualizar `Cargo.toml`
   - Rodando `cargo add nomedependencia`

Para desenvolvimento contínuo:

```bash
cargo watch -x run
```

## 🎓 Stack Tecnológico

| Camada        | Tecnologia                | Motivo                      |
|---------------|---------------------------|-----------------------------|
| **Backend**   | Rust + Actix-web          | Performance, segurança      |
| **Frontend**  | HTML5 + CSS3 + Vanilla JS | Rápido, responsivo          |
| **Container** | Docker + Docker Compose   | Portabilidade, distribuição |
| **Build**     | Multi-stage Dockerfile    | Imagem otimizada e menor    |
| **APIs**      | RESTful JSON              | Simples, padronizado        |

## 🔒 Segurança

- Validação de caminhos no backend
- Erros informativos mas seguros
- Sem exposição de dados sensíveis
- Suporte a CORS (se necessário adicionar)

## 📞 Suporte

Para reportar bugs ou sugerir melhorias:

1. Verifique os logs: `docker-compose logs`
2. Teste localmente sem Docker: `cargo run`
3. Abra uma issue no repositório com:
   - Descrição do problema
   - Passos para reproduzir
   - Logs relevantes
   - SO e versão do Docker

---

### Exemplo de Estrutura Final

```ascii
organizados/
├── 2024-01-15/
│   ├── foto1.jpg
│   ├── foto2.jpg
│   └── documento.pdf
├── 2024-01-16/
│   └── foto3.jpg
└── 2024-01-20/
    └── foto4.jpg
```

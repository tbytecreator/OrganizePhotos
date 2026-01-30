# Stage 1: Build
FROM rust:latest as builder

WORKDIR /app

# Copiar arquivos do projeto
COPY Cargo.toml Cargo.lock* ./
COPY src ./src
COPY static ./static

# Build da aplicação
RUN cargo build --release

# Stage 2: Runtime
FROM debian:bookworm-slim

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar a aplicação compilada do stage anterior
COPY --from=builder /app/target/release/organize_files /app/organize_files
COPY --from=builder /app/static ./static

# Criar diretórios necessários
RUN mkdir -p ./arquivos ./organizados

# Exposar porta
EXPOSE 8080

# Variáveis de ambiente
ENV RUST_LOG=info

# Comando para iniciar a aplicação
CMD ["./organize_files"]

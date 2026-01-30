use actix_files::Files;
use actix_web::{web, App, HttpResponse, HttpServer, middleware};
use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Serialize)]
struct FileInfo {
    name: String,
    date: String,
    size: u64,
}

#[derive(Serialize)]
struct OrganizeResponse {
    success: bool,
    message: String,
    files_processed: usize,
    files: Vec<FileInfo>,
}

#[derive(Serialize)]
struct StatusResponse {
    status: String,
    message: String,
}

#[derive(Serialize)]
struct DirectoryEntry {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
}

#[derive(Serialize)]
struct DirectoryListing {
    current_path: String,
    entries: Vec<DirectoryEntry>,
    parent_path: Option<String>,
}

#[derive(Deserialize)]
struct OrganizeRequest {
    source_dir: String,
    output_dir: String,
}

#[derive(Deserialize)]
struct DirectoryRequest {
    path: String,
}

// Rota para organizar arquivos
async fn organize_handler(req: web::Json<OrganizeRequest>) -> HttpResponse {
    let source_dir = req.source_dir.trim();
    let output_base = req.output_dir.trim();
    
    // Validar se os diretórios existem
    if !Path::new(source_dir).exists() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: format!("Diretório de origem não existe: {}", source_dir),
        });
    }
    
    if !Path::new(output_base).exists() {
        if let Err(e) = fs::create_dir_all(output_base) {
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: format!("Erro ao criar diretório de saída: {}", e),
            });
        }
    }
    
    let mut files = Vec::new();
    let mut file_count = 0;
    
    for entry in WalkDir::new(source_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().is_file())
    {
        let file_path = entry.path();
        
        match organize_file(file_path, output_base) {
            Ok(destination) => {
                if let Ok(metadata) = fs::metadata(file_path) {
                    let modified = metadata.modified().ok();
                    let date = modified
                        .and_then(|m| {
                            let dt: DateTime<Local> = m.into();
                            Some(dt.format("%Y-%m-%d").to_string())
                        })
                        .unwrap_or_default();
                    
                    files.push(FileInfo {
                        name: file_path.file_name()
                            .and_then(|n| n.to_str())
                            .unwrap_or("unknown")
                            .to_string(),
                        date,
                        size: metadata.len(),
                    });
                    file_count += 1;
                }
            }
            Err(e) => {
                eprintln!("Erro ao processar {}: {}", file_path.display(), e);
            }
        }
    }
    
    HttpResponse::Ok().json(OrganizeResponse {
        success: true,
        message: "Arquivos organizados com sucesso!".to_string(),
        files_processed: file_count,
        files,
    })
}

// Rota para listar diretórios
async fn list_directory_handler(req: web::Json<DirectoryRequest>) -> HttpResponse {
    let path = req.path.trim();
    
    // Usar "/" como padrão para o diretório raiz
    let target_path = if path.is_empty() || path == "/" {
        PathBuf::from("/")
    } else {
        PathBuf::from(path)
    };
    
    // Verificar se o caminho existe
    if !target_path.exists() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: format!("Caminho não existe: {}", path),
        });
    }
    
    // Verificar se é um diretório
    if !target_path.is_dir() {
        return HttpResponse::BadRequest().json(StatusResponse {
            status: "error".to_string(),
            message: format!("O caminho não é um diretório: {}", path),
        });
    }
    
    let mut entries = Vec::new();
    
    // Listar conteúdo do diretório
    match fs::read_dir(&target_path) {
        Ok(entries_iter) => {
            for entry in entries_iter {
                if let Ok(entry) = entry {
                    if let Ok(metadata) = entry.metadata() {
                        if let Some(file_name) = entry.file_name().to_str() {
                            let path_str = entry.path().to_string_lossy().to_string();
                            entries.push(DirectoryEntry {
                                name: file_name.to_string(),
                                path: path_str,
                                is_dir: metadata.is_dir(),
                                size: metadata.len(),
                            });
                        }
                    }
                }
            }
        }
        Err(e) => {
            return HttpResponse::InternalServerError().json(StatusResponse {
                status: "error".to_string(),
                message: format!("Erro ao ler diretório: {}", e),
            });
        }
    }
    
    // Ordenar: diretórios primeiro, depois arquivos
    entries.sort_by(|a, b| {
        if a.is_dir == b.is_dir {
            a.name.cmp(&b.name)
        } else {
            b.is_dir.cmp(&a.is_dir)
        }
    });
    
    // Calcular caminho do pai
    let parent_path = if target_path.parent().is_some() && target_path != PathBuf::from("/") {
        target_path.parent().map(|p| p.to_string_lossy().to_string())
    } else {
        None
    };
    
    HttpResponse::Ok().json(DirectoryListing {
        current_path: target_path.to_string_lossy().to_string(),
        entries,
        parent_path,
    })
}

// Rota para health check
async fn health_handler() -> HttpResponse {
    HttpResponse::Ok().json(StatusResponse {
        status: "ok".to_string(),
        message: "Servidor funcionando normalmente".to_string(),
    })
}

fn organize_file(source: &Path, output_base: &str) -> std::io::Result<PathBuf> {
    let metadata = fs::metadata(source)?;
    let modified = metadata.modified()?;
    let datetime: DateTime<Local> = modified.into();
    let date_folder = datetime.format("%Y-%m-%d").to_string();
    
    let filename = source
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("arquivo_desconhecido");
    
    let destination_dir = Path::new(output_base).join(&date_folder);
    let destination_file = destination_dir.join(filename);
    
    fs::create_dir_all(&destination_dir)?;
    fs::copy(source, &destination_file)?;
    
    Ok(destination_file)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Iniciando OrganizePhotos Web Server na porta 8080...");
    println!("📖 Acesse: http://localhost:8080");
    
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .route("/health", web::get().to(health_handler))
            .route("/api/organize", web::post().to(organize_handler))
            .route("/api/list-directory", web::post().to(list_directory_handler))
            .service(Files::new("/", "./static").index_file("index.html"))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}

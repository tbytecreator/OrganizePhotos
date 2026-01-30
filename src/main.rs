use chrono::{DateTime, Local};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

fn main() {
    // Diretório de origem (mudar conforme necessário)
    let source_dir = "./arquivos";
    
    // Diretório de saída base
    let output_base = "./organizados";
    
    // Criar diretório base se não existir
    if !Path::new(output_base).exists() {
        fs::create_dir_all(output_base)
            .expect("Erro ao criar diretório de saída");
    }
    
    println!("🔍 Lendo arquivos de: {}", source_dir);
    println!("📁 Organizando em: {}\n", output_base);
    
    // Iterar por todos os arquivos no diretório
    for entry in WalkDir::new(source_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().is_file())
    {
        let file_path = entry.path();
        
        match organize_file(file_path, output_base) {
            Ok(destination) => {
                println!("✅ {} → {}", 
                    file_path.display(),
                    destination.display()
                );
            }
            Err(e) => {
                println!("❌ Erro processando {}: {}", 
                    file_path.display(), 
                    e
                );
            }
        }
    }
    
    println!("\n✨ Processo concluído!");
}

fn organize_file(source: &Path, output_base: &str) -> std::io::Result<std::path::PathBuf> {
    // Ler metadados do arquivo
    let metadata = fs::metadata(source)?;
    
    // Obter a data de modificação
    let modified = metadata.modified()?;
    let datetime: DateTime<Local> = modified.into();
    
    // Formatar data como YYYY-MM-DD
    let date_folder = datetime.format("%Y-%m-%d").to_string();
    
    // Obter nome do arquivo
    let filename = source
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or("arquivo_desconhecido");
    
    // Construir caminho de destino
    let destination_dir = Path::new(output_base).join(&date_folder);
    let destination_file = destination_dir.join(filename);
    
    // Criar diretório de destino se não existir
    fs::create_dir_all(&destination_dir)?;
    
    // Copiar arquivo
    fs::copy(source, &destination_file)?;
    
    Ok(destination_file)
}

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const organizeBtn = document.getElementById('organizeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const retryBtn = document.getElementById('retryBtn');
    
    // Source browser
    const browseSourceBtn = document.getElementById('browsSourceBtn');
    const sourceBrowserModal = document.getElementById('sourceBrowserModal');
    const closeSourceModal = document.getElementById('closeSourceModal');
    const cancelSourceBtn = document.getElementById('cancelSourceBtn');
    const confirmSourceBtn = document.getElementById('confirmSourceBtn');
    const sourceBrowserPath = document.getElementById('sourceBrowserPath');
    const sourceBrowserList = document.getElementById('sourceBrowserList');
    const sourceBrowserRefresh = document.getElementById('sourceBrowserRefresh');
    const sourcePathDisplay = document.getElementById('sourcePath');
    
    // Output browser
    const browseOutputBtn = document.getElementById('browseOutputBtn');
    const outputBrowserModal = document.getElementById('outputBrowserModal');
    const closeOutputModal = document.getElementById('closeOutputModal');
    const cancelOutputBtn = document.getElementById('cancelOutputBtn');
    const confirmOutputBtn = document.getElementById('confirmOutputBtn');
    const outputBrowserPath = document.getElementById('outputBrowserPath');
    const outputBrowserList = document.getElementById('outputBrowserList');
    const outputBrowserRefresh = document.getElementById('outputBrowserRefresh');
    const outputPathDisplay = document.getElementById('outputPath');
    
    // State
    let selectedSourcePath = '/app/arquivos';
    let selectedOutputPath = '/app/organizados';
    let currentSourceBrowserPath = '/app/arquivos';
    let currentOutputBrowserPath = '/app/organizados';

    // Verificar saúde do servidor
    checkServerHealth();

    // Event listeners - Source Browser
    browseSourceBtn.addEventListener('click', () => {
        currentSourceBrowserPath = selectedSourcePath;
        sourceBrowserPath.value = currentSourceBrowserPath;
        loadDirectory('source');
        sourceBrowserModal.style.display = 'flex';
    });

    closeSourceModal.addEventListener('click', () => {
        sourceBrowserModal.style.display = 'none';
    });

    cancelSourceBtn.addEventListener('click', () => {
        sourceBrowserModal.style.display = 'none';
    });

    confirmSourceBtn.addEventListener('click', () => {
        selectedSourcePath = currentSourceBrowserPath;
        sourcePathDisplay.textContent = selectedSourcePath;
        sourceBrowserModal.style.display = 'none';
    });

    sourceBrowserRefresh.addEventListener('click', () => {
        loadDirectory('source');
    });

    sourceBrowserPath.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentSourceBrowserPath = sourceBrowserPath.value;
            loadDirectory('source');
        }
    });

    // Event listeners - Output Browser
    browseOutputBtn.addEventListener('click', () => {
        currentOutputBrowserPath = selectedOutputPath;
        outputBrowserPath.value = currentOutputBrowserPath;
        loadDirectory('output');
        outputBrowserModal.style.display = 'flex';
    });

    closeOutputModal.addEventListener('click', () => {
        outputBrowserModal.style.display = 'none';
    });

    cancelOutputBtn.addEventListener('click', () => {
        outputBrowserModal.style.display = 'none';
    });

    confirmOutputBtn.addEventListener('click', () => {
        selectedOutputPath = currentOutputBrowserPath;
        outputPathDisplay.textContent = selectedOutputPath;
        outputBrowserModal.style.display = 'none';
    });

    outputBrowserRefresh.addEventListener('click', () => {
        loadDirectory('output');
    });

    outputBrowserPath.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentOutputBrowserPath = outputBrowserPath.value;
            loadDirectory('output');
        }
    });

    // Event listeners - Main
    organizeBtn.addEventListener('click', handleOrganize);
    resetBtn.addEventListener('click', resetForm);
    retryBtn.addEventListener('click', resetForm);

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === sourceBrowserModal) {
            sourceBrowserModal.style.display = 'none';
        }
        if (e.target === outputBrowserModal) {
            outputBrowserModal.style.display = 'none';
        }
    });

    async function checkServerHealth() {
        try {
            const response = await fetch('/health');
            if (!response.ok) {
                showError('Servidor indisponível. Tente recarregar a página.');
            }
        } catch (error) {
            showError('Erro ao conectar ao servidor: ' + error.message);
        }
    }

    async function loadDirectory(type) {
        const path = type === 'source' ? currentSourceBrowserPath : currentOutputBrowserPath;
        const listElement = type === 'source' ? sourceBrowserList : outputBrowserList;
        const pathInput = type === 'source' ? sourceBrowserPath : outputBrowserPath;

        listElement.innerHTML = '<div style="text-align: center; padding: 2rem; color: #999;">Carregando...</div>';

        try {
            const response = await fetch('/api/list-directory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                listElement.innerHTML = `<div style="padding: 1rem; color: #d32f2f;">${errorData.message}</div>`;
                return;
            }

            const data = await response.json();
            pathInput.value = data.current_path;

            // Atualizar caminho
            if (type === 'source') {
                currentSourceBrowserPath = data.current_path;
            } else {
                currentOutputBrowserPath = data.current_path;
            }

            // Limpar lista
            listElement.innerHTML = '';

            // Adicionar botão "Voltar" se há caminho pai
            if (data.parent_path) {
                const parentItem = document.createElement('div');
                parentItem.className = 'browser-item';
                parentItem.innerHTML = `
                    <span class="browser-item-icon">⬆️</span>
                    <span class="browser-item-name">..</span>
                `;
                parentItem.addEventListener('click', () => {
                    if (type === 'source') {
                        currentSourceBrowserPath = data.parent_path;
                    } else {
                        currentOutputBrowserPath = data.parent_path;
                    }
                    loadDirectory(type);
                });
                listElement.appendChild(parentItem);
            }

            // Renderizar itens
            if (data.entries.length === 0) {
                listElement.innerHTML += '<div style="padding: 1rem; text-align: center; color: #999;">Diretório vazio</div>';
            } else {
                data.entries.forEach(entry => {
                    const item = document.createElement('div');
                    item.className = 'browser-item';
                    
                    const icon = entry.is_dir ? '📁' : '📄';
                    const size = entry.is_dir ? '' : `<span class="browser-item-size">${formatFileSize(entry.size)}</span>`;
                    
                    item.innerHTML = `
                        <span class="browser-item-icon">${icon}</span>
                        <span class="browser-item-name">${entry.name}</span>
                        ${size}
                    `;
                    
                    // Navegar para diretórios ao clicar
                    if (entry.is_dir) {
                        item.style.cursor = 'pointer';
                        item.addEventListener('click', () => {
                            if (type === 'source') {
                                currentSourceBrowserPath = entry.path;
                            } else {
                                currentOutputBrowserPath = entry.path;
                            }
                            loadDirectory(type);
                        });
                    } else {
                        item.style.cursor = 'default';
                    }
                    
                    listElement.appendChild(item);
                });
            }
        } catch (error) {
            listElement.innerHTML = `<div style="padding: 1rem; color: #d32f2f;">Erro: ${error.message}</div>`;
        }
    }

    async function handleOrganize() {
        if (!selectedSourcePath || selectedSourcePath === '/') {
            showError('Selecione um diretório de origem válido.');
            return;
        }

        if (!selectedOutputPath || selectedOutputPath === '/') {
            showError('Selecione um diretório de destino válido.');
            return;
        }

        // Desabilitar botão e mostrar loading
        organizeBtn.disabled = true;
        showLoading();

        try {
            const response = await fetch('/api/organize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_dir: selectedSourcePath,
                    output_dir: selectedOutputPath,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao organizar arquivos');
            }

            const data = await response.json();
            
            if (data.success) {
                showResults(data);
            } else {
                showError(data.message || 'Erro desconhecido ao organizar arquivos');
            }
        } catch (error) {
            showError('Erro: ' + error.message);
        } finally {
            organizeBtn.disabled = false;
            hideLoading();
        }
    }

    function showLoading() {
        document.getElementById('loadingSection').style.display = 'flex';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
    }

    function hideLoading() {
        document.getElementById('loadingSection').style.display = 'none';
    }

    function showResults(data) {
        const resultsSection = document.getElementById('resultsSection');
        const successMessage = document.getElementById('successMessage');
        const filesProcessed = document.getElementById('filesProcessed');
        const filesList = document.getElementById('filesList');

        successMessage.textContent = data.message;
        filesProcessed.textContent = data.files_processed;

        // Renderizar lista de arquivos
        filesList.innerHTML = '';
        if (data.files && data.files.length > 0) {
            data.files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <span class="file-name" title="${file.name}">📄 ${file.name}</span>
                    <span class="file-date">${file.date}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                `;
                filesList.appendChild(fileItem);
            });
        } else {
            filesList.innerHTML = '<p style="text-align: center; color: #999;">Nenhum arquivo para exibir.</p>';
        }

        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
        resultsSection.style.display = 'block';

        // Scroll suave para os resultados
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function showError(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');

        errorMessage.textContent = message;
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        errorSection.style.display = 'block';

        // Scroll suave para o erro
        errorSection.scrollIntoView({ behavior: 'smooth' });
    }

    function resetForm() {
        selectedSourcePath = '/';
        selectedOutputPath = '/';
        sourcePathDisplay.textContent = '/';
        outputPathDisplay.textContent = '/';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('errorSection').style.display = 'none';
        document.getElementById('loadingSection').style.display = 'none';
        organizeBtn.focus();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
});

async function startTest() {
    // Mostrando estado inicial
    document.getElementById('network-info').innerText = "Testando...";

    // Usando a API do Speedtest para medir a velocidade
    try {
        const response = await fetch('https://www.speedtest.net/api/js/speedtest?https_function=ping');
        const data = await response.json();

        // Atualizando valores na interface
        document.getElementById('download-speed').innerText = `${(data.download / 1024 / 1024).toFixed(2)} Mbps`;
        document.getElementById('upload-speed').innerText = `${(data.upload / 1024 / 1024).toFixed(2)} Mbps`;
        document.getElementById('ping').innerText = `${data.ping} ms`;
        document.getElementById('network-info').innerText = `Servidor: ${data.server.name}, Localização: ${data.server.location}`;
    } catch (error) {
        document.getElementById('network-info').innerText = "Erro ao realizar o teste.";
    }
}
let funcionarioSelecionado = null;

const API_BASE_URL = "http://127.0.0.1:8080/";  // url do backend

// darregar funcionarios
window.onload = function() {
    fetch(`${API_BASE_URL}funcionarios`)  
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(funcionarios => {
            let funcionariosDiv = document.getElementById('funcionarios');
            funcionarios.forEach(funcionario => {
                let btn = document.createElement('button');
                btn.innerHTML = funcionario.nome;
                btn.onclick = function() {
                    funcionarioSelecionado = funcionario;
                    document.getElementById('funcionarios').style.display = 'none';
                    document.getElementById('problemas').style.display = 'block';
                };
                funcionariosDiv.appendChild(btn);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar funcionários:', error);
        });
}

// report de problema
function reportarProblema(tipo) {
    if (!funcionarioSelecionado) return;

    fetch(`${API_BASE_URL}reports/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tipo: tipo,
            funcionario: { codigo: funcionarioSelecionado.codigo },
            setor: { codigo: funcionarioSelecionado.setor.codigo }
        })
    }).then(response => response.text())
      .then(message => {
          alert(message);
          window.location.reload();  
      });
}
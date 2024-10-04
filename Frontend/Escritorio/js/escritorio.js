const API_BASE_URL = "http://127.0.0.1:8080/";  

window.onload = function() {
  fetch(`${API_BASE_URL}setores/listar`) // naooo tem /
  .then(response => {
      if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      return response.json();
  })
  .then(setores => {
      if (!Array.isArray(setores)) {
          throw new Error("Resposta não é um array.");
      }
      let setorSelect = document.getElementById('setorFuncionario');
      let setorRelatorio = document.getElementById('setorRelatorio');
      setores.forEach(setor => {
          let option = new Option(setor.nome, setor.codigo);
          setorSelect.add(option);
          setorRelatorio.add(option.cloneNode(true));
      });
  })
  .catch(error => {
      console.error('Erro ao carregar setores:', error);
  });
}

// cadastrar novo setor
document.getElementById('form-setor').addEventListener('submit', function(e) {
    e.preventDefault();
    let nomeSetor = document.getElementById('nomeSetor').value;

    fetch(`${API_BASE_URL}setores/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeSetor })
    })
    .then(response => {
        return response.text() 
            .then(text => {
                if (!response.ok) {
                    throw new Error(text); 
                }
                return text; 
            });
    })
    .then(result => {
        alert("Setor cadastrado com sucesso.");
       
        let setorSelect = document.getElementById('setorFuncionario');
        let setorRelatorio = document.getElementById('setorRelatorio');
        
        let newOption = new Option(nomeSetor, result.codigo); 
        setorSelect.add(newOption);
        setorRelatorio.add(newOption.cloneNode(true));

        document.getElementById('nomeSetor').value = ''; 
    })
    .catch(error => {
        console.error('Erro ao cadastrar setor:', error);
        alert(`Erro: ${error.message}`);
    });
});

// cadastrar funcionario
document.getElementById('form-funcionario').addEventListener('submit', function(e) {
    e.preventDefault();
    let nome = document.getElementById('nomeFuncionario').value;
    let email = document.getElementById('emailFuncionario').value;
    let senha = document.getElementById('senhaFuncionario').value;
    let setor = document.getElementById('setorFuncionario').value;

    fetch(`${API_BASE_URL}funcionarios/cadastrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, setor: { codigo: setor } })
    })
    .then(response => {
        return response.text().then(alert);
    })
    .then(() => {
        
        document.getElementById('nomeFuncionario').value = ''; 
        document.getElementById('emailFuncionario').value = ''; 
        document.getElementById('senhaFuncionario').value = ''; 
        document.getElementById('setorFuncionario').value = ''; 
    })
    .catch(error => {
        console.error('Erro ao cadastrar funcionário:', error);
        alert(`Erro: ${error.message}`);
    });
});

// ver relatorios
document.getElementById('btnRelatorio').addEventListener('click', function() {
    let setorId = document.getElementById('setorRelatorio').value;
  
    fetch(`${API_BASE_URL}reports/setor/${setorId}`)
        .then(response => response.json())
        .then(reports => {
            let output = '';
            reports.forEach(report => {
                 // format da data
                 const dataFormatada = new Date(report.data).toLocaleDateString("pt-BR");
                 output += `Tipo: ${report.tipo} - Data: ${dataFormatada}<br>`;
            });
            document.getElementById('relatorio').innerHTML = output;
        });
  });
  
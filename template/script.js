let transacoes = [];
let salario = 0.0;

function salvarSalario() {
    salario = parseFloat(document.getElementById("salario").value);
    localStorage.setItem("salario", salario);
    exibirSalario();
}

function exibirSalario() {
    const salarioInfo = document.getElementById("salario-info");
    const saldoDisponivel = salario - transacoes.reduce((total, transacao) => total + transacao.valorTotal, 0);
    salarioInfo.innerHTML = `
        <p>Salário: R$ ${salario.toFixed(2)}</p>
        <p>Saldo Disponível: R$ ${saldoDisponivel.toFixed(2)}</p>
    `;
}

function adicionarTransacao() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const parcelas = parseInt(document.getElementById("parcelas").value);
    const categoria = document.getElementById("categoria").value;
    const tipo = document.getElementById("tipo").value;
    const data = document.getElementById("data").value;

    if (!descricao || !valor || !parcelas || !categoria || !data) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const valorTotal = valor * parcelas;

    const transacao = {
        descricao,
        valor,
        tipo,
        categoria,
        data,
        valorTotal
    };

    transacoes.push(transacao);
    adicionarLinhaTabela(transacao);
    exibirSalario();
}

function adicionarLinhaTabela(transacao) {
    const tableBody = document.querySelector("#transacoes tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${transacao.descricao}</td>
        <td>R$ ${transacao.valor.toFixed(2)}</td>
        <td>${transacao.tipo}</td>
        <td>${transacao.categoria}</td>
        <td>${transacao.data}</td>
        <td>R$ ${transacao.valorTotal.toFixed(2)}</td>
        <td><button onclick="excluirTransacao('${transacao.descricao}')">Excluir</button></td>
    `;
    
    tableBody.appendChild(row);
}

function excluirTransacao(descricao) {
    transacoes = transacoes.filter(transacao => transacao.descricao !== descricao);
    atualizarTabela();
    exibirSalario();
}

function atualizarTabela() {
    const tableBody = document.querySelector("#transacoes tbody");
    tableBody.innerHTML = "";
    transacoes.forEach(transacao => adicionarLinhaTabela(transacao));
}

function gerarGrafico() {
    const categorias = transacoes.reduce((acc, transacao) => {
        acc[transacao.categoria] = (acc[transacao.categoria] || 0) + transacao.valorTotal;
        return acc;
    }, {});

    const labels = Object.keys(categorias);
    const data = Object.values(categorias);

    const ctx = document.createElement("canvas");
    document.body.appendChild(ctx);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gastos por Categoria',
                data: data,
                backgroundColor: 'skyblue',
                borderColor: 'blue',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Função para gerar gráfico de pizza
function gerarGraficoPizza() {
    const ctx = document.getElementById('graficoPizza').getContext('2d');
    const graficoPizza = new Chart(ctx, {
        type: 'pie', // Tipo de gráfico (pizza)
        data: {
            labels: ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4'], // Labels das categorias
            datasets: [{
                label: 'Distribuição das Despesas',
                data: [30, 20, 25, 25], // Dados de cada categoria (valores percentuais)
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'], // Cores das fatias
                hoverOffset: 4 // Efeito de hover nas fatias
            }]
        },
        options: {
            responsive: true, // Faz o gráfico se ajustar ao tamanho da tela
            plugins: {
                legend: {
                    position: 'top', // Posiciona a legenda no topo
                },
                tooltip: {
                    enabled: true // Habilita as dicas de ferramenta
                }
            }
        }
    });
}



document.getElementById("toggle-right-side").addEventListener("click", function () {
    const rightSide = document.querySelector(".right-side");
    if (rightSide.style.display === "none" || !rightSide.style.display) {
      rightSide.style.display = "block";
    } else {
      rightSide.style.display = "none";
    }
  });
  

// Carregar salário do localStorage ao carregar a página
window.onload = () => {
    const savedSalario = localStorage.getItem("salario");
    if (savedSalario) {
        salario = parseFloat(savedSalario);
        exibirSalario();
    }
};

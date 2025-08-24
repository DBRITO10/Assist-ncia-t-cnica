let operacaoAtual = null;
let produtoNomeAtual = null;

function salvarProduto(){
  let nome = document.getElementById("nome").value;
  let quantidade = document.getElementById("quantidade").value;
  let preco = document.getElementById("preco").value;

  if(nome === "" || quantidade === "" || preco === ""){
    alert("Preencha todos os campos!");
    return;
  }

  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  produtos.push({nome, quantidade: parseInt(quantidade), preco});
  localStorage.setItem("produtos", JSON.stringify(produtos));

  registrarHistorico(nome, "Entrada (Cadastro)", quantidade);
  listarProdutos();
  document.getElementById("nome").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("preco").value = "";
}

function listarProdutos(){
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  let busca = document.getElementById("busca").value?.toLowerCase() || "";
  let tabela = document.querySelector("#tabela tbody");
  tabela.innerHTML = "";

  // Ordenar por quantidade desc
  produtos.sort((a, b) => b.quantidade - a.quantidade);

  let role = localStorage.getItem("userRole");

  produtos
    .filter(p => p.nome.toLowerCase().includes(busca))
    .forEach((p, index) => {
      let botoes = `
        <button onclick="abrirModal('entrada', '${p.nome}')">Entrada</button>
        <button onclick="abrirModal('saida', '${p.nome}')">Saída</button>
      `;

      // Apenas admin pode excluir
      if(role === "admin"){
        botoes += `<button onclick="excluirProduto('${p.nome}')">Excluir</button>`;
      }

      let row = `<tr>
        <td>${p.nome}</td>
        <td>${p.quantidade}</td>
        <td>R$ ${p.preco}</td>
        <td>${botoes}</td>
      </tr>`;
      tabela.innerHTML += row;
  });
}

function abrirModal(operacao, nome){
  let modal = document.getElementById("modal");
  let titulo = document.getElementById("modalTitulo");

  operacaoAtual = operacao;
  produtoNomeAtual = nome;

  if(operacao === "entrada"){
    titulo.innerText = "Entrada de " + nome;
  } else {
    titulo.innerText = "Saída de " + nome;
  }

  modal.style.display = "flex";
}

function fecharModal(){
  let modal = document.getElementById("modal");
  modal.style.display = "none";
  document.getElementById("modalQuantidade").value = "";
}

function confirmarMovimentacao(){
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  let qtd = parseInt(document.getElementById("modalQuantidade").value);

  if(isNaN(qtd) || qtd <= 0){
    alert("Digite uma quantidade válida!");
    return;
  }

  // Encontrar o produto pelo nome
  let produto = produtos.find(p => p.nome === produtoNomeAtual);
  if(!produto){
    alert("Produto não encontrado!");
    return;
  }

  if(operacaoAtual === "entrada"){
    produto.quantidade += qtd;
    registrarHistorico(produto.nome, "Entrada", qtd);
  } else if(operacaoAtual === "saida"){
    if(produto.quantidade < qtd){
      alert("Estoque insuficiente!");
      return;
    }
    produto.quantidade -= qtd;
    registrarHistorico(produto.nome, "Saída", qtd);
  }

  localStorage.setItem("produtos", JSON.stringify(produtos));
  listarProdutos();
  fecharModal();
}

function excluirProduto(nome){
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  if(confirm("Tem certeza que deseja excluir este produto?")){
    // Encontrar o produto pelo nome
    let produtoIndex = produtos.findIndex(p => p.nome === nome);
    if(produtoIndex === -1){
      alert("Produto não encontrado para exclusão!");
      return;
    }
    let produto = produtos[produtoIndex];
    registrarHistorico(produto.nome, "Exclusão", produto.quantidade);
    produtos.splice(produtoIndex, 1);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    listarProdutos();
  }
}

function registrarHistorico(produto, tipo, quantidade){
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  let usuario = localStorage.getItem("userRole");
  let data = new Date().toLocaleString();
  historico.push({data, usuario, produto, tipo, quantidade});
  localStorage.setItem("historico", JSON.stringify(historico));
}

function logout(){
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
}

window.onload = () => {
  let role = localStorage.getItem("userRole");

  // Se não for admin, esconder o formulário de cadastro
  if(role !== "admin"){
    document.getElementById("cadastroProduto").style.display = "none";
  }

  listarProdutos();
};

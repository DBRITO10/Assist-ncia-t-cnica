let operacaoAtual = null;
let produtoIndexAtual = null;

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

  produtos.filter(p => p.nome.toLowerCase().includes(busca)).forEach((p, index) => {
    let row = `<tr>
      <td>${p.nome}</td>
      <td>${p.quantidade}</td>
      <td>R$ ${p.preco}</td>
      <td>
        <button onclick="abrirModal('entrada', ${index})">Entrada</button>
        <button onclick="abrirModal('saida', ${index})">Saída</button>
        <button onclick="excluirProduto(${index})" style="background:#dc3545">Excluir</button>
      </td>
    </tr>`;
    tabela.innerHTML += row;
  });
}

function abrirModal(operacao, index){
  operacaoAtual = operacao;
  produtoIndexAtual = index;
  document.getElementById("modalTitulo").innerText = operacao === "entrada" ? "Entrada de Produto" : "Saída de Produto";
  document.getElementById("modalQuantidade").value = "";
  document.getElementById("modal").style.display = "block";
}

function fecharModal(){
  document.getElementById("modal").style.display = "none";
  operacaoAtual = null;
  produtoIndexAtual = null;
}

function confirmarMovimentacao(){
  let qtd = parseInt(document.getElementById("modalQuantidade").value);
  if(isNaN(qtd) || qtd <= 0){
    alert("Quantidade inválida!");
    return;
  }

  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  if(produtoIndexAtual === null) return;

  if(operacaoAtual === "entrada"){
    produtos[produtoIndexAtual].quantidade += qtd;
    registrarHistorico(produtos[produtoIndexAtual].nome, "Entrada", qtd);
  } else if(operacaoAtual === "saida"){
    if(produtos[produtoIndexAtual].quantidade < qtd){
      alert("Estoque insuficiente!");
      return;
    }
    produtos[produtoIndexAtual].quantidade -= qtd;
    registrarHistorico(produtos[produtoIndexAtual].nome, "Saída", qtd);
  }

  localStorage.setItem("produtos", JSON.stringify(produtos));
  listarProdutos();
  fecharModal();
}

function excluirProduto(index){
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  if(confirm("Tem certeza que deseja excluir este produto?")){
    let produto = produtos[index];
    registrarHistorico(produto.nome, "Exclusão", produto.quantidade);
    produtos.splice(index, 1);
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

window.onload = listarProdutos;

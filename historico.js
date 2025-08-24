function listarHistorico(){
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  let filtro = document.getElementById("filtro")?.value || "Todos";
  let tabela = document.querySelector("#tabela tbody");
  let userRole = localStorage.getItem("userRole");

  tabela.innerHTML = "";

  historico
    .filter(h => filtro === "Todos" || h.tipo === filtro)
    .forEach((h, index) => {
      let botoes = '';
      if (userRole === "admin") {
        botoes = `<button onclick="excluirHistorico(${index})">Excluir</button>`;
      }

      let row = `<tr>
        <td>${h.data}</td>
        <td>${h.usuario}</td>
        <td>${h.produto}</td>
        <td class="tipo-${h.tipo}">${h.tipo}</td>
        <td>${h.quantidade}</td>
        <td>${botoes}</td>
      </tr>`;
      tabela.innerHTML += row;
    });
}

function excluirHistorico(index){
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  if(confirm("Tem certeza que deseja excluir este item do histórico?")){
    historico.splice(index, 1);
    localStorage.setItem("historico", JSON.stringify(historico));
    listarHistorico();
  }
}

function logout(){
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
}

window.onload = listarHistorico;

function listarHistorico(){
  let historico = JSON.parse(localStorage.getItem("historico")) || [];
  let tabela = document.querySelector("#tabela tbody");
  tabela.innerHTML = "";
  historico.forEach(h => {
    let row = `<tr>
      <td>${h.data}</td>
      <td>${h.usuario}</td>
      <td>${h.produto}</td>
      <td>${h.tipo}</td>
      <td>${h.quantidade}</td>
    </tr>`;
    tabela.innerHTML += row;
  });
}

function logout(){
  localStorage.removeItem("userRole");
  window.location.href = "index.html";
}

window.onload = listarHistorico;
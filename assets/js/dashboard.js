// Adiciona a classe "hovered" ao item selecionado
let list = document.querySelectorAll(".navigation li");

function activeLink() {
  list.forEach((item) => {
    item.classList.remove("hovered"); // Remove "hovered" de todos os itens
  });
  this.classList.add("hovered"); // Adiciona "hovered" ao item atual
}

// Adiciona o evento de "mouseover" a cada item da lista de navegação
list.forEach((item) => item.addEventListener("mouseover", activeLink));

// Alternância do menu (abre e fecha o menu lateral)
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active"); // Adiciona ou remove a classe "active" da navegação
  main.classList.toggle("active"); // Adiciona ou remove a classe "active" do conteúdo principal
};



import { setDragging, getDragging } from '../main.js';

const btSettings = [...document.querySelectorAll(".btnArray")];
const localSettings = document.getElementById("localSettings");
let bool = true;

btSettings.forEach(btn => {
  btn.addEventListener("click", () => {
    if (bool) {
      localSettings.style.display = "block";
      bool = false;
      setDragging(false); // Alterando o valor
    } else {
      localSettings.style.display = "none";
      bool = true;
      setDragging(true);
    }
  });
});

console.log(getDragging()); 
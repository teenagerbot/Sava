"use strict";
const Server = new io();
function $(selector) {
  return document.querySelector(selector);
}

function find(el, selector) {
  let finded;
  return (finded = el.querySelector(selector)) ? finded : null;
}

function siblings(el) {
  const siblings = [];
  for (let sibling of el.parentNode.children) {
    if (sibling !== el) {
      siblings.push(sibling);
    }
  }
  return siblings;
}

if (window.innerWidth < 767) {
  sidebar.classList.add("show-sidebar");
}

window.addEventListener("resize", function () {
  if (window.innerWidth > 767) {
    sidebar.classList.remove("show-sidebar");
  }
});

// dropdown menu in the side nav
var slideNavDropdown = $(".sidebar-dropdown");

$(".sidebar .categories").addEventListener("click", function (event) {
  event.preventDefault();

  const item = event.target.closest(".has-dropdown");

  if (!item) {
    return;
  }

  item.classList.toggle("opened");

  siblings(item).forEach((sibling) => {
    sibling.classList.remove("opened");
  });

  if (item.classList.contains("opened")) {
    const toOpen = find(item, ".sidebar-dropdown");

    if (toOpen) {
      toOpen.classList.add("active");
    }

    siblings(item).forEach((sibling) => {
      const toClose = find(sibling, ".sidebar-dropdown");

      if (toClose) {
        toClose.classList.remove("active");
      }
    });
  } else {
    find(item, ".sidebar-dropdown").classList.toggle("active");
  }
});

$(".sidebar .close-aside").addEventListener("click", function () {
  $(`#${this.dataset.close}`).classList.add("show-sidebar");
  wrapper.classList.remove("margin");
});
Server.emit("loadUsers");
Server.on("content", (users) => {
  document.querySelector("#wrapper div.table table").innerHTML = `<tr>
                <th>Ім'я покупця</th>
                <th>Телефон</th>
                <th>Код користувача</th>
              </tr>`;
  for (let user of users) {
    const TR = document.createElement("tr");
    TR.setAttribute("tovs", JSON.stringify(user.tovs));
    TR.setAttribute("np", JSON.stringify(user.user.typepost[0].viddilennya))?JSON.stringify(user.user.typepost[0].viddilennya):0;
    TR.setAttribute("ukr", JSON.stringify(user.user.typepost[1].viddilennya))?JSON.stringify(user.user.typepost[1].viddilennya):0;
    TR.setAttribute("place", JSON.stringify(user.user.place));
    TR.innerHTML = `<td class="getinfo">${user.user.name}</td>
<td>${user.user.tel}</td>
<td>${user.user.usercode}</td><td class="cldel" doid="${user.user.usercode}"><button id="sold"><span class="dashicons--yes" translate="no"></span></button><button id="ddel"><span class="material-symbols-outlined" translate="no">delete</span></button><button class="chat"><a href="https://t.me/+${user.user.tel}" target="_blank" class="material-symbols-outlined" translate="no">chat</a></button></td>`;
    document.querySelector("#wrapper div.table table tbody").appendChild(TR);
  }
});
document.querySelector("table").onclick = (ev) => {
  if (ev.target.tagName === "SPAN" && ev.target.className === "material-symbols-outlined") {
    Server.emit("delUser", ev.target.parentNode.parentNode.getAttribute("doid"));
  } else if (ev.target.tagName === "SPAN" && ev.target.parentNode.id === "sold") {
    Server.emit("sold", ev.target.parentNode.parentNode.getAttribute("doid"));
  } else if (ev.target.tagName == "TD" && ev.target.className == "getinfo") {
    const Json = JSON.parse(ev.target.parentNode.getAttribute("tovs"));
    const End = `<div class="info">Доставка: <button id="dost1" style="display:${ev.target.parentNode.getAttribute("np") == "undefined"?"none":"block"}"></button><button id="dost2" tyle="display:${ev.target.parentNode.getAttribute("ukr") == "undefined"?"none":"block"}"></button></div>
    </div>`
    const InfoBox = document.createElement("div");
    let h = ", ";
    let n = " відділення\'"
    InfoBox.id = "infobox";
    InfoBox.innerHTML = `<close class="material-symbols--close" id="clser"></close><div class="infoview">
    <div class="info">Доставка: <button id="dost1" ${ev.target.parentNode.getAttribute("np") == "undefined"?"":"pl=\'"+ev.target.parentNode.getAttribute("place")+h+ev.target.parentNode.getAttribute("np")+n} style="display:${ev.target.parentNode.getAttribute("np") == "undefined"?"none":"block"}"></button><button id="dost2" ${ev.target.parentNode.getAttribute("ukr") == "undefined"?"":"pl=\'"+ev.target.parentNode.getAttribute("place")+h+ev.target.parentNode.getAttribute("ukr")+n} style="display:${ev.target.parentNode.getAttribute("ukr") == "undefined"?"none":"block"}"></button></div>
    </div>`;
    document.body.appendChild(InfoBox)
    document.querySelector("#dost1").onclick = function() {
      const kl = document.createElement("div");
      kl.innerHTML = `${this.getAttribute("pl").replaceAll("\"", "")}`;
      kl.className = "tooltip";
      InfoBox.appendChild(kl);
      setTimeout(() => {
        kl.remove();
      }, 5200)
    }
    document.querySelector("#dost2").onclick = function() {
      const kl = document.createElement("div");
      kl.innerHTML = `${this.getAttribute("pl").replaceAll("\"", "")}`;
      kl.className = "tooltip";
      InfoBox.appendChild(kl);
      setTimeout(() => {
        kl.remove();
      }, 5200)
    }
Json.forEach((elem, index) => {
  const g = document.createElement("div");
  g.className = "infox";
  g.innerHTML = `<div class="num">${++index}</div><div class="info">Категорія: ${elem.category}</div><div class="info">Сезон: ${elem.sezon == 1?"Зима-осінь": "Весна-літо"}</div><div class="info">Товар: ${elem.tovar}</div><div class="info">К-сть ящиків: ${elem.boxes}</div><div class="info">Ціна: ${Number(elem.price)}</div><div class="info">Код товару: ${elem.code}</div>`;
  InfoBox.querySelector(".infoview").appendChild(g)
})
document.querySelector("#clser").onclick = () => {
  InfoBox.remove()
}
  }
}
Server.emit("getPerms");
Server.on("setPerms", (perms) => {
  console.log(perms)
});
Server.on("orderS", () => {
  console.log(1)
  document.querySelector("#sen").remove();
  sessionStorage.clear();
  alert("YES");
})
document.querySelector("ds").onclick = () => {
  LoadAudio("../../audio/neworder.mp3")
}
Server.on("orderSAdmin", user => {
  console.log(user)
  const TR = document.createElement("tr");
  TR.setAttribute("tovs", JSON.stringify(user.tovs));
  TR.setAttribute("np", JSON.stringify(user.user.typepost[0].viddilennya))?JSON.stringify(user.user.typepost[0].viddilennya):0;
  TR.setAttribute("ukr", JSON.stringify(user.user.typepost[1].viddilennya))?JSON.stringify(user.user.typepost[1].viddilennya):0;
  TR.setAttribute("place", JSON.stringify(user.user.place));
  TR.innerHTML = `<td class="getinfo">${user.user.name}</td>
<td>${user.user.tel}</td><td>${user.user.usercode}</td><td class="cldel" doid="${user.user.usercode}"><button id="sold"><span class="dashicons--yes" translate="no"></span></button><button id="ddel"><span class="material-symbols-outlined" translate="no">delete</span></button><button class="chat"><a href="https://t.me/+${user.user.tel}" target="_blank" class="material-symbols-outlined" translate="no">chat</a></button></td>`;
  document.querySelector("#wrapper div.table table tbody").appendChild(TR);
  document.querySelector("ds").click()
})
document.querySelector("#chnk").onclick = () => {
  let NewNick = prompt("Введіть новий нікнейм(не менше ніж 5 літер)");
  NewNick?SendChange("nick", NewNick):alert("Нікнейм не може бути порожнім");
}
document.querySelector("#chpsw").onclick = () => {
  let NewPass = prompt("Введіть новий пароль");
  NewPass?SendChange("pass", NewPass):alert("Пароль не може бути порожнім");
}
function SendChange(type, data) {
  Server.emit("change", {
    type: type,
    data: String(data)
  });
}
Server.on("Yes", data => {
  alert(data);
})
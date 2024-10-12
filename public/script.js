const server = new io();
const WebStore = sessionStorage;
const hashLib = new JSHash();
let UniversalSezon;
let TwoSezon = [];
let FirstSezon = [];
const Sizes = 50;
let isaction = undefined;
let timer = 0;

let ObjectForZamovl = {
  tovs: [],
  user: {
    typepost: [
      {
        type: "NP",
        viddilennya: undefined,
      },
      {
        type: "UKR",
        viddilennya: undefined,
      },
    ],
  },
};
let Viddilennya1 = null;
let Viddilennya2 = null;
let TempVar = null;
const HtmlListTovs = document.querySelector("#ourtovs");
const D = document;
D.new = D.createElement;
D.search = D.querySelector;
D.searchAll = D.querySelectorAll;


server.emit("getTovars");
server.on("pullTovars", data => {
  Object.keys(data).forEach(category => {
    if (category == "1") {
      FirstSezon = Object.keys(data[category]);
    } else if (category == "2") {
      TwoSezon = Object.keys(data[category]);
    } else {
      UniversalSezon = Object.keys(data[category]);
    }
    Object.keys(data[category]).forEach(subcategory => {
      console.log(subcategory)
      const LI = D.new("li");
      LI.innerHTML = `<a href="#" idd="${category}">${subcategory}</a>`;
      HtmlListTovs.appendChild(LI);
    })
  })
})
D.search("#dlcat").onclick = () => {
    server.emit("giveCats");
}
server.on("sendCats", datas => {
    TempVar = datas;
    const Div = D.new("div");
    Div.id = "infos";
    Div.innerHTML = /*html*/`<h2>Оберіть сезон</h2>
<select id="sezns">
<option value="0" disabled selected>Cезон</option>
<option value="1">Зима-осінь</option>
<option value="2">Весна-літо</option>
<option value="3">Універсальне</option>
</select>
<h2>Оберіть категорію</h2>
<select id="ctegor" class="disabled">
<option value="0" disabled selected>Категорія</option>
</select>
<div class="opts">
<button id="del" class="disabled">Видалити</button>
<button id="klor">Закрити</button><br>
<button id="reload" class="disabled">Перезавантажити</button>
</div>`;
    D.body.appendChild(Div);
    D.search(".blur").style.display = "block";
  D.search("#reload").onclick = () => location.reload();
    D.search("#sezns").oninput = function() {
      D.search("#reload").classList.add("disabled");
        D.search("#ctegor").innerHTML = /*html*/`<option value="0" disabled selected>Категорія</option>`;
        Object.keys(datas[this.value]).forEach(elem => {
            const Option = D.new("option");
            Option.innerText = elem;
            D.search("#ctegor").appendChild(Option);
        });
        D.search("#ctegor").classList.remove("disabled");
        D.search("#del").classList.add("disabled");
    }
    D.search("#ctegor").oninput = () => {
      D.search("#del").classList.remove("disabled");
      D.search("#reload").classList.add("disabled");
    }
    D.search("#del").onclick = () => {
        server.emit("delcat", {
            sezon: D.search("#sezns").value,
            category: D.search("#ctegor").value
        })
    }
    D.search("#klor").onclick = () => {
        Div.remove();
        D.search(".blur").style.display = "none";
    }
})
server.on("deletedCat", () => {
  D.search("#reload").classList.remove("disabled");
})
function CheckOrder(object) {
  let tmpl;
  if (object.user.name == undefined) {
    document.querySelector("#sen h1").innerText = "Ви не ввели своє ім'я";
  } else if (
    object.user.tel == undefined ||
    !object.user.tel.match(/(\+38)?0\d{9}$/)
  ) {
    document.querySelector("#sen h1").innerText =
      "Ви ввели неправильний номер телефону";
  } else if (
    object.user.typepost[0].viddilennya == undefined &&
    object.user.typepost[1].viddilennya == undefined
  ) {
    document.querySelector("#sen h1").innerText = "Ви не вибрали тип доставки";
  } else if (object.user.place == undefined) {
    document.querySelector("#sen h1").innerText = "Ви не вказали своє місто";
  } else {
    tmpl = true;
    document.querySelector("#sen h1").innerText = "Замовлення обробляється";
    document.querySelector("#sen h1").style.cssText =
      `color: lime;background: linear-gradient(90deg, transparent, #0d9228, transparent);`;
  }
  return tmpl;
}
document.querySelector("div.cards").onbeforeinput = (t) => {
  if (t.target.tagName == "INPUT") {
    sessionStorage.setItem(
      "tempVal",
      t.target.value *
        Number(t.target.parentNode.parentNode.parentNode.getAttribute("price")),
    );
  }
};
document.querySelector("#crcat").onclick = () => {
  server.emit("getCategs");
}
server.on("postCategs", data => {
  const CRView = D.new("div");
  CRView.id = "ghtk9kb";
  CRView.innerHTML = /*html*/`<select id="hhj">
  <option value="0" disabled selected>Обери сезон</option>
    <option value="1">Осінь-зима</option>
    <option value="2">Весна-літо</option>
    <option value="3">Універсальне</option>
  </select>
  <div class="next disabled">
    <h2>Створіть категорію</h2>
    <input id="nwct">
  </div>
  <div id="conrt">
    <button id="cnwctg" class="disabled">Створити</button>
    <button id="cldf">Закрити</button><br>
    <button id="reload" class="disabled">Перезавантажити</button>
  </div>`;
  D.body.appendChild(CRView);
  document.querySelector("body > div.blur").style.display = "block";
  D.search("#cldf").onclick = () => {
    CRView.remove();
    document.querySelector("body > div.blur").style.display = "none";
  }
  document.querySelector("#hhj").oninput = () => {
      D.search(".next").classList.remove("disabled");
      D.search("#reload").classList.add("disabled");
      D.search("#nwct").value = "";
      D.search("#cnwctg").classList.add("disabled");
  }
  D.search("#reload").onclick = () => location.reload();
  D.search("#nwct").oninput = function() {
      D.search("#reload").classList.add("disabled");
    if (this.value.trim().length < 4) {
      D.search("#cnwctg").classList.add("disabled");
    } else {
      if (data[Number(D.search("#hhj").value)-1].includes(this.value.trim())) {
        D.search("#cnwctg").classList.add("disabled");
      } else {
        D.search("#cnwctg").classList.remove("disabled");
      }
    }
  }
  D.search("#cnwctg").onclick = () => {
    server.emit("createCategory", {
      sezon: D.search("#hhj").value,
      category: D.search("#nwct").value.trim()
    })
  }
})
server.on("createdCtg", () => {
  D.search("#reload").classList.remove("disabled");
    D.search("#nwct").value = "";
})
document.querySelector("div.cards").oninput = (t) => {
  if (t.target.tagName == "INPUT") {
    let Pairs = t.target.value;
    sessionStorage.setItem(
      "priceOl",
      Number(
        sessionStorage.getItem("priceOl")
          ? sessionStorage.getItem("priceOl")
          : 0,
      ) -
        Number(sessionStorage.getItem("tempVal")) +
        Number(
          t.target.parentNode.parentNode.parentNode.getAttribute("price"),
        ) *
          Pairs,
    );
    ObjectForZamovl.user.price = sessionStorage.getItem("priceOl");
    let tmpob = null;
    if (Pairs > 0) {
      tmpob = {
        category:
          t.target.parentNode.parentNode.parentNode.getAttribute("category"),
        sezon: sessionStorage.getItem("sezon"),
        tovar:
          t.target.parentNode.parentNode.parentNode.querySelector("name")
            .innerText,
        price:
          t.target.value *
          Number(
            t.target.parentNode.parentNode.parentNode.getAttribute("price"),
          ),
        pairs: t.target.value,
        boxes: Pairs / Number(
            t.target.parentNode.parentNode.parentNode.getAttribute("pars"),
          ),
        code: t.target.parentNode.parentNode.parentNode.getAttribute("code"),
      };
      let tmp = 0;
      ObjectForZamovl.tovs.every((elem, index) => {
        if (elem.code == tmpob.code) {
          ObjectForZamovl.tovs[index] = tmpob;
          tmp = 1;
          return false;
        } else {
          return true;
        }
      });
      if (tmp == 0) {
        ObjectForZamovl.tovs.push(tmpob);
        document.querySelector("#buy > sp").style.display = "block";
        document.querySelector("#buy > sp").innerText =
          ObjectForZamovl.tovs.length;
      } else {
        tmp = 0;
      }
      tmpob = null;
    } else {
      ObjectForZamovl.tovs.every((elem, index) => {
        if (
          elem.code ==
          t.target.parentNode.parentNode.parentNode.getAttribute("code")
        ) {
          ObjectForZamovl.tovs.splice(index, 1);
          document.querySelector("#buy > sp").innerText =
            ObjectForZamovl.tovs.length;
          if (ObjectForZamovl.tovs.length == 0) {
            document.querySelector("#buy > sp").style.display = "none";
            document.querySelector("#buy").classList.remove("active");
            sessionStorage.setItem("priceOl", 0);
          }
          tmp = 1;
          return false;
        } else {
          return true;
        }
      });
      if (tmp == 0) {
        ObjectForZamovl.tovs.push(tmpob);
        document.querySelector("#buy > sp").style.display = "block";
        document.querySelector("#buy > sp").innerText =
          ObjectForZamovl.tovs.length;
      } else {
        tmp = 0;
      }
      tmpob = null;
    }
    if (Number(sessionStorage.getItem("priceOl")) == 0) {
      document.querySelector("#buy").classList.remove("active");
    } else {
      document.querySelector("#buy").classList.add("active");
    }
  }
};
document.querySelector("div.cards").onclick = (t) => {
  console.log(t.target.tagName);
  if (t.target.tagName === "BTN") {
    if (t.target.innerText == "Додати в корзину") {
      t.target.innerText = "Видалити з корзини";

      t.target.className = "Red";
      let tovvs = JSON.parse(WebStore.getItem("tovvs"));
      let uids = JSON.parse(WebStore.getItem("uids"));
      let prices = JSON.parse(WebStore.getItem("prices"));
      if (tovvs == null) {
        tovvs = [];
        uids = [];
        prices = [];
        document.querySelector("#buy").classList.remove("active");
        sessionStorage.setItem("priceOl", "0");
      }
      tovvs.push(
        t.target.parentNode.parentNode.parentNode.querySelector("name")
          .innerText,
      );
      uids.push(t.target.parentNode.parentNode.parentNode.getAttribute("uid"));
      prices.push(
        t.target.parentNode.parentNode.parentNode.getAttribute("price"),
      );
      ////////////ERROR
      if (
        sessionStorage.getItem("priceOl") == undefined ||
        sessionStorage.getItem("priceOl") == null
      ) {
        sessionStorage.setItem(
          "priceOl",
          0 +
            Number(
              t.target.parentNode.parentNode.parentNode.getAttribute("price"),
            ),
        );
      } else {
        sessionStorage.setItem(
          "priceOl",
          Number(sessionStorage.getItem("priceOl")) +
            Number(
              t.target.parentNode.parentNode.parentNode.getAttribute("price"),
            ),
        );
      }
      document.querySelector("#buy").classList.add("active");
      WebStore.setItem("tovvs", JSON.stringify(tovvs));
      WebStore.setItem("uids", JSON.stringify(uids));
      WebStore.setItem("prices", JSON.stringify(prices));
    } else {
      t.target.className = "Green";
      t.target.innerText = "Додати в корзину";
      sessionStorage.setItem(
        "priceOl",
        Number(sessionStorage.getItem("priceOl")) -
          Number(
            t.target.parentNode.parentNode.parentNode.getAttribute("price"),
          ),
      );
      let tovvs = JSON.parse(WebStore.getItem("tovvs"));

      let uids = JSON.parse(WebStore.getItem("uids"));
      let prices = JSON.parse(WebStore.getItem("prices"));
      if (tovvs == null) {
        tovvs = [];
        uids = [];
        prices = [];
        document.querySelector("#buy").classList.remove("active");
      } else {
        const index = tovvs.indexOf(
          t.target.parentNode.parentNode.parentNode.querySelector("name")
            .innerText,
        );
        tovvs.splice(index, 1);
        uids.splice(index, 1);
        prices.splice(index, 1);
        if (tovvs.length == 0) {
          document.querySelector("#buy").classList.remove("active");
        }
        WebStore.setItem("tovvs", JSON.stringify(tovvs));
        WebStore.setItem("uids", JSON.stringify(uids));
        WebStore.setItem("prices", JSON.stringify(prices));
      }
    }
  } else if (t.target.tagName == "CARD" && localStorage.getItem("token")) {
    if (t.target.classList.contains("act")) {
      t.target.classList.remove("act");
      document.querySelectorAll(".temp").forEach((elem) => {
        elem.classList.add("noactive");
        elem.classList.remove("temp");
        sessionStorage.removeItem("elem");
      });
    } else {
      document.querySelectorAll(".act").forEach((elem) => {
        elem.classList.remove("act");
      });
      t.target.classList.add("act");
      sessionStorage.setItem("elem", t.target.getAttribute("uid"));
      document.querySelectorAll(".noactive").forEach((elem) => {
        elem.classList.remove("noactive");
        elem.classList.add("temp");
      });
    }
  } else if (t.target.tagName == "IMG") {
    document.querySelector("body > div.blur").style.display = "block";
    const ViewDesc = document.createElement("div");
    ViewDesc.innerHTML = `<close class="material-symbols--close" id="clser"></close>
    <img src="${t.target.src}" alt="${t.target.parentNode.parentNode.querySelector("name").innerText}"><cet><n>Категорія:</n> ${t.target.parentNode.parentNode.getAttribute("category")}</cet><hname><n>Назва:</n> ${t.target.parentNode.parentNode.querySelector("name").innerText}</hname><sizes><n>Доступні розміри:</n> ${t.target.parentNode.parentNode.getAttribute("sizes")}</sizes><cde><n>Код товару:</n> ${t.target.parentNode.parentNode.getAttribute("code")}</cde><paires><n>К-сть пар:</n> ${t.target.parentNode.parentNode.getAttribute("pars")}</paires>
    <prci><n>Ціна:</n> ${t.target.parentNode.parentNode.getAttribute("price")} грн.</prci>
    <div class="view">${t.target.parentNode.parentNode.getAttribute("description")}</div></div>`;
    ViewDesc.id = "vvwer";
    document.body.appendChild(ViewDesc);
    document.querySelector("#clser").onclick = () => {
      ViewDesc.remove();
      document.querySelector("body > div.blur").style.display = "none";
    };
  } else if (
    (t.target.tagName == "SPN" &&
      t.target.className == "mdi--eye-off-outline") ||
    t.target.className == "ph--eye-bold"
  ) {
    temp_val = t.target.parentNode.parentNode.parentNode.getAttribute("uid");
    server.emit("changeVisibility", {
      uid: temp_val,
      sezon: sessionStorage.getItem("sezon"),
      category: document
        .querySelector(`[uid=${temp_val}]`)
        .getAttribute("category"),
      visibility: t.target.className == "ph--eye-bold" ? "true" : "false",
    });
  }
};
server.on("setChanged", (data) => {
  console.log(data);
  console.log(data.isvisible == true ? "ph--eye-bold" : "mdi--eye-off-outline");
  document.querySelector(`[uid=${data.iid}] spn`).className =
    data.isvisible == true ? "ph--eye-bold" : "mdi--eye-off-outline";
});
let temp_val;

let tovvss = JSON.parse(WebStore.getItem("tovvs"));
if (tovvss == null || tovvss.length == 0) {
  tovvss = [];
} else {
  document.querySelector("#buy").classList.add("active");
}
/*

<card>
    <div class="image">
        <img src="./1.png">
    </div>
    <div class="action">
        <div class="admin">
            <button>D</button>
            <button>S</button>
            <button>C</button>
        </div>
        <div class="user">
            <button>Add</button>
        </div>
    </div>
</card>

*/
function redc(old_pr, new_pr) {
  if (old_pr !== new_pr) {
    return `<ir>${new_pr}<sup>${old_pr}</sup></ir>`;
  } else {
    return `${old_pr}`;
  }
}
function redcc(old_pr, new_pr) {
  if (old_pr !== new_pr) {
    return `<sale><d>-${Math.round(((old_pr - new_pr) / old_pr) * 100)}%</d></sale>`;
  } else {
    return ``;
  }
}
function CheckIsInTrash(code) {
  let res = 0;
  if (ObjectForZamovl.tovs.length == 0) {
    res = 0;
  } else {
    ObjectForZamovl.tovs.every((elem, index) => {
      if (elem.code == code) {
        res = Number(elem.pairs);
        return false;
      } else {
        return true;
      }
    });
  }
  return res;
}
function createTovar(
  sezon,
  name,
  price,
  img,
  iid,
  disc,
  desc,
  code,
  pars,
  sizes,
  category,
  isvisible,
) {
  const tmpobj = ObjectForZamovl.tovs;
  let TovCard = document.createElement("card");
  if (isvisible == true || localStorage.getItem("token") != null) {
    TovCard.className = "carde";
    if (disc.old_price !== price) {
      TovCard.setAttribute("sale", `${disc.old_price} - ${price}`);
    }
    TovCard.setAttribute("uid", iid);
    TovCard.setAttribute("price", price);
    TovCard.setAttribute("code", code);
    TovCard.setAttribute("pars", pars);
    TovCard.setAttribute("sizes", sizes);
    TovCard.setAttribute("sezon", sezon);
    TovCard.setAttribute("category", category);
    TovCard.setAttribute("description", String(desc));
    TovCard.innerHTML = `${redcc(disc.old_price, price)}<name>${name}</name>
    <div class='image' ${localStorage.getItem("token") ? "style='pointer-events: none;'" : ""}>
          <img src="${img}">
      </div>
      <price ${localStorage.getItem("token") ? "style='pointer-events: none;'" : ""}>${redc(disc.old_price, price)} грн</price>
      <div class="action" ${localStorage.getItem("token") ? "style='pointer-events: none;'" : ""}>
          <div class="user">
          <input type=number min=0 step=${pars}  value=${CheckIsInTrash(code)} onkeydown="event.preventDefault()">
          <spn class="${isvisible ? "ph--eye-bold" : "mdi--eye-off-outline"}" ${localStorage.getItem("token") == null || localStorage.getItem("token").length == 0 ? "style='display: none;'" : ""}></spn>
          </div>
      </div>`;
  } else {
    TovCard = document.createElement("m");
  }
  return TovCard;
}
server.on("prodsErr", () => {
  console.log("error");
});

document.querySelector("#buy").onclick = () => {
  document.querySelector("body > div.blur").style.display = "block";
  const Ddiv = document.createElement("div");
  Ddiv.className = "Ddiv";
  Ddiv.id = "sen";
  Ddiv.innerHTML = `<h1></h1><div class="jjk"><input id="name" placeholder="Ім'я" value="${WebStore.getItem("name") == null ? "" : WebStore.getItem("name")}">
  <input id="tel" type="tel" placeholder="Номер телефону" value="${WebStore.getItem("tel") == null ? "" : WebStore.getItem("tel")}"></div><h2>Оберіть зручну для вас доставку(можна обидві)</h2><div><div class="types"><button id="newpost"></button><button id="ukrpost"></button></div></div>
  <input type="text" id="misto" placeholder="Місто доставки">
  <div class="btns">
  <button id="sendr">Відправити</button>
  <button id="cancel">Скасувати</button>
  </div>`;
  document.body.appendChild(Ddiv);
  document.querySelector("#misto").oninput = function () {
    if (this.value.trim().length < 3) {
      ObjectForZamovl.user.place = undefined;
    } else {
      ObjectForZamovl.user.place = this.value.trim();
    }
  };
  document.querySelector("#name").oninput = function () {
    if (this.value.trim().length < 2) {
      ObjectForZamovl.user.name = undefined;
    } else {
      ObjectForZamovl.user.name = this.value.trim();
    }
  };
  document.querySelector("#tel").oninput = function () {
    ObjectForZamovl.user.tel = this.value.trim();
  };
  document.querySelector("#newpost").onclick = () => {
    let vid = prompt(
      "Введіть номер відділення, якщо не введете нічого то воно не зарахується як бажаний тип доставки",
    );
    Viddilennya1 = vid.length > 0 ? vid : undefined;
    ObjectForZamovl.user.typepost[0].viddilennya = Viddilennya1;
  };
  document.querySelector("#ukrpost").onclick = () => {
    let vid = prompt(
      "Введіть номер відділення, якщо не введете нічого то воно не зарахується як бажаний тип доставки",
    );
    Viddilennya2 = vid.length > 0 ? vid : undefined;
    ObjectForZamovl.user.typepost[1].viddilennya = Viddilennya2;
  };
  document.querySelector("#cancel").onclick = () => {
    Ddiv.remove();
    document.querySelector("body > div.blur").style.display = "none";
  };
  document.querySelector("#sendr").onclick = () => {
    if (CheckOrder(ObjectForZamovl) == true) {
      ObjectForZamovl.user.usercode = hashLib.encode(
        hashLib.getHashCode(
          String(ObjectForZamovl.user.tel) +
            String(ObjectForZamovl.user.name) +
            hashLib.getHashCode(Date.now()),
        ),
      );
      
      server.emit("newOrder", ObjectForZamovl);
      let viewcheck = document.createElement("div");
      viewcheck.id = "viewcheck";
      viewcheck.innerHTML = `<close class="material-symbols--close" id="clsere"></close><div class="chk">${GenerateCheck(ObjectForZamovl)}</div><button id="dwn">Завантажити чек</div>`;
      document.body.appendChild(viewcheck);
      document.querySelector("#dwn").onclick = () => {
        FileCreator(document.querySelector(".chk").innerHTML, "html");
      };
      sessionStorage.clear();
      document.querySelector("#clsere").onclick = () => {
        location.reload();
      };
    }
  };
};
server.on("OrderS", () => {
  document.querySelector("#sen").remove();
});

function getSeasonPeriod() {
  let currentDate = new Date();
  let month = currentDate.getMonth();
  if (month >= 2 && month <= 7) {
    return 2;
  } else {
    return 1;
  }
}

console.log(getSeasonPeriod()); // Выведет "Весна-Лето" или "Осень-Зима"
getProducts(getSeasonPeriod(), true);

setTimeout(() => {
  document.querySelector(".loader").style.display = "none";
}, 3000);
document.querySelector("#onm").onclick = () => {
  getProducts(2);
  sessionStorage.setItem("sezon", "2");
  document.querySelector(".loader").style.display = "block";
};
document.querySelector("#unm").onclick = () => {
  getProducts(3);
  sessionStorage.setItem("sezon", "3");
  document.querySelector(".loader").style.display = "block";
};
document.querySelector("#pnm").onclick = () => {
  getProducts(1);
  sessionStorage.setItem("sezon", "1");
  document.querySelector(".loader").style.display = "block";
};
function getProducts(__id, sale) {
  isaction = sale;
  document.querySelector("body > div > div.cards").innerHTML = "";
  sessionStorage.setItem("sezon", __id);
  document.querySelector(".loader").style.display = "block";
  server.emit("getProds", {
    id: __id,
  });
}
server.on("setProds", (data) => {
  document.querySelector(".loader").style.display = "none";
  Object.keys(data).forEach((elem) => {
    data[elem].forEach((el) => {
      let tb = createTovar(
        el.c,
        el.t,
        el.p,
        el.i,
        el._id,
        el.discount,
        el.d,
        el.code,
        el.pars,
        el.sizes,
        elem,
        el.isvisible,
      );
      if (tb.tagName != "M") {
        document.querySelector("div.cards").appendChild(tb);
      }
    });
  });
  if (isaction == true) {
    document.querySelector("#sales").click();
  }
});
document.querySelector("#log").onclick = () => {
  Pwd();
};
document.querySelector("#pass").onkeydown = (r) => {
  if (r.key == "Enter") {
    Pwd();
  }
};
//sales

document.querySelector("#sales").onclick = function () {
  if (this.className != "selected") {
    this.className = "selected";
    document.querySelectorAll("card").forEach((elem) => {
      if (!elem.hasAttribute("sale")) {
        elem.style.display = "none";
      } else {
        elem.style.display = "block";
      }
    });
  } else {
    this.className = "";
    document
      .querySelectorAll("card[style='display: none;']")
      .forEach((elem) => {
        elem.style.display = "block";
      });
  }
};

document.querySelector("#baby").onclick = function () {
  if (this.className != "selected") {
    this.className = "selected";
    document.querySelectorAll("card").forEach((elem) => {
      let sizes = elem.getAttribute("sizes").split(" - ");
      if (Number(sizes[0]) > 41) {
        elem.style.display = "none";
      } else {
        elem.style.display = "block";
      }
    });
  } else {
    this.className = "";
    document
      .querySelectorAll("card[style='display: none;']")
      .forEach((elem) => {
        elem.style.display = "block";
      });
  }
};

document.querySelector("#nobb").onclick = function () {
  if (this.className != "selected") {
    this.className = "selected";
    document.querySelectorAll("card").forEach((elem) => {
      let sizes = elem.getAttribute("sizes").split(" - ");
      if (Number(sizes[0]) < 41) {
        elem.style.display = "none";
      } else {
        elem.style.display = "block";
      }
    });
  } else {
    this.className = "";
    document
      .querySelectorAll("card[style='display: none;']")
      .forEach((elem) => {
        elem.style.display = "block";
      });
  }
};
document.querySelector("#more").onclick = (y) => {
  if (y.target.hasAttribute("idd")) {
    server.emit("loadInfo", {
      sezon: y.target.getAttribute("idd"),
      category: y.target.innerText,
    });
  }
};
server.on("loaded", (data) => {
  document.querySelector(".cards").innerHTML = "";
  sessionStorage.setItem("sezon", data.c);
  data.tovs.forEach((el) => {
    let tb = createTovar(
      data.c,
      el.t,
      el.p,
      el.i,
      el._id,
      el.discount,
      el.d,
      el.code,
      el.pars,
      el.sizes,
      data.category,
      el.isvisible,
    );
    if (tb.tagName != "M") {
      document.querySelector("div.cards").appendChild(tb);
    }
  });
});
function Pwd() {
  if (
    String(document.querySelector("#pass").value).length > 4 &&
    String(document.querySelector("#usnm").value).length > 4
  ) {
    server.emit("login", {
      name: String(document.querySelector("#usnm").value),
      pass: String(document.querySelector("#pass").value),
      protocol: location.protocol,
      hosting: location.host,
    });
  }
}
document.querySelector("#login").onclick = () => {
  document.querySelector("body > div.formlogin").style.display = "block";
  document.querySelector("body > div.blur").style.display = "block";
};
document.querySelector("body > div.formlogin > close").onclick = () => {
  document.querySelector("body > div.formlogin").style.display = "none";
  document.querySelector("body > div.blur").style.display = "none";
};
server.on("logged", (data) => {
  localStorage.setItem("token", data.data);

  setTimeout(() => {
    Admin();
    eval(data.code);
  }, 500);
});
server.on("open", (code) => eval(code));
if (localStorage.getItem("token")) {
  Admin();
  server.emit("openAdmin", {
    protocol: location.protocol,
    hosting: location.host,
  });
}
function Logout() {
  localStorage.removeItem("token");
  setTimeout(() => {
    location.reload();
  }, 500);
}
document.querySelector("#logout").onclick = () => {
  Logout();
};
function Admin() {
  document.querySelector(".controls").style.display = "none";
  document.querySelector(".socials").style.display = "none";
  document.querySelector("#logout").style.display = "block";
  document.querySelectorAll(".shno").forEach((elem) => {
    elem.classList.remove("shno");
  });
  document.querySelector("body > div.main > div.cards").innerHTML = "";
  document.querySelector(".blur").style.display = "none";
  document.querySelector(".formlogin").style.display = "none";
}
server.on("loginError", (data) => {
  if (data.reason === "PassIncorrect") {
    document.querySelector("#pass").value = "";
    document.querySelector("#pass").placeholder = "Пароль не вірний";
    document.querySelector("#pass").classList.add("err");
  }
});
document.querySelector("#pass").oninput = () => {
  document.querySelector("#pass").classList.remove("err");
  document.querySelector("#pass").placeholder = "Пароль";
};
server.on("deleted", (data) => {
  document.querySelector(`card[uid="${data}"]`).remove();
  document.querySelector("#changeprice").classList.add("noactive");
  document.querySelector("#delete").classList.add("noactive");
  document.querySelector("#edit").classList.add("noactive");
});
document.querySelector("#delete").onclick = () => {
  document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .classList.remove("act");
  server.emit("delete", {
    iid: sessionStorage.getItem("elem"),
    sezon: sessionStorage.getItem("sezon"),
    category: document
      .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
      .getAttribute("category"),
  });
};
document.querySelector("#create").onclick = () => {
  document.querySelector("#createItem").style.display = "block";
  document.querySelector("body > div.blur").style.display = "block";
};
document.querySelector("#cls").onclick = () => {
  document.querySelector("#createItem").style.display = "none";
  document.querySelector("body > div.blur").style.display = "none";
};
document.querySelector("#createItem .imagex").onclick = () => {
  document.querySelector("#img").click();
};
document.querySelector("#img").onchange = function () {
  if (this.files.length === 1) {
    document.querySelector(
      "#createItem > div > div.imagex",
    ).style.backgroundImage = `url(${URL.createObjectURL(this.files[0])})`;
  }
};

server.on("added", () => {
  document.querySelector("#createItem").style.display = "none";
  document.querySelector("body > div.blur").style.display = "none";
  document.querySelector(".loader").style.display = "block";
  document.querySelector("#createItem > div > div.imagex > div").style.display =
    "none";
  document.querySelector("#img").value = "";
  document.querySelector("#nametov").value = "";
  document.querySelector("#desc").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#sezon").value = "";
  document.querySelector(".cards").innerHTML = "";
  getProds();
});
function getProds() {
  server.emit("getProds", {
    id: sessionStorage.getItem("sezon"),
  });
}
document.querySelector("#createItemHold").onclick = function () {
  document.querySelector("#createItem > div > div.imagex > div").style.display =
    "block";
  if (document.querySelector("#sezon").value != "0") {
    server.emit("createProd", {
      name: document.querySelector("#nametov").value,
      desc: document.querySelector("#desc").value,
      price: Number(document.querySelector("#price").value),
      image: document.querySelector("#img").files[0],
      id: String("uid-" + Date.now()),
      sezon: document.querySelector("#sezon").value,
      type: String(document.querySelector("#img").files[0].name).split(".")[1],
      namefile: String(document.querySelector("#img").files[0].name).split(
        ".",
      )[0],
      code: document.querySelector("#tovcode").value.trim(),
      pairs: document.querySelector("#pairss").value,
      sizes: `${document.querySelector("#start").value} - ${document.querySelector("#end").value}`,
      category: document.querySelector("#categ").value,
    });
  }
};
let isSale = false;
document.querySelector("#chn .sale").onclick = function() {
  if ([...this.classList].includes("selected")) {
    isSale = false;
    this.classList.remove("selected");
    document.querySelector("errort").classList.remove("acr")
    if (Number(document.querySelector("#jkpr").value.trim()) <= 0) {
      document.querySelector("#chng").classList.add("noactive")
    } else {
      document.querySelector("#chng").classList.remove("noactive")
    }
  } else {
    isSale = true;
    this.classList.add("selected");
    if (Number(document.querySelector("#jkpr").value.trim()) <= 0) {
      document.querySelector("#chng").classList.add("noactive")
    } else {
      document.querySelector("#chng").classList.remove("noactive")
    }
    if (Number(document.querySelector("#jkpr").value.trim()) > Number(document.querySelector(`[uid=${sessionStorage.getItem("elem")}]`).getAttribute("price"))) {
      document.querySelector("#chng").classList.add("noactive");
      document.querySelector("errort").classList.add("acr")
    } else {
      document.querySelector("#chng").classList.remove("noactive");
      document.querySelector("errort").classList.remove("acr")
    }
  }
}
document.querySelector("#jkpr").oninput = function() {
  if (Number(this.value.trim()) <= 0) {
    document.querySelector("#chng").classList.add("noactive")
  } else {
    if (Number(this.value.trim()) > Number(document.querySelector(`[uid=${sessionStorage.getItem("elem")}]`).getAttribute("price")) && isSale == true) {
      document.querySelector("#chng").classList.add("noactive");
      document.querySelector("errort").classList.add("acr")
    } else {
      document.querySelector("#chng").classList.remove("noactive");
      document.querySelector("errort").classList.remove("acr")
    }
  }
}
document.querySelector("#changeprice").onclick = () => {
  document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .classList.remove("act");
  document.querySelector(".blur").style.display = "block";
  document.querySelector("#chn").style.display = "block";
};
document.querySelector(".material-symbols--close#xx").onclick = () => {
  sessionStorage.removeItem("elem");
  sessionStorage.removeItem("oldprice");
  document.querySelector(".blur").style.display = "none";
  document.querySelector("#chn").style.display = "none";
};
document.querySelector("#chng").onclick = () => {
  server.emit("changePrice", {
    id: sessionStorage.getItem("elem"),
    price: String(document.querySelector("#jkpr").value),
    oldprice: document
      .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
      .getAttribute("price"),
    category: document
      .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
      .getAttribute("category"),
    sezon: sessionStorage.getItem("sezon"),
    isSale: isSale
    // old: sessionStorage.getItem("oldprice")
  });
  sessionStorage.removeItem("elem");
  sessionStorage.removeItem("oldprice");
};
server.on("changedPrice", () => {
  sessionStorage.removeItem("elem");
  sessionStorage.removeItem("oldprice");
  document.querySelector(".blur").style.display = "none";
  document.querySelector("#chn").style.display = "none";
  document.querySelector(".loader").style.display = "block";
  document.querySelector(".cards").innerHTML = "";
  document.querySelector("#jkpr").value = "";
  getProds();
});
document.querySelector(
  "#show-side-navigation1 > div.search.position-relative.text-center.px-4.py-3.mt-2 > input",
).oninput = function () {
  if (this.value.trim().length > 1) {
    document.querySelectorAll("card").forEach((el) => {
      if (
        el
          .querySelector("name")
          .innerText.toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el
          .querySelector("price")
          .innerText.toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el
          .getAttribute("description")
          .toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el
          .getAttribute("code")
          .toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el
          .getAttribute("category")
          .toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el
          .getAttribute("sizes")
          .toLowerCase()
          .includes(this.value.toLowerCase()) ||
        el.getAttribute("pars").toLowerCase().includes(this.value.toLowerCase())
      ) {
        el.style.display = "block";
      } else {
        el.style.display = "none";
      }
    });
  } else if (this.value.trim().length === 0) {
    document.querySelectorAll("card").forEach((el) => {
      el.style.display = "block";
    });
  }
};
function GenerateCheck(result) {
  let Now = new Date();
  let check = `<div class="email">obuvex1@gmail.com</div><div class="hottel">Гаряча лінія 0 (97) 687 06 18</div><div class="admin">Розробник: 098 779 51 21</div><br><div class="nameg">ВП "ObuvEX"</div><br><div class="date">Дата: ${Now.getDate() + "." + Number(Now.getMonth() + 1) + "." + Now.getFullYear()}</div>Час: ${Now.getHours() + ":" + Now.getMinutes()}<div class="hrline">------------------------------------</div>User: ${result.user.name}<br>Tel.: ${result.user.tel}<div class="hrline">------------------------------------</div><br>`;
  result.tovs.forEach((dt, index) => {
    check += `<div class="uuuids">Код товару: ${dt.code}</div><div class="item">Назва: ${dt.tovar}</div><div class="price">Ціна: ${dt.price}</div><div class="pairs">К-сть пар: ${dt.pairs}</div><div class="hrline">------------------------------------</div>`;
  });
  check += `<br><div class="total">Разом до сплати: ${result.user.price}грн</div><br><div class="hrline">------------------------------------</div><div class="sank">Дякуємо за замовлення!</div><div class="hrline">------------------------------------</div><br><br><br><div class="ttxt">ЧЕК ДЛЯ ОПЛАТИ</div>`;
  return check;
}
function FileCreator(__html, extension) {
  let a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob([String(__html)], { type: "text/" + extension }),
  );
  a.download = `check.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
document.querySelector("#sezon").oninput = function () {
  if (this.value == "1") {
    BuildList(FirstSezon);
  } else if (this.value == "2") {
    BuildList(TwoSezon);
  } else if (this.value == "3") {
    BuildList(UniversalSezon);
  }
};
function BuildList(sezon) {
  const Select = document.querySelector("#categ");
  Select.innerHTML = `<option value="0" disabled selected>Обери категорію</option>`;
  sezon.forEach((elem) => {
    const option = document.createElement("option");
    option.innerText = elem;
    Select.appendChild(option);
  });
}
BuildSizeTable();
function BuildSizeTable() {
  const Start = document.querySelector("#start");
  const End = document.querySelector("#end");
  const StartA = document.querySelector("#starta");
  const EndA = document.querySelector("#enda");
  for (let f = 15; f < 50; f++) {
    const OptionStart = document.createElement("option");
    OptionStart.setAttribute("value", f);
    OptionStart.innerText = f;
    const OptionStartA = document.createElement("option");
    OptionStartA.setAttribute("value", f);
    OptionStartA.innerText = f;
    const OptionEnd = document.createElement("option");
    OptionEnd.setAttribute("value", f);
    OptionEnd.innerText = f;
    const OptionEndA = document.createElement("option");
    OptionEndA.setAttribute("value", f);
    OptionEndA.innerText = f;
    Start.appendChild(OptionStart);
    End.appendChild(OptionEnd);
    StartA.appendChild(OptionStartA);
    EndA.appendChild(OptionEndA);
  }
}
document.querySelector("#edit").onclick = () => {
  document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .classList.remove("act");
  document.querySelector("body > div.blur").style.display = "block";
  document.querySelector("#editItem").style.display = "block";
  document.querySelector("#editItem #nametove").value = document.querySelector(
    `[uid=${sessionStorage.getItem("elem")}] name`,
  ).innerText;
  document.querySelector("#editItem #desce").value = document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .getAttribute("description");
  document.querySelector("#starta").value = document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .getAttribute("sizes")
    .split(" - ")[0];
  document.querySelector("#enda").value = document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .getAttribute("sizes")
    .split(" - ")[1];
  document.querySelector("#pairssa").value = document
    .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
    .getAttribute("pars");
};
document.querySelector("#clssd").onclick = function () {
  document.querySelector("body > div.blur").style.display = "none";
  this.parentNode.style.display = "none";
};
document.querySelector("#editItemHold").onclick = () => {
  server.emit("editProduct", {
    name: document.querySelector("#nametove").value.trim(),
    desc: document.querySelector("#desce").value.trim(),
    pairsta: document.querySelector("#starta").value,
    pairend: document.querySelector("#enda").value,
    pairs: document.querySelector("#pairssa").value.trim(),
    uid: sessionStorage.getItem("elem"),
    sezon: sessionStorage.getItem("sezon"),
    category: document
      .querySelector(`[uid=${sessionStorage.getItem("elem")}]`)
      .getAttribute("category"),
  });
  document.querySelector(".cards").innerHTML = "";
  document.querySelector("#editItem").style.display = "none";
  document.querySelector("body > div.blur").style.display = "none";
};

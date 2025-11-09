function parseXmlProducts(xmlText) {
  const $ = (tag) => (node) =>
    node.querySelector(tag)?.textContent?.trim() || "";
  const doc = new DOMParser().parseFromString(xmlText, "application/xml");

  return [...doc.querySelectorAll("products > product")].map((p) => ({
    code: p.getAttribute("code") || "",
    category: $("category")(p),
    name: $("name")(p),
    artist: $("artist")(p),
    description: $("description")(p),
    quantity: +$("quantity")(p),
    price: +$("price")(p),
  }));
}

function cardTemplate(item) {
  return `
  <article class="card" data="${item.code}">
    <h3>${item.name}</h3>
    <div class="meta">${item.artist}</div>
    <img class="thumb" src="viynl.jpg" alt="Album art placeholder for ${
      item.name
    }"/>
    <div class="meta">Released: <span class="released">${
      item.released || ""
    }</span></div>
    <div class="meta">Code: ${item.code}</div>
    <div class="meta">€${item.price.toFixed(2)}</div>
    <p class="desc">${item.description || ""}</p>
  </article>
  `;
}

function render(items) {
  if (!albumsEl) return;
  albumsEl.innerHTML = items.map(cardTemplate).join("");
}

async function loadAndRender() {
  try {
    const res = await fetch("MusicStore.xml");
    const text = await res.text();
    const items = parseXmlProducts(text);
    window._ALBUMS_ = items;
    render(items);
  } catch (err) {
    //fetch issue
    if (albumsEl) {
      albumsEl.innerHTML = "<p>Unable to load XML document</p>";
    }
    console.error(err);
  }
}

//code searching
if (searchForm) {
  searchForm.addEventListener("submit");
  if (searchInput === "123-45") {
    alert((product = "123-45"));
  }
}

//sidebar functions
document.addEventListener("click", (e) => {
  const btn = e.target("menu.btn");
  const action = btn.getAttribute("data-action");
  const items = window._PRODUCTS_ || [];
  if (action === "available") {
    render(items.filter((p) => p.quantity > 0));
  } else if (action === "backorder") {
    alert(
      "Albums currently on back order are: Abbey Road, Humbug, Trilogy and Humanz"
    );
  } else if (action === "currentorders") {
    alert(
      "Golden Disks, Order: 242334, 10 Cartons= 5 x Abbey Road + 5 x Humbug"
    );
    alert("HMV, Order: 242534, 12 Cartons= 6 x AM + 6 x Deadbeat");
  } else if (action === "deliveryinfo") {
    alert("DPD, Contact Number: 015353744, email: dpdemail@email.com");
  } else {
    alert("This section is a placeholder");
  }
});

window.addEventListener("DOMContentLoaded", loadAndRender);

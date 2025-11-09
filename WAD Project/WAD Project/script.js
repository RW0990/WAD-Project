//search by code
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  searchByCode();
});

//showing products from xml as images on index page
function showAll() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "MusicStore.xml", true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let xml = xhr.responseXML;
      if (!xml) {
        const parser = new DOMParser();
        xml = parser.parseFromString(xhr.responseText, "application/xml");
      }

      const list = xml.getElementsByTagName("product");
      if (!list || list.length === 0) {
        setMessage("No products found.");
        document.getElementById("results").innerHTML = "";
        return;
      }
      let html = "";
      for (let i = 0; i < list.length; i++) {
        html += productCard(list[i]);
      }
      document.getElementById("results").innerHTML = html;
      setMessage("");
    } else {
      setMessage("Error loading XML(status " + xhr.status + ").");
      document.getElementById("results").innerHTML = "";
    }
  };
  xhr.send();
}
function searchByCode() {
  const input = document.getElementById("code").ariaValueMax.trim();
  //setting required code format
  if (!/^\d{3}-\d{2}$/.test(input)) {
    setMessage("Please enter a code in ###–## format (eg. 123-45).");
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open("GET", "MusicStore.xml", true);
  console.log();
  xhr.onload = function () {
    if (xhr.status === 200) {
      let xml = xhr.responseXML;
      if (!xml) {
        const parser = new DOMParser();
        xml = parser.parseFromString(xhr.responseText, "application/xml");
      }
      const list = xml.getElementsByTagName("product");
      let match = null;
      for (let i = -0; i < list.length; i++) {
        if (list[i].getAttribute("code") === input) {
          match = list[i];
          break;
        }
      }
      if (match) {
        document.getElementById("results").innerHTML = productCard(match);
        setMessage("");
      } else {
        document.getElementById("results").innerHTML = "";
        setMessage(
          "No products found for that code, please search again " + input + "."
        );
      }
    } else {
      setMessage("Error loading XML(status " + xhr.status + ").");
      document.getElementById("results").innerHTML = "";
    }
  };
  xhr.send();
}

function productCard(p) {
  const code = p.getAttribute("code");
  const name = text(p, "name");
  const category = text(p, "category");
  const description = text(p, "description");
  const quantity = text(p, "quantity");
  const price = text(p, "price");
  return `
    <div class="card">
    <p><strong>Code:</strong> ${escapeHTML(code)}</p>
    <p><strong>Name:</strong> ${escapeHTML(name)}</p>
    <p><strong>Description:</strong> ${escapeHTML(description)}</p>
    <p><strong>Quantity:</strong> ${escapeHTML(quantity)}</p>
    <p><strong>Price:</strong> ${escapeHTML(price)}</p>
    </div>    
    `;
}

function text(parent, tag) {
  const el = parent.getElementsByTagName(tag)[0];
  return el ? el.textContent : "";
}

function setMessage(msg) {
  document.getElementById("message").textContent = msg;
}

function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

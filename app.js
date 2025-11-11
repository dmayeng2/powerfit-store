// --- Datos de productos con 6 imágenes (placeholders listos para reemplazar) ---
// Puedes reemplazar los enlaces por fotos reales cuando quieras.
const productos = [
  {
    id: 1,
    nombre: "Whey Protein Premium",
    precio: 450.0,
    descripcion: "Proteína de suero de leche de absorción rápida. 25g de proteína por porción.",
    imagen: "https://gnc.com.gt/cdn/shop/products/GNC800X800-2022-08-09T103221.683_ba932ebf-442b-422d-8966-4a5180aa5efb_700x.png?v=1681233399"
  },
  {
    id: 2,
    nombre: "Creatina Monohidratada",
    precio: 280.0,
    descripcion: "Creatina pura 100%. Aumenta fuerza y masa muscular.",
    imagen: "https://fitness.com.gt/wp-content/uploads/2025/02/Creatina-Monohidratada-Blast-sin-Sabor-de-290-g-1.jpg"
  },
  {
    id: 3,
    nombre: "Pre-Entreno Explosivo",
    precio: 350.0,
    descripcion: "Energía y concentración máxima para tus entrenamientos.",
    imagen: "https://gnc.com.gt/cdn/shop/products/GNC800X800_7_800x.png?v=1659554206"
  },
  {
    id: 4,
    nombre: "BCAA 2:1:1",
    precio: 320.0,
    descripcion: "Aminoácidos ramificados para recuperación muscular.",
    imagen: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/bup/bup03715/y/8.jpg"
  },
  {
    id: 5,
    nombre: "Multivitamínico Completo",
    precio: 180.0,
    descripcion: "Complejo vitamínico para deportistas. 30 cápsulas.",
    imagen: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/fcd/fcd02953/y/8.jpg"
  },
  {
    id: 6,
    nombre: "Glutamina Pura",
    precio: 250.0,
    descripcion: "Recuperación muscular y fortalecimiento del sistema inmune.",
    imagen: "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nrx/nrx00097/y/42.jpg"
  }
];

let carrito = [];
let usuarioLogueado = false;

function mostrarProductos() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = productos
    .map(
      (p) => `
      <div class="product-card">
        <img src="${p.imagen}" alt="${p.nombre}" class="product-image">
        <h3 class="product-title">${p.nombre}</h3>
        <p class="product-description">${p.descripcion}</p>
        <p class="product-price">Q${p.precio.toFixed(2)}</p>
        ${
          usuarioLogueado
            ? `
          <div class="quantity-control">
            <button class="quantity-btn" onclick="cambiarCantidad(${p.id}, -1)">-</button>
            <input type="number" class="quantity-input" id="qty-${p.id}" value="1" min="1" max="10">
            <button class="quantity-btn" onclick="cambiarCantidad(${p.id}, 1)">+</button>
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>
        `
            : `
          <button class="btn btn-secondary" style="width: 100%;" onclick="showSection('login')">Inicia sesión para comprar</button>
        `
        }
      </div>
    `
    )
    .join("");
}

function cambiarCantidad(id, cambio) {
  const input = document.getElementById(`qty-${id}`);
  let valor = parseInt(input.value) + cambio;
  if (valor < 1) valor = 1;
  if (valor > 10) valor = 10;
  input.value = valor;
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const cantidad = parseInt(document.getElementById(`qty-${id}`).value);

  const itemExistente = carrito.find((item) => item.id === id);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  actualizarCarrito();
  alert(`${producto.nombre} agregado al carrito!`);
}

function actualizarCarrito() {
  document.getElementById("cartCount").textContent = carrito.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );

  const cartItems = document.getElementById("cartItems");
  if (carrito.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
  } else {
    cartItems.innerHTML = carrito
      .map(
        (item, index) => `
      <div class="cart-item">
        <div>
          <strong>${item.nombre}</strong><br>
          <span style="color: #666;">Cantidad: ${item.cantidad} | Q${item.precio.toFixed(2)} c/u</span>
        </div>
        <div>
          <strong style="color: #ff0000;">Q${(item.precio * item.cantidad).toFixed(2)}</strong><br>
          <button class="btn btn-secondary" style="padding: 5px 15px; font-size: 0.9em;" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById("cartTotal").textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((s) => s.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

  if (sectionId === "home") {
    mostrarProductos();
  }
}

// Login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const user = document.getElementById("username").value;
      const pass = document.getElementById("password").value;

      if (user === "alumno" && pass === "2025") {
        usuarioLogueado = true;
        document.getElementById("cartBtn").style.display = "inline-block";
        document.getElementById("loginError").textContent = "";
        alert("Bienvenido! Ahora puedes agregar productos al carrito.");
        showSection("home");
      } else {
        document.getElementById("loginError").textContent =
          "Usuario o contraseña incorrectos";
      }
    });
  }

  // Render inicial
  mostrarProductos();
});

function finalizarCompra() {
  const paymentMethod = document.getElementById("paymentMethod").value;
  const shipping = document.querySelector('input[name="shipping"]:checked');

  if (!paymentMethod) {
    alert("Por favor selecciona un método de pago");
    return;
  }

  if (!shipping) {
    alert("Por favor selecciona un método de envío");
    return;
  }

  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let costoEnvio = 0;
  if (shipping.value === "express") costoEnvio = 50;
  else if (shipping.value === "normal") costoEnvio = 25;

  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const total = subtotal + costoEnvio;

  const orderSummary = document.getElementById("orderSummary");
  orderSummary.innerHTML = `
    <div class="info-box">
      <h3 style="color: #ff0000; margin-bottom: 15px;">Resumen del Pedido</h3>
      ${carrito
        .map(
          (item) =>
            `<p>${item.nombre} x${item.cantidad} - Q${(item.precio * item.cantidad).toFixed(2)}</p>`
        )
        .join("")}
      <hr style="margin: 15px 0;">
      <p><strong>Subtotal:</strong> Q${subtotal.toFixed(2)}</p>
      <p><strong>Envío:</strong> Q${costoEnvio.toFixed(2)}</p>
      <p style="font-size: 1.2em; color: #ff0000;"><strong>Total:</strong> Q${total.toFixed(2)}</p>
      <hr style="margin: 15px 0;">
      <p><strong>Método de pago:</strong> ${
        document.getElementById("paymentMethod").options[document.getElementById("paymentMethod").selectedIndex].text
      }</p>
      <p><strong>Método de envío:</strong> ${shipping.parentElement.textContent.trim()}</p>
    </div>
  `;

  carrito = [];
  actualizarCarrito();
  showSection("confirmation");
}

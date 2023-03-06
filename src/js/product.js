let productList = [];
let carrito = [];
let total = 0;
let order = {
    items: []
};
function add(productId, price) {
    const product = productList.find(p => p.id === productId);
    product.stock--;

    order.items.push(productList.find(p => p.id === productId));

    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Carrito $${total}`;
    displayProducts();
}
async function eliminarProducto(id) {
    if (window.confirm("¿Seguro qué quieres levantar este producto? 7w7")) {
        const index = order.items.findIndex(p => p.id === id);
        if (index > -1) {
            const product = order.items[index];
            product.stock++;
            order.items.splice(index, 1);
            total = order.items.reduce((acc, p) => acc + p.price, 0);
            document.getElementById("order-total").innerHTML = `$${total}`;
            showOrder();
            document.getElementById("checkout").innerHTML = `Carrito $${total}`
        }
    }
}

async function showOrder() {
    document.getElementById("product-cards").style.display = "none";
    document.getElementById("order").style.display = "block";
    document.getElementById("main-header").style.display="none"
    document.getElementById("order-total").innerHTML = `$${total}`;

    let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
        <th>Eliminar</th>
    </tr>`
        ;
    order.items.forEach(p => {

        productsHTML +=
            `<tr>
            <td>1</td>
            <td>${p.name}</td>
            <td>${p.price}</td>
            <td><button class="eliminar" onclick="eliminarProducto(${p.id})" data-id="${p.id}">Eliminar</button></td>
        </tr>`
    });
    document.getElementById('order-table').innerHTML = productsHTML;
}






async function pay() {
    try {
        const productList = await (await fetch("/api/pay", {
            method: "post",
            body: JSON.stringify(carrito),
            headers: {
                "Content-Type": "application/json"
            }
        })).json();

        window.alert("Gracias por su compra")
        document.getElementById("main-header").style.display="block"
        document.getElementById("product-cards").style.display = "flex";
        document.getElementById("order").style.display = "none";
        


    }
    catch {
        window.alert("Sin stock");
    }

    carrito = [];
    total = 0;
    order = {
        items: []
    };
    //await fetchProducts();
    document.getElementById("checkout").innerHTML = `Carrito $${total}`
}

//-----
function displayProducts() {
    document.getElementById("main-header").style.display="flex"
    document.getElementById("product-cards").style.display = "flex";
    document.getElementById("order").style.display = "none";


    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;

        if (p.stock <= 0) {
            buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})">Sin stock</button>`;
        }

        productsHTML +=
            `<div class="product-container">
            <h3>${p.name}</h3>
            <img src="${p.image}" />
            <h1>$${p.price}</h1>
            ${buttonHTML}
        </div>`
    });
    document.getElementById('product-cards').innerHTML = productsHTML;
}

async function fetchProducts() {
    productList = await (await fetch("/api/products")).json();
    displayProducts();
}

window.onload = async () => {
    await fetchProducts();
}
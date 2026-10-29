// ទិន្នន័យគំរូដើម (Initial Dummy Data)
const initialProducts = [
    { id: 1, name: "Wireless Mouse", sku: "WM-201", category: "Accessories", qty: 142, price: 12.50, minAlert: 10 },
    { id: 2, name: "USB-C Cable 1m", sku: "UC-110", category: "Accessories", qty: 18, price: 4.20, minAlert: 20 },
    { id: 3, name: "Mechanical Keyboard", sku: "MK-330", category: "Peripherals", qty: 64, price: 58.00, minAlert: 15 },
    { id: 4, name: "27in Monitor", sku: "MN-270", category: "Displays", qty: 9, price: 189.00, minAlert: 10 },
    { id: 5, name: "Laptop Stand", sku: "LS-045", category: "Accessories", qty: 87, price: 21.90, minAlert: 10 }
];

// មុខងារទាញយកទិន្នន័យពី LocalStorage
function getProducts() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    return JSON.stringify(JSON.parse(localStorage.getItem('products')));
}

// មុខងាររក្សាទុកទិន្នន័យចូល LocalStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// គណនាលក្ខខណ្ឌ និងធ្វើបច្ចុប្បន្នភាព Dashboard
function updateDashboard() {
    const products = JSON.parse(getProducts());
    
    let totalProducts = products.length;
    let lowStockCount = 0;
    let totalValue = 0;

    const alertListContainer = document.getElementById('low-stock-alerts-list');
    if (alertListContainer) alertListContainer.innerHTML = '';

    products.forEach(p => {
        totalValue += (p.qty * p.price);
        if (p.qty <= p.minAlert) {
            lowStockCount++;
            if (alertListContainer) {
                alertListContainer.innerHTML += `
                    <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem; font-size:0.95rem;">
                        <span>${p.name}</span>
                        <span class="badge low-stock">${p.qty}</span>
                    </div>
                `;
            }
        }
    });

    if (document.getElementById('total-products')) document.getElementById('total-products').innerText = totalProducts.toLocaleString();
    if (document.getElementById('low-stock-items')) document.getElementById('low-stock-items').innerText = lowStockCount;
    if (document.getElementById('stock-value')) document.getElementById('stock-value').innerText = '$' + totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// បង្ហាញបញ្ជីទំនិញក្នុងទំព័រ Products
function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    const products = JSON.parse(getProducts());
    tableBody.innerHTML = '';

    products.forEach(p => {
        const status = p.qty <= p.minAlert ? 'Low stock' : 'In stock';
        const badgeClass = p.qty <= p.minAlert ? 'low-stock' : 'in-stock';

        tableBody.innerHTML += `
            <tr>
                <td><b>${p.name}</b></td>
                <td>${p.sku}</td>
                <td>${p.category}</td>
                <td>${p.qty}</td>
                <td>$${p.price.toFixed(2)}</td>
                <td><span class="badge ${badgeClass}">${status}</span></td>
            </tr>
        `;
    });
}

// បង្ហាញបញ្ជីនិងប៊ូតុងគ្រប់គ្រងស្តុក (Stock Management)
function renderStockTable() {
    const tableBody = document.getElementById('stock-table-body');
    if (!tableBody) return;

    const products = JSON.parse(getProducts());
    tableBody.innerHTML = '';

    products.forEach(p => {
        const status = p.qty <= p.minAlert ? 'Low stock' : 'In stock';
        const badgeClass = p.qty <= p.minAlert ? 'low-stock' : 'in-stock';

        tableBody.innerHTML += `
            <tr>
                <td><b>${p.name}</b></td>
                <td>${p.sku}</td>
                <td>${p.category}</td>
                <td><span id="qty-${p.id}">${p.qty}</span></td>
                <td>$${p.price.toFixed(2)}</td>
                <td><span id="badge-${p.id}" class="badge ${badgeClass}">${status}</span></td>
                <td>
                    <button class="action-btn" onclick="adjustStock(${p.id}, 'in')">📥 In</button>
                    <button class="action-btn" onclick="adjustStock(${p.id}, 'out')">📤 Out</button>
                </td>
            </tr>
        `;
    });
}

// មុខងារ បូក ឬ ដក ចំនួនស្តុក (Stock In / Stock Out Action)
function adjustStock(id, type) {
    let amount = prompt(`Enter quantity to stock ${type}:`);
    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) return;

    let products = JSON.parse(getProducts());
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        if (type === 'in') {
            products[productIndex].qty += amount;
        } else if (type === 'out') {
            if (products[productIndex].qty < amount) {
                alert("Not enough stock item available!");
                return;
            }
            products[productIndex].qty -= amount;
        }

        saveProducts(products);
        renderStockTable();
    }
}

// បង្កើតផលិតផលថ្មី (Add Product Wizard)
const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const products = JSON.parse(getProducts());
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('p_name').value,
            sku: document.getElementById('p_sku').value,
            category: document.getElementById('p_category').value,
            qty: parseInt(document.getElementById('p_qty').value),
            price: parseFloat(document.getElementById('p_price').value),
            minAlert: parseInt(document.getElementById('p_alert').value)
        };

        products.push(newProduct);
        saveProducts(products);
        alert("Product added successfully!");
        window.location.href = 'products.html';
    });
}

// ប្រព័ន្ធ Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'admin' && pass === 'password') {
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid Username or Password! (Hint: admin / password)');
        }
    });
}

// ដំណើរការទៅតាមទំព័រនីមួយៗ
window.onload = function() {
    updateDashboard();
    renderProductsTable();
    renderStockTable();
};

let orders = [];
let filteredOrders = [];
let assignmentHistory = [];

function addOrder(event) {
    event.preventDefault();

    let orderId = document.getElementById("orderId").value.trim();
    let restaurantName = document.getElementById("restaurantName").value.trim();
    let itemCount = document.getElementById("itemCount").value.trim();
    let distance = document.getElementById("distance").value.trim();
    let isPaid = document.getElementById("isPaid").value === "true";

    if (!orderId || !restaurantName || !itemCount || !distance) {
        showOutput("Please fill all fields", "error");
        return;
    }

    if (isNaN(itemCount) || isNaN(distance) || itemCount < 1 || distance < 0) {
        showOutput("Please enter valid item count and distance", "error");
        return;
    }

    const newOrder = {
        orderId,
        restaurantName,
        itemCount: parseInt(itemCount),
        isPaid,
        deliveryDistance: parseFloat(distance),
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    orders.push(newOrder);

    document.getElementById("orderId").value = "";
    document.getElementById("restaurantName").value = "";
    document.getElementById("itemCount").value = "";
    document.getElementById("distance").value = "";
    document.getElementById("isPaid").value = "false";

    displayOrders(orders);
    updateStats();
    showOutput(`✓ Order ${orderId} created successfully for ${restaurantName}`, "success");
}

function displayOrders(list, elementId = "orderList") {
    let ul = document.getElementById(elementId);
    if (!ul) return;

    ul.innerHTML = "";

    if (list.length === 0) {
        ul.innerHTML = `
            <li class="empty-list">
                <i class="fas fa-inbox"></i>
                <p>No orders found. Add your first order to get started.</p>
            </li>
        `;
        const countElement = document.getElementById(elementId === "orderList" ? "orderCount" : "availableCount");
        if (countElement) countElement.textContent = "0";
        return;
    }

    const countElement = document.getElementById(elementId === "orderList" ? "orderCount" : "availableCount");
    if (countElement) countElement.textContent = list.length;

    list.forEach(order => {
        let li = document.createElement("li");
        li.className = "order-item";

        const statusBadge = order.isPaid ?
            `<span class="order-badge badge-paid"><i class="fas fa-check-circle"></i> Paid</span>` :
            `<span class="order-badge badge-unpaid"><i class="fas fa-clock"></i> Unpaid</span>`;

        li.innerHTML = `
            <div class="order-header">
                <span class="order-id">${order.orderId}</span>
                ${statusBadge}
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <i class="fas fa-utensils"></i>
                    <span><strong>${order.restaurantName}</strong></span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-box"></i>
                    <span>${order.itemCount} items</span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-road"></i>
                    <span>${order.deliveryDistance} km</span>
                </div>
                <div class="order-detail">
                    <i class="fas fa-clock"></i>
                    <span>${order.createdAt}</span>
                </div>
            </div>
        `;

        ul.appendChild(li);
    });
}
function updateStats() {
    const totalOrders = orders.length;
    const paidOrders = orders.filter(o => o.isPaid).length;
    const unpaidOrders = orders.filter(o => !o.isPaid).length;
    const unassignedOrders = unpaidOrders;

    const totalElement = document.getElementById("totalOrders");
    const paidElement = document.getElementById("paidOrders");
    const unpaidElement = document.getElementById("unpaidOrders");
    const unassignedElement = document.getElementById("unassignedOrders");

    if (totalElement) totalElement.textContent = totalOrders;
    if (paidElement) paidElement.textContent = paidOrders;
    if (unpaidElement) unpaidElement.textContent = unpaidOrders;
    if (unassignedElement) unassignedElement.textContent = unassignedOrders;
}

function filterOrders() {
    let filterPaid = document.getElementById("filterPaid")?.value || "all";
    let maxDistance = document.getElementById("filterDistance")?.value || document.getElementById("maxDistance")?.value;
    let searchOrderId = document.getElementById("searchOrderId")?.value.trim() || "";
    let sortBy = document.getElementById("sortBy")?.value || "distance";

    filteredOrders = orders;

    if (filterPaid === "paid") {
        filteredOrders = filteredOrders.filter(o => o.isPaid);
    } else if (filterPaid === "unpaid") {
        filteredOrders = filteredOrders.filter(o => !o.isPaid);
    }

    if (maxDistance && !isNaN(maxDistance)) {
        filteredOrders = filteredOrders.filter(o => o.deliveryDistance <= parseFloat(maxDistance));
    }

    if (searchOrderId) {
        filteredOrders = filteredOrders.filter(o => o.orderId.toLowerCase().includes(searchOrderId.toLowerCase()));
    }

    if (sortBy === "distance") {
        filteredOrders.sort((a, b) => a.deliveryDistance - b.deliveryDistance);
    } else if (sortBy === "latest") {
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "items") {
        filteredOrders.sort((a, b) => b.itemCount - a.itemCount);
    }

    const availableList = document.getElementById("availableOrdersList");
    if (availableList) {
        displayOrders(filteredOrders, "availableOrdersList");
    } else {
        displayOrders(filteredOrders);
    }

    const filterSummary = `Found ${filteredOrders.length} order(s) | ${filterPaid !== "all" ? filterPaid.toUpperCase() : "All statuses"} ${maxDistance ? `| Max: ${maxDistance}km` : ""} ${searchOrderId ? `| Search: ${searchOrderId}` : ""}`;
    showOutput(filterSummary, "success");
}

function resetFilters() {
    if (document.getElementById("filterPaid")) document.getElementById("filterPaid").value = "all";
    if (document.getElementById("filterDistance")) document.getElementById("filterDistance").value = "";
    if (document.getElementById("searchOrderId")) document.getElementById("searchOrderId").value = "";
    if (document.getElementById("maxDistance")) document.getElementById("maxDistance").value = "";
    if (document.getElementById("sortBy")) document.getElementById("sortBy").value = "distance";
    
    filteredOrders = orders;
    displayOrders(orders);
    const availableList = document.getElementById("availableOrdersList");
    if (availableList) {
        displayOrders(orders, "availableOrdersList");
    }
    showOutput("✓ Filters reset. Showing all orders.", "success");
}

function assignDelivery() {
    let maxDistance = document.getElementById("maxDistance")?.value;

    if (orders.length === 0) {
        showOutput("No orders available to assign", "warning");
        return;
    }

    let availableOrders = filteredOrders.length > 0 ? filteredOrders : orders.filter(o => !o.isPaid);

    if (maxDistance && !isNaN(maxDistance)) {
        availableOrders = availableOrders.filter(o => o.deliveryDistance <= parseFloat(maxDistance));
    }

    if (availableOrders.length === 0) {
        showOutput("No unpaid orders available within the specified distance", "warning");
        return;
    }

    availableOrders.sort((a, b) => a.deliveryDistance - b.deliveryDistance);

    let assignedOrder = availableOrders[0];

    const historyItem = {
        orderId: assignedOrder.orderId,
        restaurant: assignedOrder.restaurantName,
        assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    assignmentHistory.unshift(historyItem);

    updateAssignmentHistory();

    showOutput(`
        <strong>✓ Delivery Assigned Successfully!</strong><br>
        Order ID: ${assignedOrder.orderId}<br>
        Restaurant: ${assignedOrder.restaurantName}<br>
        Items: ${assignedOrder.itemCount}<br>
        Distance: ${assignedOrder.deliveryDistance} km<br>
        Status: Ready for delivery<br>
        <em>Assigned at: ${historyItem.assignedAt}</em>
    `, "success");
}

function updateAssignmentHistory() {
    const historyDiv = document.getElementById("assignmentHistory");
    if (!historyDiv) return;

    if (assignmentHistory.length === 0) {
        historyDiv.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No assignments yet.</p>
            </div>
        `;
        return;
    }

    historyDiv.innerHTML = "";
    assignmentHistory.slice(0, 5).forEach((item, index) => {
        const historyEl = document.createElement("div");
        historyEl.className = "history-item";
        historyEl.innerHTML = `
            <strong>#${index + 1}</strong> - ${item.orderId} (${item.restaurant})<br>
            <small>${item.assignedAt}</small>
        `;
        historyDiv.appendChild(historyEl);
    });
}

function showOutput(message, type = "success") {
    const outputDiv = document.getElementById("output");
    if (!outputDiv) return;
    
    const messageEl = document.createElement("div");
    messageEl.className = `output-message ${type}`;
    messageEl.innerHTML = message;
    
    if (outputDiv.querySelector(".empty-state")) {
        outputDiv.innerHTML = "";
    }
    
    outputDiv.insertBefore(messageEl, outputDiv.firstChild);
    
    const messages = outputDiv.querySelectorAll(".output-message");
    if (messages.length > 10) {
        messages[messages.length - 1].remove();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector(".form-group");
    if (form) {
        form.addEventListener("submit", addOrder);
    }

    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach(input => {
        input.addEventListener("focus", function() {
            this.style.borderColor = "var(--color-primary)";
        });
        input.addEventListener("blur", function() {
            this.style.borderColor = "var(--color-gray)";
        });
    });

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if ((currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === href) ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    updateStats();
});
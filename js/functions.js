function addClient() {
    formInputs.forEach(function (input) {
        checkInput(input);
    });

    if (form.querySelector("input.is-invalid") !== null) {
        return;
    }

    let client = getClient(++id);

    clientsArr.push(client);
    updateLocalStorage();

    applyFilters();
    resetForm();
}

function getClient(id) {
    let client = { id: id };
    formInputs.forEach(function (input) {
        client[input.name] = input.value.trim();
    });
    client.status = statusSelect.value;
    return client;
}

function clientRowHTML(client) {
    let status = client.status || "Pending";
    return `<th>${client.id}</th>
        <td>${client.ClientName}</td>
        <td>${client.phone}</td>
        <td>${client.Date}</td>
        <td>${client.time}</td>
        <td>${client.guests}</td>
        <td>
            <select class="form-select form-select-sm status-select status-${status.toLowerCase()}"
                onchange="changeStatus(${client.id}, this.value)">
                <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
                <option value="Confirmed" ${status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                <option value="Cancelled" ${status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
        </td>
        <td>
            <div class="buttons">
                <button class="btn btn-info text-light me-2" onclick="insertClientIntoForm(${client.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteClient(${client.id}, this)">Delete</button>
            </div>
        </td>`;
}

function showClient(client) {
    tableBody.innerHTML += `<tr data-client-id="${client.id}">${clientRowHTML(client)}</tr>`;
}

function checkInput(input) {
    let inputName = input.name;
    let inputValue = input.value.trim();
    let isEmpty = inputValue === "";
    let errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`);
    let isInvalid = !regexInputs[inputName].test(inputValue);
    let errorMsg = "";

    if (isEmpty) {
        errorMsg = "This field is required.";
    } else if (isInvalid) {
        errorMsg = "Is Invalid.";
    }

    if (isEmpty || isInvalid) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorEle.classList.remove("d-none");
        errorEle.textContent = errorMsg;
        input.dataset.valid = "false";
    } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        errorEle.classList.add("d-none");
        input.dataset.valid = "true";
    }
}

function resetForm() {
    form.reset();
    formInputs.forEach(function (input) {
        input.classList.remove("is-valid");
        input.classList.remove("is-invalid");
        input.dataset.valid = "false";
        document.querySelector(`p.alert[data-error-name="${input.name}"]`).classList.add("d-none");
    });

    let formBtn = form.querySelector("button");
    formBtn.textContent = "Add";

    form.querySelector(".fa-rotate-left").classList.remove("show");
    form.removeAttribute("data-client-id");
    form.setAttribute("data-type", "add");

    tableBody.querySelectorAll(".buttons button").forEach(function (btn) {
        btn.removeAttribute("disabled");
    });
}

function updateLocalStorage() {
    localStorage.setItem("clientsArr", JSON.stringify(clientsArr));
}

function getClientIndex(id) {
    return clientsArr.findIndex(function (client) {
        return client.id == id;
    });
}

function showClientsArr(data) {
    tableBody.innerHTML = `<td id="tableAlert" class="table-warning text-center" colspan="8">There Are No Data</td>`;
    data.forEach(function (client) {
        showClient(client);
    });
    checkEmptyTable(data);
    updateCounts();

    if (form.dataset.type === "edit") {
        tableBody.querySelectorAll(".buttons button").forEach(function (btn) {
            btn.setAttribute("disabled", "");
        });
    }
}

function deleteClient(id, that) {
    if (!confirm("Are you Sure")) {
        return;
    }
    let deletedClient = getClientIndex(id);
    clientsArr.splice(deletedClient, 1);
    updateLocalStorage();

    applyFilters();
}

function checkEmptyTable(data) {
    let tableAlert = document.querySelector("#tableAlert");

    tableAlert.textContent = clientsArr.length === 0
        ? "There Are No Data"
        : "No bookings match your search";

    if (data.length == 0) {
        tableAlert.classList.remove("d-none");
    } else {
        tableAlert.classList.add("d-none");
    }
}

function insertClientIntoForm(id) {
    resetForm();
    let clientToEdit = clientsArr.find(function (client) {
        return client.id == id;
    });
    let formBtn = form.querySelector("button");

    for (let input of formInputs) {
        input.value = clientToEdit[input.name];
        input.dataset.valid = "true";
    }
    statusSelect.value = clientToEdit.status || "Pending";

    formBtn.textContent = "Edit";
    formBtn.classList.remove("btn-success");
    formBtn.classList.add("btn-info", "text-light");
    form.setAttribute("data-type", "edit");
    form.setAttribute("data-client-id", id);

    tableBody.querySelectorAll(".buttons button").forEach(function (btn) {
        btn.setAttribute("disabled", "");
    });
    form.querySelector(".fa-rotate-left").classList.add("show");
}

function editClient() {
    formInputs.forEach(function (input) {
        checkInput(input);
    });

    if (form.querySelector("input.is-invalid") !== null) {
        return;
    }

    let clientId = form.dataset.clientId,
        client = getClient(clientId),
        clientIndex = getClientIndex(clientId);

    clientsArr[clientIndex] = client;
    updateLocalStorage();

    resetForm();
    applyFilters();
}

function applyFilters() {
    let filtered = clientsArr.filter(function (client) {
        let matchStatus = statusFilter === "All" || (client.status || "Pending") === statusFilter;
        let matchSearch =
            client.ClientName.toLowerCase().includes(searchKey) ||
            client.phone.toString().includes(searchKey);
        return matchStatus && matchSearch;
    });

    showClientsArr(filtered);
}

function search(key) {
    searchKey = key.trim().toLowerCase();
    applyFilters();
}

function changeStatus(id, status) {
    clientsArr[getClientIndex(id)].status = status;
    updateLocalStorage();
    applyFilters();
}

function updateCounts() {
    document.querySelectorAll("[data-count]").forEach(function (el) {
        let status = el.dataset.count;
        el.textContent = status === "All"
            ? clientsArr.length
            : clientsArr.filter(function (c) {
                return (c.status || "Pending") === status;
            }).length;
    });
}

function showIcon() {
    form.querySelector(".fa-rotate-left").classList.add("show");
}

function cancelEdit() {
    resetForm();
}

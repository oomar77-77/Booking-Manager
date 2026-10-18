let form = document.querySelector("#Register form");
let formInputs = form.querySelectorAll("input"),
    statusSelect = form.querySelector(`select[name="status"]`),
    filtersBox = document.querySelector("#filters"),
    statusFilter = "All",
    searchKey = "",
    clientsArr = [],
    id = 0,
    tableBody = document.querySelector("tbody"),
    regexInputs = {
        ClientName: /^[A-Za-z\u0600-\u06FF\s]+$/,
        phone: /^(010|011|012|015)[0-9]{8}$/,
        Date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
        time: /^([01]\d|2[0-3]):([0-5]\d)$/,
        guests: /^([1-9]|10)$/
    },
    searchInput = document.querySelector("#searchInput");

if (localStorage.getItem("clientsArr") === null) {
    updateLocalStorage();
} else {
    clientsArr = JSON.parse(localStorage.getItem("clientsArr")).map(function (c) {
        let { age, ...rest } = c;
        return {
            ...rest,
            guests: c.guests ?? age ?? "",
            status: c.status || "Pending"
        };
    });
    id = Math.max(0, ...clientsArr.map(c => Number(c.id)));
    updateLocalStorage();
    showClientsArr(clientsArr);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    let typeOfForm = form.getAttribute("data-type");

    if (typeOfForm == "add") {
        addClient();
    } else if (typeOfForm == "edit") {
        editClient();
    }
});

searchInput.addEventListener("keyup", function () {
    search(this.value);
});

filtersBox.addEventListener("click", function (e) {
    let btn = e.target.closest("button[data-status]");
    if (!btn) return;

    statusFilter = btn.dataset.status;
    filtersBox.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b === btn);
    });
    applyFilters();
});
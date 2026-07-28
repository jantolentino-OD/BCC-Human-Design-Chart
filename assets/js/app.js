const form = document.getElementById("chartForm");
const loadingSection = document.getElementById("loadingSection");
const reportSection = document.getElementById("reportSection");

const resultName = document.getElementById("resultName");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    reportSection.classList.add("hidden");
    loadingSection.classList.remove("hidden");

    loadingSection.scrollIntoView({
        behavior: "smooth"
    });

    try {

        const response = await fetch("/api/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullName: document.getElementById("fullName").value,

                birthDate: document.getElementById("birthDate").value,

                birthTime: document.getElementById("birthTime").value,

                birthLocation: document.getElementById("birthLocation").value,

                email: document.getElementById("email").value

            })

        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        // Display returned data
        resultName.textContent = data.report.name;

        // We'll populate the remaining report fields later.
        // For now, proving the frontend and backend communicate is enough.

        loadingSection.classList.add("hidden");
        reportSection.classList.remove("hidden");

        reportSection.scrollIntoView({
            behavior: "smooth"
        });

    }
    catch (error) {

        loadingSection.classList.add("hidden");

        alert(error.message || "Something went wrong.");

        console.error(error);

    }

});
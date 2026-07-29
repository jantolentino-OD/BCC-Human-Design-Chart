import { types } from "../../content/types.js";
import { strategies } from "../../content/strategies.js";
import { authorities } from "../../content/authorities.js";
import { profiles } from "../../content/profiles.js";

const form = document.getElementById("chartForm");
const loadingSection = document.getElementById("loadingSection");
const reportSection = document.getElementById("reportSection");

// =======================================
// Helper Functions
// =======================================

function setText(id, value, fallback = "-") {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value || fallback;

}

function normalizeAuthority(authority = "") {

    authority = authority.trim();

    if (authority.startsWith("Emotional")) {
        return "Emotional";
    }

    if (authority.startsWith("Mental")) {
        return "Mental (Sounding Board)";
    }

    return authority;

}

function createList(items = []) {

    if (!items.length) {
        return "";
    }

    return `
        <ul>
            ${items.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

}

function renderSection(containerId, content) {

    const container = document.getElementById(containerId);

    if (!container) return;

    if (!content) {

        container.innerHTML = `
            <p>
                Personalized information for this section is not available yet.
            </p>
        `;

        return;

    }

    container.innerHTML = `

        <h3>${content.name}</h3>

        <p>
            ${content.overview}
        </p>

        <h4>
            Strengths
        </h4>

        ${createList(content.strengths)}

        <h4>
            Common Challenges
        </h4>

        ${createList(content.challenges)}

        <h4>
            Practical Guidance
        </h4>

        ${createList(content.guidance)}

    `;

}

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

        console.log("========== API RESPONSE ==========");

        console.log(data);

        if (data.report) {

            console.log("========== REPORT ==========");

            console.log(data.report);

            console.log("========== RAW BODYGRAPH ==========");

            console.log(data.report.raw);

        }

        console.log("==================================");

        if (!data.success) {

            throw new Error(data.message);

        }
        // ===========================
        // Populate Report Cards
        // ===========================

        setText(
            "resultName",
            data.report.name
        );

        setText(
            "resultType",
            data.report.type
        );

        setText(
            "resultStrategy",
            data.report.strategy
        );

        setText(
            "resultAuthority",
            data.report.authority
        );

        setText(
            "resultDefinition",
            data.report.definition
        );

        setText(
            "resultProfile",
            data.report.profile
        );

        setText(
            "resultIncarnationCross",
            data.report.incarnationCross
        );

        setText(
            "resultSignature",
            data.report.signature
        );

        setText(
            "resultNotSelfTheme",
            data.report.notSelfTheme
        );

        // ===========================
        // Advanced Variables
        // ===========================

        setText(
            "resultDigestion",
            data.report.raw?.determination?.label
        );

        setText(
            "resultSense",
            data.report.raw?.cognition?.name
        );

        setText(
            "resultMotivation",
            data.report.raw?.motivation?.label
        );

        setText(
            "resultPerspective",
            data.report.raw?.perspective?.label
        );

        setText(
            "resultEnvironment",
            data.report.raw?.environment?.label
        );

        setText(
            "resultDesignSense",
            null,
            "Coming Soon"
        );

        // ===========================
        // Personalized Sections
        // ===========================

        const typeContent =
            types[data.report.type];

        const strategyContent =
            strategies[data.report.strategy];

        const authorityContent =
            authorities[
                normalizeAuthority(
                    data.report.authority
                )
            ];

        const profileContent =
            profiles[data.report.profile];

        renderSection(
            "typeContent",
            typeContent
        );

        renderSection(
            "strategyContent",
            strategyContent
        );

        renderSection(
            "authorityContent",
            authorityContent
        );

        renderSection(
            "profileContent",
            profileContent
        );

                // ===========================
        // Fallback Warnings (Optional)
        // ===========================

        if (!typeContent) {

            console.warn(
                "No matching Type content found for:",
                data.report.type
            );

        }

        if (!strategyContent) {

            console.warn(
                "No matching Strategy content found for:",
                data.report.strategy
            );

        }

        if (!authorityContent) {

            console.warn(
                "No matching Authority content found for:",
                data.report.authority
            );

        }

        if (!profileContent) {

            console.warn(
                "No matching Profile content found for:",
                data.report.profile
            );

        }

        // ===========================
        // Reveal Report
        // ===========================

        loadingSection.classList.add("hidden");

        reportSection.classList.remove("hidden");

        reportSection.scrollIntoView({

            behavior: "smooth"

        });

    }

    catch (error) {

        loadingSection.classList.add("hidden");

        alert(
            error.message ||
            "Something went wrong."
        );

        console.error(error);

    }

});
const BASE_URL = "https://api.humandesignhub.app/v2";

/**
 * Generic helper for Human Design Hub API requests
 */
async function hdFetch(endpoint, options = {}) {

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.HD_API_KEY,
            ...(options.headers || {})
        }
    });

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `Human Design API Error (${response.status}): ${errorText}`
        );

    }

    return response.json();

}

/**
 * Search for a city and return the best match.
 */
export async function searchLocation(query) {

    const data = await hdFetch(
        `/locations/search?query=${encodeURIComponent(query)}`,
        {
            method: "GET"
        }
    );

    console.log("======================================");
    console.log("LOCATION SEARCH QUERY:");
    console.log(query);
    console.log("--------------------------------------");
    console.log("LOCATION SEARCH RESPONSE:");
    console.log(JSON.stringify(data, null, 2));
    console.log("======================================");

    if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error("Location not found.");
    }

    return data.results[0];

}

/**
 * Convert date, time and timezone into an ISO datetime.
 */
export async function resolveTimezone(date, time, timezone) {

    const data = await hdFetch("/timezone/resolve", {
        method: "POST",
        body: JSON.stringify({
            date,
            time,
            timezone
        })
    });

    if (!data.datetime) {
        throw new Error("Unable to resolve timezone.");
    }

    return data.datetime;

}

/**
 * Generate Human Design chart.
 */
export async function generateBodygraph(datetime) {

    const data = await hdFetch("/simple-bodygraph", {
        method: "POST",
        body: JSON.stringify({
            datetime
        })
    });

    console.log("========== RAW SIMPLE BODYGRAPH ==========");
    console.log(JSON.stringify(data, null, 2));
    console.log("==========================================");

    return data;

}
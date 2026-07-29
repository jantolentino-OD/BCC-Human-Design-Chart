import {
    searchLocation,
    resolveTimezone,
    generateBodygraph
} from "./services/humanDesign.js";

export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

        console.log("========== ENV DEBUG ==========");
        console.log("HD_API_KEY:", process.env.HD_API_KEY);
        console.log("SYSTEME_API_KEY:", process.env.SYSTEME_API_KEY);
        console.log("SYSTEME_BASE_URL:", process.env.SYSTEME_BASE_URL);
        console.log("All env keys:", Object.keys(process.env).filter(key =>
            key.includes("HD") ||
            key.includes("SYSTEM") ||
            key.includes("VERCEL")
        ));
        console.log("===============================");

        const {
            fullName,
            birthDate,
            birthTime,
            birthLocation,
            email
        } = req.body;

        // Basic validation
        if (
            !fullName ||
            !birthDate ||
            !birthTime ||
            !birthLocation ||
            !email
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        // Step 1: Find the location
        const location = await searchLocation(birthLocation);

        // Step 2: Resolve timezone
        const datetime = await resolveTimezone(
            birthDate,
            birthTime,
            location.timezone
        );

        // Step 3: Generate Human Design chart
        const bodygraph = await generateBodygraph(datetime);

        // DEBUG: Print the complete API response
        console.log("========== BODYGRAPH RESPONSE ==========");
        console.log(JSON.stringify(bodygraph, null, 2));
        console.log("========================================");

        return res.status(200).json({
            success: true,
            report: {
                name: fullName,
                type: bodygraph.type,
                strategy: bodygraph.strategy,
                authority: bodygraph.authority,
                profile: bodygraph.profile,
                definition: bodygraph.definition,
                incarnationCross: bodygraph.incarnation_cross,
                signature: bodygraph.signature,
                notSelfTheme: bodygraph.not_self_theme,
                raw: bodygraph
            }
        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong."
        });

    }

}
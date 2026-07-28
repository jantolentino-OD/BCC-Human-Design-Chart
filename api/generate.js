export default async function handler(req, res) {

    // Only allow POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method Not Allowed"
        });
    }

    try {

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

        /*
        =====================================================
        TEMPORARY RESPONSE

        Later we'll replace this section with:

        1. Human Design API
        2. Systeme.io API
        3. Database (optional)

        =====================================================
        */

        return res.status(200).json({
            success: true,

            report: {

                name: fullName,

                type: "Generator",

                strategy: "To Respond",

                authority: "Emotional",

                profile: "4/6",

                definition: "Single Definition",

                incarnationCross:
                    "Right Angle Cross of Service",

                signature: "Satisfaction",

                notSelfTheme: "Frustration"

            }

        });

    }
    catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong."
        });

    }

}
require('dotenv').config();

async function testQubrid() {
    const apiKey = 'k_d737ef180c1a.9Q287X0Rq_lXsl3Pv9idZrrQDfByq2uRFjrVhcNAR_Sc0J3AW1pWFQ';
    const baseUrl = 'https://platform.qubrid.com/api/v1/qubridai'; // Specific qubrid ai endpoint

    console.log("Testing Qubrid API Key...");

    try {
        const response = await fetch(`${baseUrl}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            console.error(`Status: ${response.status}`);
            console.error(`Error: ${error}`);
            return;
        }

        const data = await response.json();
        console.log("Available Models on Qubrid:");
        data.data.forEach(m => console.log(`- ${m.id}`));

    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

testQubrid();

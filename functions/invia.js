export async function onRequestPost(context) {
    try {
        const input = await context.request.json();
        
        const nome = input.name || "Nessun nome";
        const email = input.email || "Nessuna email";
        const dettagli = input.details || "Nessun dettaglio";

        // ECCO LA MAGIA: Ora prende la chiave dalla cassaforte di Cloudflare!
        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        const emailData = {
            from: "onboarding@resend.dev", 
            
            // INSERISCI QUI LA TUA EMAIL (Questa va bene in chiaro, non è un segreto)
            to: "novus.ateliers@gmail.com", 
            
            subject: `Novus Ateliers: Nuova Richiesta da ${nome}`,
            html: `
                <div style="font-family: sans-serif; color: #101010; line-height: 1.6;">
                    <h2 style="color: #B29054;">Nuovo progetto in entrata!</h2>
                    <p><strong>Nome o Brand:</strong> ${nome}</p>
                    <p><strong>Email del contatto:</strong> ${email}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Dettagli del progetto:</strong></p>
                    <p style="background: #f7f7f4; padding: 15px; border-radius: 4px;">${dettagli}</p>
                </div>
            `
        };

        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify(emailData)
        });

        if (!res.ok) {
            const errorResponse = await res.text();
            throw new Error(`Errore Resend: ${errorResponse}`);
        }

        return new Response(JSON.stringify({ success: true, message: "Email inviata" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

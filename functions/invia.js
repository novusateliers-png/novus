export async function onRequestPost(context) {
    try {
        // 1. ECCO LA MODIFICA: Leggiamo i dati nel formato nativo dei form HTML
        const formData = await context.request.formData();
        
        // 2. Estraiamo i dati (ho messo delle opzioni in inglese e italiano in base a come si chiamano nel tuo HTML)
        const nome = formData.get('name') || formData.get('nome') || "Nessun nome";
        const email = formData.get('email') || "Nessuna email";
        const dettagli = formData.get('details') || formData.get('message') || formData.get('messaggio') || "Nessun dettaglio";

        // 3. Peschiamo la chiave dalla cassaforte di Cloudflare
        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        const emailData = {
            from: "onboarding@resend.dev", 
            to: "tuamail@gmail.com", // Ricordati di rimettere la tua email qui!
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

        // Risposta di successo al browser
        return new Response(JSON.stringify({ success: true, message: "Email inviata con successo!" }), {
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

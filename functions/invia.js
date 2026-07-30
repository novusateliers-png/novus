export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        const nome = formData.get('name') || formData.get('nome') || "Nessun nome";
        const email = formData.get('email') || "Nessuna email";
        const dettagli = formData.get('details') || formData.get('message') || formData.get('messaggio') || "Nessun dettaglio";

        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        const emailData = {
            from: "onboarding@resend.dev", 
            
            // INSERISCI ESATTAMENTE QUESTA EMAIL:
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

        // AGGIORNAMENTO: Invece di mostrare la pagina nera con il testo JSON,
        // reindirizziamo l'utente direttamente alla home page del sito
        const url = new URL(context.request.url);
        return Response.redirect(url.origin, 303);

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

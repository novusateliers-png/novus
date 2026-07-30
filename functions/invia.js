export async function onRequestPost(context) {
    try {
        // 1. Legge i dati inviati dal tuo form (Nome, Email, Dettagli)
        const input = await context.request.json();
        
        // Se un campo è vuoto, mette un testo di sicurezza
        const nome = input.name || "Nessun nome";
        const email = input.email || "Nessuna email";
        const dettagli = input.details || "Nessun dettaglio";

        // 2. INSERISCI QUI LA TUA CHIAVE API DI RESEND (tra le virgolette)
        const RESEND_API_KEY = "re_5j4mNP5U_Pv6td5RMj5hPjM3vXnfFFg8z";

        // 3. Configura come sarà l'email che riceverai
        const emailData = {
            // Nota: Finché non verifichi un tuo dominio su Resend, devi usare questa mail di default come mittente
            from: "onboarding@resend.dev", 
            
            // INSERISCI QUI LA TUA EMAIL DOVE VUOI RICEVERE LE NOTIFICHE
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

        // 4. Invia materialmente l'email tramite l'infrastruttura di Resend
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify(emailData)
        });

        // Controlla se Resend ha dato un errore
        if (!res.ok) {
            const errorResponse = await res.text();
            throw new Error(`Errore Resend: ${errorResponse}`);
        }

        // Risposta di successo che sblocca il form sul sito
        return new Response(JSON.stringify({ success: true, message: "Email inviata con successo" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        // Se qualcosa va storto, avvisa il sito
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

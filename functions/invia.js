export async function onRequestPost(context) {
    try {
        // Legge i dati inviati dal form
        const input = await context.request.json();
        
        // QUI INSERISCI LA TUA LOGICA (es. invio a Resend, Sendgrid, Telegram, ecc.)
        // const nome = input.name;
        // const email = input.email;

        // Risposta di successo al sito
        return new Response(JSON.stringify({ success: true, message: "Inviato" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        // Risposta in caso di errore
        return new Response(JSON.stringify({ error: "Errore interno" }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}

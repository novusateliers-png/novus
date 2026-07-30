export async function onRequestPost(context) {
    try {
        const formData = await context.request.formData();
        
        const nome = formData.get('name') || formData.get('nome') || "Nessun nome";
        const email = formData.get('email') || "Nessuna email";
        const dettagli = formData.get('details') || formData.get('message') || formData.get('messaggio') || "Nessun dettaglio";

        const RESEND_API_KEY = context.env.RESEND_API_KEY;

        const emailData = {
            from: "onboarding@resend.dev", 
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

        // LA SOLUZIONE: Una pagina di ringraziamento elegante in HTML
        const successHTML = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Richiesta Ricevuta - Novus Ateliers</title>
            <style>
                body { 
                    font-family: 'Helvetica Neue', Arial, sans-serif; 
                    background-color: #101010; 
                    color: #ffffff; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100vh; 
                    margin: 0; 
                    text-align: center; 
                }
                .box { 
                    max-width: 500px; 
                    padding: 40px; 
                    border: 1px solid #333; 
                    border-radius: 8px; 
                    background: #1a1a1a; 
                }
                h1 { color: #B29054; margin-bottom: 20px; font-weight: normal; }
                p { font-size: 1.1em; line-height: 1.6; color: #cccccc; margin-bottom: 30px; }
                .btn { 
                    display: inline-block; 
                    padding: 12px 24px; 
                    background-color: #B29054; 
                    color: #101010; 
                    text-decoration: none; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    transition: background 0.3s; 
                }
                .btn:hover { background-color: #937644; }
            </style>
        </head>
        <body>
            <div class="box">
                <h1>Richiesta Ricevuta!</h1>
                <p>Grazie per averci contattato, <strong>${nome}</strong>.<br>Abbiamo ricevuto i dettagli del tuo progetto e a breve ti contatteremo.</p>
                <a href="/" class="btn">Torna al Sito</a>
            </div>
        </body>
        </html>
        `;

        return new Response(successHTML, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            status: 200
        });

    } catch (error) {
        // Messaggio di errore in HTML nel caso qualcosa vada storto
        const errorHTML = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <title>Errore - Novus Ateliers</title>
            <style>
                body { font-family: sans-serif; background-color: #101010; color: #fff; text-align: center; padding: 50px; }
                h1 { color: #ff5555; }
                a { color: #B29054; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>Qualcosa è andato storto</h1>
            <p>Si è verificato un errore durante l'invio. Riprova più tardi.</p>
            <a href="/">Torna al Sito</a>
        </body>
        </html>
        `;
        return new Response(errorHTML, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            status: 500
        });
    }
}

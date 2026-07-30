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

        // PAGINA DI SUCCESSO PREMIUM
        const successHTML = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Richiesta Ricevuta | Novus Ateliers</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Montserrat', sans-serif; 
                    background-color: #050505; 
                    color: #ffffff; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    min-height: 100vh; 
                    text-align: center; 
                }
                .container {
                    max-width: 600px;
                    padding: 40px 20px;
                    animation: fadeIn 1s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                @keyframes fadeIn {
                    to { opacity: 1; transform: translateY(0); }
                }
                .icon {
                    font-size: 48px;
                    color: #B29054;
                    margin-bottom: 24px;
                }
                h1 { 
                    font-size: 26px;
                    font-weight: 400;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #B29054; 
                    margin-bottom: 16px; 
                }
                p { 
                    font-size: 15px; 
                    font-weight: 300;
                    line-height: 1.8; 
                    color: #a0a0a0; 
                    margin-bottom: 40px; 
                }
                strong { color: #ffffff; font-weight: 500; }
                .btn { 
                    display: inline-block; 
                    padding: 14px 32px; 
                    background-color: transparent; 
                    color: #B29054; 
                    text-decoration: none; 
                    border: 1px solid #B29054;
                    font-size: 13px;
                    font-weight: 500; 
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    transition: all 0.4s ease; 
                }
                .btn:hover { 
                    background-color: #B29054; 
                    color: #050505; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✓</div>
                <h1>Richiesta Ricevuta</h1>
                <p>Grazie per averci contattato, <strong>${nome}</strong>.<br>Abbiamo ricevuto i dettagli del tuo progetto e il nostro team ti risponderà al più presto.</p>
                <a href="/" class="btn">Ritorna alla Home</a>
            </div>
        </body>
        </html>
        `;

        return new Response(successHTML, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            status: 200
        });

    } catch (error) {
        // PAGINA DI ERRORE PREMIUM
        const errorHTML = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Errore | Novus Ateliers</title>
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Montserrat', sans-serif; background-color: #050505; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
                .container { max-width: 600px; padding: 40px 20px; animation: fadeIn 1s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                h1 { font-size: 26px; font-weight: 400; letter-spacing: 2px; text-transform: uppercase; color: #ff5555; margin-bottom: 16px; }
                p { font-size: 15px; font-weight: 300; line-height: 1.8; color: #a0a0a0; margin-bottom: 40px; }
                .btn { display: inline-block; padding: 14px 32px; background-color: transparent; color: #B29054; text-decoration: none; border: 1px solid #B29054; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.4s ease; }
                .btn:hover { background-color: #B29054; color: #050505; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Qualcosa è andato storto</h1>
                <p>Si è verificato un errore tecnico durante l'invio del messaggio. Ti preghiamo di riprovare tra qualche minuto.</p>
                <a href="/" class="btn">Ritorna alla Home</a>
            </div>
        </body>
        </html>
        `;
        return new Response(errorHTML, {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' },
            status: 500
        });
    }
}

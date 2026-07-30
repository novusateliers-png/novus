export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const datiFrontend = await request.json();
        
        const rispostaServerPosta = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.CHIAVE_SEGRETA_RESEND}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Novus Ateliers <onboarding@resend.dev>', // Modifica qui in base al dominio registrato su Resend
                to: 'novus.ateliers@gmail.com', // La mail dove riceverai i lead
                subject: `Nuovo Progetto: ${datiFrontend.nome}`,
                html: `
                    <h2>Nuova richiesta da Novus Ateliers</h2>
                    <p><strong>Nome/Brand:</strong> ${datiFrontend.nome}</p>
                    <p><strong>Email contatto:</strong> ${datiFrontend.email}</p>
                    <p><strong>Dettagli progetto:</strong><br>${datiFrontend.messaggio}</p>
                `
            })
        });

        if (rispostaServerPosta.ok) {
            return new Response(JSON.stringify({ successo: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ errore: "Errore Resend" }), { status: 500 });
        }
    } catch (errore) {
        return new Response(JSON.stringify({ errore: "Errore interno" }), { status: 500 });
    }
}

//import mailchannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    try {
        let send_request = new Request('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: 'chrisjmccreadie@protonmail.com', name: 'Test Recipient' }],
                }, ],
                from: {
                    email: 'sender@example.com',
                    name: 'Workers - MailChannels integration',
                },
                subject: 'Look! No servers',
                content: [{
                    type: 'text/plain',
                    value: 'And no email service accounts and all for free too!',
                }, ],
            }),
        })

    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }

//}


//await fetch(send_request);

/*
    let content = "dd";
    for( var i of request.headers.entries() ) {
        content += i[0] + ": " + i[1] + "\n";
    }
    let send_request = new Request("https://api.mailchannels.net/tx/v1/send", {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify({
            "personalizations": [
                { "to": [ {"email": "chrisjmccreadie@protonmail.com",
                        "name": "Test Recipient"}]}
            ],
            "from": {
                "email": "chris@clasiq.com",
                "name": "Test Sender",
            },
            "subject": "Test Subject",
            "content": [{
                "type": "text/plain",
                "value": "Test message content\n\n" + content,
            }],
        }),
    });
 
    let respContent = "";
    // only send the mail on "POST", to avoid spiders, etc.
    //if( request.method == "POST" ) {
        const resp = await fetch(send_request);
        const respText = await resp.text();
 
        respContent = resp.status + " " + resp.statusText + "\n\n" + respText;
 
    //}
 
 /*
    let htmlContent = `<html><head></head><body><pre>
        </pre><p>Click to send message: <form method="post"><input type="submit" value="Send"/></form></p>
        <pre>${respContent}</pre>
        </body></html>;`
    return new Response(htmlContent, {
        headers: { "content-type": "text/html" },
    })
    */

}
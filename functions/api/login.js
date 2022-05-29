/*
    todo 

    update the KV with their JWT secret
    trap the gets / puts etc
    figure out why we cant send a message in the invalid reponses

*/
export async function onRequest(context) {
    const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //store the secret
    let secret = env.SECRET
    //set a valid boolean
    let valid = 1;
    //get the post data
    //note we know it is application / json i am sending it up as but we could check for all the content types if
    //     we wanted to make it more generic
    //     further more is if call wranger functions it does not pass a content type it is preflight but if id do wrangle _site it is fine
    const contentType = request.headers.get('content-type')
    let credentials;
    if (contentType != null) {
        credentials = await request.json();
        //console.log(credentials)
        if ((credentials.identifier == undefined) || (credentials.password == undefined))
            valid = 0;
    } else
        valid = 0
    const KV = context.env.backpage;
    const user = await KV.get("username" + credentials.identifier);
    if (user == null)
        valid = 0;

    //check if it is valid
    if (valid == 1) {
        //make a JWT token
        const token = await jwt.sign({ password: credentials.password, username: credentials.identifier }, secret)
        // Verifing token
        const isValid = await jwt.verify(token, secret)
        if (isValid == true) {
            let responseJson = { "jwt": token, "user": { "id": 3, "username": credentials.identifier, "email": credentials.identifier } }
            responseJson = JSON.stringify(responseJson)
            return new Response(responseJson);
        } else {
            let responseJson = { "error": "invalid lgoin" }
            let response = new Response(null, {
                status: 400
            });
            response.responseText = "ddd"
            return response
        }
    } else {
        let responseJson = { "error": "invalid lgoin" }
        let response = new Response(null, {
            status: 400
        });
        response.Response = "ddd"
        response.responseText = "ddd"
        return response
    }

}
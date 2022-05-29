/*
    todo 
    
    change the error HTTP code

    check if the user has a KV entry and return it
    update the KV with their JWT secret


    useful note 
     //const { headers } = request;
  const contentType = request.headers.get('content-type')

  console.log(contentType)

  if (contentType.includes('application/json')) {
    //await request.json()
   
    let tmp = JSON.stringify(await request.json());
     console.log(tmp)
  } else if (contentType.includes('application/text')) {
        console.log(request.text())

    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    console.log(body)
    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }

  //note : We should move this to a post. 
    let loginparams = (new URL(request.url)).searchParams;
    //get the login details
    let username = loginparams.get("username")
    let password = loginparams.get("password")


*/
export async function onRequest(context) {


    const jwt = require('@tsndr/cloudflare-worker-jwt')
    //get this from an env so we can share it. 
    


    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //console.log(SECRET)
   let secret = env.SECRET
   
    let valid = 1;

    //get the post data
    //note we know it is application / json i am sending it up as but we could check for all the content types if
    //     we wanted to make it more generic
    let credentials = await request.json();
    if ((credentials.identifier == undefined) || (credentials.password == undefined))
        valid = 0;

    if (valid == 1) {
        //make a JWT token
        const token = await jwt.sign({ password: credentials.password, username: credentials.identifier }, secret)


        // Verifing token
        const isValid = await jwt.verify(token, secret)
        if (isValid == true)
            return new Response(token);
        else {
            //note : change the repsonse to a http error code
            return new Response("invalid login");
        }
    } else
        return new Response("invalid login");

}
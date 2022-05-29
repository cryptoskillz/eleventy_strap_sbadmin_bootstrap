async () => {
    const jwt = require('@tsndr/cloudflare-worker-jwt')

    // Creating a token
    const token = await jwt.sign({ name: 'John Doe', email: 'john.doe@gmail.com' }, 'secret')

    // Verifing token
    const isValid = await jwt.verify(token, 'secret')

    // Check for validity
    if (!isValid)
        return

    // Decoding token
    const payload = jwt.decode(token)
      return new Response(token);

}
//this function handles the login
document.getElementById('btn-login').addEventListener('click', function() {
    /*
    todo : 
    */
    //valid variable
    let valid = 1;
    //get the inputs
    let email = document.getElementById('inp-email');
    let password1 = document.getElementById('inp-password1');

    //reset errors
    document.getElementById('error-email').classList.remove('show')
    document.getElementById('error-password1').classList.remove('show')
    document.getElementById('valid-email-icon').classList.remove('show')

    //validate the email
    if (validateEmail(email.value)) {
        //no error, not necessary but we may extend this in the future
        valid = 1;
        //document.getElementById('valid-email-icon').classList.remove('d-none')
    } else {
        //error with the email
        valid = 0;
        document.getElementById('error-email').classList.remove('d-none')
    }

    //validate the password
    if (password1.value == "") {
        //password is blank
        valid = 0;
        let error = document.getElementById('error-password1')
        error.innerHTML = 'Password cannot be blank'
        error.classList.remove('d-none')
    }

    //send it.
    if (valid == 1) {
        //login done function
        let loginDone = (response) => {
            //get the repsonse
            let res = response.response;
            //parse it
            res = JSON.parse(res)
            //get the JWT
            let token = res.jwt
            //set the user object
            let user = { "email": res.user.email, "username": res.user.username, "loggedin": 1, "walletconnected": 0 }
            //debug
            //console.log(res)
            //console.log(token)
            //console.log(user)
            //set the local storage
            window.localStorage.token = token;
            window.localStorage.user = JSON.stringify(user);
            //direct the redirect URL
            window.location.href = "/"
        }

        //build the json
        let bodyobj = {
            identifier: email.value,
            password: password1.value,
        }
        //string it
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the login endpoint
        xhrcall(0, "auth/local/", bodyobjectjson, "json", "", loginDone)

    }
})
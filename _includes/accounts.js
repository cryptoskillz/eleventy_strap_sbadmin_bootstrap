/*

TODO 

check the sendemail works for forogot password


notes

to make forgot / reset password I have to test the send mail funciton to see how it actually works.
in strapi these permissions are disabled so you have to go to settings / roles / public  / user permissions / tick forgot password & reset pssword

*/

//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    //this function checks if an element exists
    let checkElement = (element) => {
        let checkedElement = document.getElementById(element);
        //If it isn't "undefined" and it isn't "null", then it exists.
        if (typeof(checkedElement) != 'undefined' && checkedElement != null) {
            return (true)
        } else {
            return (false)
        }
    }



    if (checkElement("btn-reset-password") == true) {
        document.getElementById('btn-reset-password').addEventListener('click', function() {
            //set the valid var
            let valid = 1;

            //get the details
            let password1 = document.getElementById('inp-password1');
            let password2 = document.getElementById('inp-password2');

            //reset errors
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-password1').classList.add('d-none')
            document.getElementById('error-password2').classList.add('d-none')

            //validate the password
            if (password1.value == "") {
                //error with the password
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'Password cannot be blank'
                error.classList.remove('d-none')
            } else {
                //check the passwords match
                if (password1.value != password2.value) {
                    //password error
                    valid = 0;
                    let error = document.getElementById('error-password2')
                    error.innerHTML = 'Passwords do not match.'
                    error.classList.remove('d-none')

                }

            }

            if (valid == 1) {
                //todo : get the private code

                let privateCode = "12345"

                //build the json
                let bodyobj = {
                    code: privateCode,
                    password: password1.value,
                    passwordConfirmation: password2.value,
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let forgotPasswordDone = () => {
                    let alert = document.getElementById('accountsAlert')
                    alert.innerHTML = "Password has been reset"
                    alert.classList.remove('d-none')
                }
                //call the create account endpoint
                xhrcall(0, "auth/reset-password", bodyobjectjson, "json", "", forgotPasswordDone)



            }


        })
    }

    if (checkElement("btn-forgot-password") == true) {
        document.getElementById('btn-forgot-password').addEventListener('click', function() {
            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-email');
            //reset errors
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-email').classList.add('d-none')
            //validate the email
            if (validateEmail(email.value)) {
                //its valid we don't really have to do anything but we may extend this so no harm done leaving it.
                valid = 1;
            } else {
                //error with the email
                valid = 0;
                //set the error
                let error = document.getElementById('error-email');
                error.innerHTML = "Invalid Email Address"
                error.classList.remove('d-none')
            }

            if (valid == 1) {
                //build the json
                let bodyobj = {
                    email: email.value,
                    url: 'http:/localhost:1337/admin/plugins/users-permissions/auth/reset-password',
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let forgotPasswordDone = () => {
                    let alert = document.getElementById('accountsAlert')
                    alert.innerHTML = "you will recieve an email"
                    alert.classList.remove('d-none')
                }
                //call the create account endpoint
                xhrcall(0, "auth/forgot-password", bodyobjectjson, "json", "", forgotPasswordDone)



            }


        });
    }


    if (checkElement("btn-create-account") == true) {
        document.getElementById('btn-create-account').addEventListener('click', function() {
            /*
            todo : 
            */


            //set the valid var
            let valid = 1;
            //get the details
            let email = document.getElementById('inp-email');
            let password1 = document.getElementById('inp-password1');
            let password2 = document.getElementById('inp-password2');

            //reset errors
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-email').classList.add('d-none')
            document.getElementById('error-password1').classList.add('d-none')
            document.getElementById('error-password2').classList.add('d-none')

            //validate the email
            if (validateEmail(email.value)) {
                //its valid we don't really have to do anything but we may extend this so no harm done leaving it.
                valid = 1;
            } else {
                //error with the email
                valid = 0;
                //set the error
                let error = document.getElementById('error-email');
                error.innerHTML = "Invalid Email Address"
                error.classList.remove('d-none')
            }

            //validate the password
            if (password1.value == "") {
                //error with the password
                valid = 0;
                let error = document.getElementById('error-password1')
                error.innerHTML = 'Password cannot be blank'
                error.classList.remove('d-none')
            } else {
                //check the passwords match
                if (password1.value != password2.value) {
                    //password error
                    valid = 0;
                    let error = document.getElementById('error-password2')
                    error.innerHTML = 'Passwords do not match.'
                    error.classList.remove('d-none')

                }

            }

            //send it.
            if (valid == 1) {
                //build the json
                let bodyobj = {
                    username: email.value,
                    email: email.value,
                    password: password1.value,
                }
                //string it 
                var bodyobjectjson = JSON.stringify(bodyobj);
                //done function
                let registerDone = () => {
                    window.location = "/login/"
                }
                //call the create account endpoint
                xhrcall(0, "auth/local/register", bodyobjectjson, "json", "", registerDone)



            }
        });
    }


    if (checkElement("btn-login") == true) {
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
            //reset errors
            document.getElementById('accountsSuccess').classList.add('d-none')
            document.getElementById('accountsAlert').classList.add('d-none')
            document.getElementById('error-email').classList.add('d-none')
            document.getElementById('error-password1').classList.add('d-none')

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
    }

});
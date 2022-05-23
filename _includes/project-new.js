//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    document.getElementById('btn-create').addEventListener('click', function() {
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let success = document.getElementById('accountsSuccess');
            success.innerHTML = "project has been created"
            success.classList.remove('d-none');
        }
        //set the valid var
        let valid = 1;
        //get the details
        let projectname = document.getElementById('inp-projectname');
        //reset errors
        let alert = document.getElementById('accountsAlert')
        alert.innerHTML = ""
        alert.classList.add('d-none')
        document.getElementById('accountsSuccess').classList.add('d-none')
        document.getElementById('accountsAlert').classList.add('d-none')
        document.getElementById('error-projectname').classList.add('d-none')
        if (projectname.value == "") {
            valid = 0;
            let error = document.getElementById('error-projectname')
            error.innerHTML = 'Project name cannot be blank'
            error.classList.remove('d-none')
        }
        if (valid == 1) {
            //call the create account endpoint
            //todo : Pass in the user object, you would think Strapi would pick this up from the token but for reason the do not. 
            let bodyobj = {
                user: 1,
                data: {
                    name: projectname.value
                }
            }
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(0, "backpage-projects/", bodyobjectjson, "json", "", xhrDone, token)
        }
    })
})
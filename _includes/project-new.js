//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    document.getElementById('btn-create').addEventListener('click', function() {
        let xhrDone = (res) => {
            //parse the response
            let projects = window.localStorage.projects 
            projects = JSON.parse(projects);
            res = JSON.parse(res);
            let data = JSON.parse(res.data);
            projects.data.push(data);
            window.localStorage.projects = JSON.stringify(projects)
            showAlert(res.message, 1)
        }
        //set the valid var
        let valid = 1;
        //get the details
        let projectname = document.getElementById('inp-projectname');
        //reset errors
        document.getElementById('error-projectname').classList.add('d-none')
        if (projectname.value == "") {
            valid = 0;
            showAlert("Project name cannot be blank", 2)
        }
        if (valid == 1) {
            //call the create account endpoint
            //todo : Pass in the user object, you would think Strapi would pick this up from the token but for reason the do not. 
            let bodyobj = {
                    name: projectname.value
            }
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(0, "api/projects/", bodyobjectjson, "json", "", xhrDone, token)
        }
    })
})
let projectid = 0;
let projectname = "";

//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let allowIt = 1;
    if (projectname == "")
    {
        let urlParam = getUrlParamater('name')
        if (urlParam != "")
        {
            projectname = urlParam
            document.getElementById('inp-projectname').value = projectname;
            document.getElementById('project-header').innerHTML = `Edit ${projectname}`;
        }
        else
        {
            allowIt = 0;
            showAlert("project name not found",2,0);    
        }
    }
    
    urlParam = getUrlParamater('projectid')
    if (urlParam != "")
    {
        projectid = urlParam;
    }
    else
    {
        allowIt = 0;
        showAlert("project id not found",2,0);    

    }
    if (allowIt == 1)
        document.getElementById('showBody').classList.remove('d-none')



    document.getElementById('btn-edit').addEventListener('click', function() {
        let xhrDone = (res) => {
            showAlert(`${projectname.value} has been updated`,1)
        }
        //set the valid var
        let valid = 1;
        //get the details
        let projectname = document.getElementById('inp-projectname');
        if (projectname.value == "") {
            valid = 0;
            showAlert("Project name cannot be blank",2);
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
            xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrDone, token)
        }
    })
})


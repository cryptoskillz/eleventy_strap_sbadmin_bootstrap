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
             let bodyobj = {
                    name: projectname.value,
                    id:projectid
            }
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)
        }
    })
})


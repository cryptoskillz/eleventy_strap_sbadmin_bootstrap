let projectid = 0;
let projectname = "";

//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let allowIt = 1;
    let project = window.localStorage.project    
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        //console.log(project)
        project = JSON.parse(project)
        document.getElementById('inp-projectname').value = project.name;
        document.getElementById('project-header').innerHTML = `Edit ${project.name}`;
        document.getElementById('showBody').classList.remove('d-none')
    }

    document.getElementById('btn-edit').addEventListener('click', function() {
        let xhrDone = (res) => {
            showAlert(`${projectname.value} has been updated`, 1)
        }
        //set the valid var
        let valid = 1;
        //get the details
        let projectname = document.getElementById('inp-projectname');
        if (projectname.value == "") {
            valid = 0;
            showAlert("Project name cannot be blank", 2);
        }
        if (valid == 1) {
            let bodyobj = {
                name: projectname.value,
                id: project.id
            }
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)
        }
    })
})
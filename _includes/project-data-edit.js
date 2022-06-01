let fields;
let originalfields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {

    let project = window.localStorage.project
    if (project == undefined)
        showAlert(`project not found click <a href="/projects/">here</a> to add one`, 2, 0);
    else {
        //get the project
        project = JSON.parse(project);
        
        let projectdata = window.localStorage.projectdata
        projectdata = JSON.parse(projectdata)
        let tmpd = Object.values(projectdata)
        let fields = Object.keys(projectdata)

        //console.log(projectdata)

        //loop through  the keys
        let inpHtml = "";
        for (var i = 0; i < fields.length; ++i) {
            //console.log(fields[i])
            if (fields[i] != "UNUSED") {

                inpHtml = inpHtml + `<div class="form-group" >
            <label>${fields[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${fields[i]}" aria-describedby="emailHelp" placeholder="Enter ${fields[i]}" value="${tmpd[i]}">
</div>`
            }
        }
        document.getElementById('formInputs').innerHTML = inpHtml
        //show the body
        document.getElementById('showBody').classList.remove('d-none');

    }

})

document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        showAlert(res.message, 1)
                console.log(res)

        console.log(res.data)
        window.localStorage.projectdata = res.data;

    }
    let data = {};

    //project = JSON.parse(project);
    let project = window.localStorage.project
    project = JSON.parse(project);
    let projectfields = project.schema.fields.split(",");
    let projectoriginalfields = project.schema.originalfields.split(",")
    for (var i = 0; i < projectfields.length; ++i) {
        let inpValue = "";
        if (projectfields[i] == "UNUSED") {
            data[projectoriginalfields[i]] = inpValue;

        } else {
            inpValue = document.getElementById("inp-" + projectfields[i]).value;
            data[projectfields[i]] = inpValue;

        }
    }
    let bodyobj = {
        data: data,
        projectid: project.id
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(0, `api/projectdata/`, bodyobjectjson, "json", "", xhrDone, token)
})
/*

when you update, refresh the form
*/
let fields;
let originalfields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let urlParam = getUrlParamater('projectid');
    if (urlParam != '') {
        projectid = urlParam;

        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            //console.log(res.data.attributes.schema)
            if (res.data.attributes.schema == null) {
                showAlert(`No schema for this project, click here to import <a href="/project/data/import/data/?projectid=${projectid}">data</a>`, 2, 0)
            } else {
                document.getElementById('showBody').classList.remove('d-none')

                fields = res.data.attributes.schema.fields.split(',')
                originalfields = res.data.attributes.schema.originalfields.split(',')

                let inpHtml = "";
                document.getElementById('originalschema').innerHTML = `Leave fields blnk to remove<br>Fields in the imported data ${res.data.attributes.schema.originalfields}`
                for (var i = 0; i < fields.length; ++i) {
                    //console.log(fields[i])
                    //let theData = res.data.attributes.data[keys[i]]
                    let tmpvalue = ""
                    let tmpmessage = `unused field ${originalfields[i]} from  the imported data`
                    if (fields[i] != "UNUSED") {
                        tmpvalue = fields[i]
                        tmpmessage = `Schema field ${i+1} (original name ${originalfields[i]})`
                    }

                    inpHtml = inpHtml + `    <div class="form-group" >
            <label>${tmpmessage}</label>
<input type="text" class="form-control form-control-user" id="inp-${originalfields[i]}" aria-describedby="emailHelp" placeholder="Enter ${originalfields[i]} " value="${tmpvalue}">
</div>`
                }
                document.getElementById('formInputs').innerHTML = inpHtml
            }

        }


        //build the json
        let bodyobj = {
            user: {
                id: 2
            }

        }
        //string it
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the create account endpoint
        xhrcall(1, `backpage-projects/${projectid}`, bodyobj, "json", "", xhrDone, token)

    } else
        showAlert('Project not found', 2);





})

document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        let success = document.getElementById('accountsSuccess');
        success.innerHTML = "project data has been updated"
        success.classList.remove('d-none');
        window.location.reload();

    }
    let inpValue = "";
    let json = {}

    for (var i = 0; i < originalfields.length; ++i) {
        tmpvalue = document.getElementById("inp-" + originalfields[i]).value;
        if (tmpvalue == "")
            tmpvalue = "UNUSED"
        if (inpValue == "")
            inpValue = inpValue + tmpvalue
        else
            inpValue = inpValue + ',' + tmpvalue
        //console.log(inpValue)
    }

    let ofields = originalfields.join(",")
    let tmp2 = { fields: inpValue, originalfields: ofields }

    //console.log(tmp2)

    let bodyobj = {
        data: {
            schema: tmp2,
        }
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrDone, token)

})
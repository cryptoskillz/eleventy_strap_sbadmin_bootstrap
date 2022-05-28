/*

Remove schema item
if schema is blank get it from the keys




*/
let fields;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let urlParam = getUrlParamater('projectid');
    if (urlParam != '') {
        document.getElementById('showBody').classList.remove('d-none')
        projectid = urlParam;

        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            fields = res.data.attributes.schema.fields.split(',')
            let inpHtml = "";
            document.getElementById('originalschema').innerHTML = `Leave fields blnk to remove<br>Fields in the imported data ${res.data.attributes.schema.fields}`
            for (var i = 0; i < fields.length; ++i) {
                //console.log(fields[i])
                //let theData = res.data.attributes.data[keys[i]]
                inpHtml = inpHtml + `    <div class="form-group" >
            <label>Schema field ${i}</label>
<input type="text" class="form-control form-control-user" id="inp-${fields[i]}" aria-describedby="emailHelp" placeholder="Enter ${fields[i]}" value="${fields[i]}">
</div>`
            }

            document.getElementById('formInputs').innerHTML = inpHtml


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

    }
    let inpValue = "";
    let json = {}
    //console.log(keys)
    for (var i = 0; i < fields.length; ++i) {
        let tmp = document.getElementById("inp-" + fields[i]).value;
        //console.log(inpValue);
        //data[keys[i]] = inpValue;
        if (inpValue == "")
            inpValue = inpValue + tmp
        else
            inpValue = inpValue + ',' + tmp
    }
    //console.log(inpValue)
    let tmp2 = { fields: inpValue }
    
    console.log(tmp2)

    let bodyobj = {
        data: {
            schema: tmp2
        }
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrDone, token)

})
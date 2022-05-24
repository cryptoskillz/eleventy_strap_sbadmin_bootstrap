//add a ready function

let keys;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //get the  template id
    let urlParam = getUrlParamater('id')

    //done function
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res)
        //console.log(res)

        //get the hets fro  the results array
        keys = Object.keys(res.data.attributes.data);
        //loop through  the keys
        let inpHtml = "";
        for (var i = 0; i < keys.length; ++i) {
            //console.log(keys[i])
            //build a the daa
            //let json = `{\"data\" : \"${keys[i]}\"}`
            let theData = res.data.attributes.data[keys[i]]
            inpHtml = inpHtml + `    <div class="form-group" >
            <label>${keys[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${keys[i]}" aria-describedby="emailHelp" placeholder="Enter ${keys[i]}" value="${theData}">
</div>`
            //console.log(inpHtml)
        }
        document.getElementById('formInputs').innerHTML = inpHtml

    }


    if (urlParam != "") {
        projectid = urlParam
        //string it
        document.getElementById("showBody").classList.remove('d-none')
        //call the create account endpoint
        xhrcall(1, `backpages/${projectid}`, "", "json", "", xhrDone, token)
    } else {
        //no project id so show an error.
        let error = document.getElementById('accountsAlert');
        error.innerHTML = "project not found"
        error.classList.remove('d-none');
    }


})

//        
document.getElementById('btn-edit').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        let success = document.getElementById('accountsSuccess');
        success.innerHTML = "project data has been updated"
        success.classList.remove('d-none');

    }
    let data = {};
    //console.log(keys)
    for (var i = 0; i < keys.length; ++i) {
        let inpValue = document.getElementById("inp-" + keys[i]).value;
        //console.log(inpValue);
        data[keys[i]] = inpValue;
    }

    console.log(data)
    let bodyobj = {
        user: 1,
        data: {
            data: data
        }
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `backpages/${projectid}/`, bodyobjectjson, "json", "", xhrDone, token)
})
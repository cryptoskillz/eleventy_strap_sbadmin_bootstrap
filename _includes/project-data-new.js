//add a ready function

let keys;
let projectid;
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

    //get the  template id
    let urlParam = getUrlParamater('projectid')

    //done function
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res)
        //console.log(res)

        //get the hets fro  the results array
        keys = Object.keys(res.data[0].attributes.data);
        //loop through  the keys
        let inpHtml = `<div class="form-group" >
        <label>Slug</label>
            <input type="email" class="form-control form-control-user" id="inp-slug" aria-describedby="emailHelp" placeholder="Enter a slug...">
            <span class="text-danger d-none" id="error-projectslug">Slug </span>  
        </div>`
        for (var i = 0; i < keys.length; ++i) {
            inpHtml = inpHtml + `    <div class="form-group" >
            <label>${keys[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${keys[i]}" aria-describedby="emailHelp" placeholder="Enter ${keys[i]}" value="">
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
        xhrcall(1, `backpages/`, "", "json", "", xhrDone, token)
    } else {
        //no project id so show an error.
        let error = document.getElementById('accountsAlert');
        error.innerHTML = "project not found"
        error.classList.remove('d-none');
    }


})

//        
document.getElementById('btn-create').addEventListener('click', function() {
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        let success = document.getElementById('accountsSuccess');
        success.innerHTML = "project data has been created"
        success.classList.remove('d-none');

    }
    let data = {};
    //console.log(keys)
    for (var i = 0; i < keys.length; ++i) {
        let inpValue = document.getElementById("inp-" + keys[i]).value;
        //console.log(inpValue);
        data[keys[i]] = inpValue;
    }
    let slug = document.getElementById("inp-slug").value;


    console.log(data)
    let bodyobj = {
        user: 1,
        data: {
            slug:slug,
            data: data
        }
    }

    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(0, `backpages/`, bodyobjectjson, "json", "", xhrDone, token)
})
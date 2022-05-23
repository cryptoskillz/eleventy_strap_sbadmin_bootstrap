//add a ready function


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
        console.log(res)

        //get the hets fro  the results array
        var keys = Object.keys(res.data.attributes.data);
        //loop through  the keys
        let inpHtml="";
        for (var i = 0; i < keys.length; ++i) {
            //console.log(keys[i])
            //build a the daa
            //let json = `{\"data\" : \"${keys[i]}\"}`
            let theData = res.data.attributes.data[keys[i]]
            inpHtml = inpHtml+`    <div class="form-group" >
            <label>${keys[i]}</label>
<input type="text" class="form-control form-control-user" id="inp-${keys[i]}" aria-describedby="emailHelp" placeholder="Enter ${keys[i]}" value="${theData}">
</div>`
            //console.log(inpHtml)
        }
        document.getElementById('formInputs').innerHTML = inpHtml
        
    }


    if (urlParam != "") {
        //string it
        document.getElementById("showBody").classList.remove('d-none')
        //call the create account endpoint
        xhrcall(1, `backpages/${urlParam}`, "", "json", "", xhrDone, token)
    } else {
        //no project id so show an error.
        let error = document.getElementById('accountsAlert');
        error.innerHTML = "project not found"
        error.classList.remove('d-none');
    }


})

//        
    document.getElementById('btn-edit').addEventListener('click', function() {
alert('update it')
})


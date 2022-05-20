let html5layout = `<DOCTYPE! html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Basic html layout example</title>
</head>
<body class="hello">
  <header>
    <h1>< header ></h1>
  </header>
  <nav>
    < nav >
    <ul>
      <li>Menu Item</li>
    </ul>
  </nav>
  <section>
    < section >
    <header>Hello, friend</header>
    <article>
     [[ELEMENTS]]
    </article>
    <footer>@ whoever</footer>
  </section>
  <aside>
  </aside>
  <footer>
  </footer>
</body>
</html>`

let projectid = 0;

var myCodeMirror;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //check for a paramater.
    let urlParam = getUrlParamater('id')
    //check if it is black
    if (urlParam != "") {
        //set the project id
        projectid = urlParam;
        //done function
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let results = []
            let keys;

            //get the keys from the first data.
            for (var i = 0; i < res.data.length; ++i) {
                keys = Object.keys(res.data[i].attributes.data)
            }

            //get the template
            let xhrDone2 = (res) => {
                //parse the response
                res = JSON.parse(res)
                //set the template
                let theCode = res.data.attributes.template;
                //check there is a template set and if not then set the default one.
                if ((theCode == null) || (theCode == "")) {
                    let elements="";
                    //get the elements from the data 
                    for (var i = 0; i < keys.length; ++i) {
                        //console.log(keys[i])
                        elements = elements+`\{\{${keys[i]}\}\}<br>`
                    }
                    //set the html5
                    theCode = html5layout
                    //put in the data elements
                    theCode = theCode.replace("[[ELEMENTS]]",elements);
                    //it's default so change to add
                    document.getElementById("btn-template").innerHTML = "Create"
                } else
                {
                    //set it to the udpate.
                    document.getElementById("btn-template").innerHTML = "Update"
                }

                //set the text area
                let textArea = document.getElementById('inp-projectemplate');
                myCodeMirror = CodeMirror.fromTextArea(textArea);
                myCodeMirror.getDoc().setValue(theCode);

            }

            //call the create account endpoint
            xhrcall(1, `backpage-projects/${projectid}`, "", "json", "", xhrDone2, token)

        }
        //build the json
        let bodyobj = {
            user: {
                id: 2
            }

        }
        //string it
        var bodyobjectjson = JSON.stringify(bodyobj);
        //get the data so we can get the keys for the elements
        xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)
    }
    else
    {
      //no project id so show an error.
      let error = document.getElementById('accountsAlert');
      error.innerHTML = "project not found"
      error.classList.remove('d-none'); 
    }
})

document.getElementById('btn-template').addEventListener('click', function() {
    let html = myCodeMirror.getValue()
    let xhrDone = (res) => {
        //parse the response
        res = JSON.parse(res);
        let success = document.getElementById('accountsSuccess');
        success.innerHTML = "project template has been updated"
        success.classList.remove('d-none');

    }

    let bodyobj = {
        user: 1,
        data: {
            template: html
        }
    }
    var bodyobjectjson = JSON.stringify(bodyobj);
    xhrcall(4, `backpage-projects/${projectid}/`, bodyobjectjson, "json", "", xhrDone, token)

});
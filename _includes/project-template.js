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

    let urlParam = getUrlParamater('id')
    if (urlParam != "") {
        projectid = urlParam;
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let results = []
            let keys;

            for (var i = 0; i < res.data.length; ++i) {
                keys = Object.keys(res.data[i].attributes.data)
            }

            //get the template
            let xhrDone2 = (res) => {
                //parse the response
                res = JSON.parse(res)
                let theCode = res.data.attributes.template;
                if ((theCode == null) || (theCode == "")) {
                    let elements="";
                    for (var i = 0; i < keys.length; ++i) {
                        //console.log(keys[i])
                        elements = elements+`\{\{${keys[i]}\}\}<br>`
                    }
                    theCode = html5layout
                    theCode = theCode.replace("[[ELEMENTS]]",elements);
                    //it's default so change to add
                    document.getElementById("btn-template").innerHTML = "Create"
                } else
                    document.getElementById("btn-template").innerHTML = "Update"


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
        //call the create account endpoint
        xhrcall(1, "backpages/?user=1", bodyobj, "json", "", xhrDone, token)
    }
    else
    {
      let error = document.getElementById('accountsAlert');
      error.innerHTML = "project not found"
      error.classList.remove('d-none'); 
    }





    /*
    if (urlParam != "") {
        projectid = urlParam;
        let xhrDone = (res) => {
            //parse the response
            res = JSON.parse(res)
            let theCode = res.data.attributes.template;
            if (theCode == null) {
                theCode = html5layout
                //it's default so change to add
                document.getElementById("btn-template").innerHTML = "Create"
            } else
                document.getElementById("btn-template").innerHTML = "Update"


            let textArea = document.getElementById('inp-projectemplate');
            myCodeMirror = CodeMirror.fromTextArea(textArea);
            myCodeMirror.getDoc().setValue(theCode);

        }

        //call the create account endpoint
        xhrcall(1, `backpage-projects/${projectid}`, "", "json", "", xhrDone, token)
    }
    */
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
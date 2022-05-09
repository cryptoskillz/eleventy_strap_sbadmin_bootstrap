//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {


let xhrDone = (res) => {
     res = JSON.parse(res)
     console.log(res)
     //document.getElementById("backpageprojects").innerHTML =  res.meta.pagination.total


}
//call the create account endpoint
xhrcall(1, "backpage-projects/", "", "json", "", xhrDone,token)

});
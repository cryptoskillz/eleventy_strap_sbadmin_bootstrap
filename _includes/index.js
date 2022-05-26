//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none')

let xhrDone = (res) => {
     res = JSON.parse(res)
     //console.log(res.meta.pagination.total)
     document.getElementById("backpageprojects").innerHTML =  res.meta.pagination.total
}
//call the create account endpoint
xhrcall(1, "backpage-projects/", "", "json", "", xhrDone,token)

});
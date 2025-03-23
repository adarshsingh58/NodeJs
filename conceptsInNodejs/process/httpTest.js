const http = require('http')

const httpReq=http.get('http://www.google.com',(res)=>{
    res.on("data",(chunk)=>{
        console.log(chunk)
    });
    res.on("end", ()=>{
        console.log("End of Call")
    })
});


const axios=require('axios')

axios.get("https://wwsw.google.com")
.then((res)=>{
    console.log(res);

})
.catch((err)=>{
    console.error(err);
})
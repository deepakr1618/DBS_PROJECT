const publicKey = 'BHkacef0FIZC37NgBtSAUzfh4MmjGKblF6VakMT8pHD3sxMAT9Q8En1yiKqHxl1KAeZx6clDtulMqhnj4p6fO_0';


if('serviceWorker' in navigator){
    send()
    .catch(e=>console.log(e))
}


async function send(){
    const register = await navigator.serviceWorker.register('/worker.js',{
        scope : '/'
    })
    console.log('Service worker registered!')

    console.log('Registering push...')
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly : true,
        applicationServerKey : urlBase64ToUint8Array(publicKey)
    })
    console.log('Push registered')

    console.log('Sending ');
    await fetch('/subscribe', {
        method:'post',
        body:JSON.stringify(subscription),
        header:{
            'content-type':'application/json'
        }
    })
    console.log('Push Sent')
}


function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }









function fancy_status(val){
    if(val === 0){
        return `<span style="padding:0px 5px;background:#ee5253;color:white;border-radius:5px">No</span>`
    }
    else if(val === 1){
        return `<span style="padding:0px 5px;background:#10ac84;color:white;border-radius:5px">Yes</span>`
    }
}


function fetch_accepted(tid){
    $.ajax({
        url: '/api/fetchAcceptedClasses',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tid}),
        success: (response)=>{
            const results = response.results;
            if(response.message != "Success"){
                $(".accepted_list").append("<h3>No classes</h3>");
            }
            for(let i in results){
                let data = results[i]
                $('.accepted_list').append(`
                <div class="each_sess">
                <div class="sess_header">
                    <span class="for">From:<b>`+data.askingTeacher+`</b></span>
                    <span class="class">Class : <b>`+data.semester+" "+data.section+`</b></span>
                </div>
                <div class="sess_header">
                    <span class="time">Timing :<b>`+data.time+`</b></span>
                    <span class="sub">Day : <b>`+data.day+`</b></span>
                </div>
                
                <div class="message">
                    <span class="sub">Subject : <b>`+data.subject+`</b></span>
                   <span class="mess"> Message:<b>`+data.message+`</b></span>
                </div>
              </div>`)
            }
        },
        error : (xhr,status,error)=>{
            alert("Something went wrong please refresh the page")
            console.log(error)
        }
    });
}

function fetch_requested(tid){
    $.ajax({
        url: '/api/fetchRequestedClasses',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tid}),
        success: (response)=>{
            const results = response.results;
            if(response.message != "Success"){
                $(".requested_list").append("<h3>No classes</h3>");
            }
            for(let i in results){
                let data = results[i]
                $('.requested_list').append(`
                <div class="each_sess">
                <div class="sess_header">
                    <span class="for">To :<b>`+data.takingTeacher+`</b></span>
                    <span class="class">Class : <b>`+data.semester+" "+data.section+`</b></span>
                </div>
                <div class="sess_header">
                    <span class="time">Timing :<b>`+data.time+`</b></span>
                    <span class="sub">Accepted: <b>`+fancy_status(data.accepted)+`</b></span>
                    <span class="sub">Day: <b>`+data.day+`</b></span>
                </div>
                
                <div class="message">
                    <span class="sub">Subject : <b>`+data.subject+`</b></span>
                   <span class="mess"> Message:<b>`+data.message+`</b></span>
                </div>
              </div>`)
            }
        },
        error : (xhr,status,error)=>{
            alert("Something went wrong please refresh the page")
            console.log(error)
        }
    });
}


$(document).ready(function(){
    console.log("Loaded")
    const tid = $("input[name='tid']").val()
    console.log(tid);
    fetch_accepted(tid);
    fetch_requested(tid);
})
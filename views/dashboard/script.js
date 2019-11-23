function fetch_accepted(tid){
    $.ajax({
        url: '/api/fetchAcceptedClasses',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tid}),
        success: (response)=>{
            const results = response.results;
            for(let i in results){
                let data = results[i]
                console.log(data)
                $('.accepted_list').append(`
                <div class="each_sess">
                <div class="sess_header">
                    <span class="for">For:<b>`+data.askingTeacher+`</b></span>
                    <span class="class">Class : <b>`+data.semester+" "+data.section+`</b></span>
                    <span class="time">Timing :<b>`+data.time+`</b></span>
                    <span class="sub">Subject: <b>`+data.subject+`</b></span>
                </div>
                <div class="message">Message:<b>`+data.message+`</b></div>
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
})
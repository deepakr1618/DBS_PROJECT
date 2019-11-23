
const timetable = document.querySelector('.Timetable');
const overlay = document.querySelector(".overlay");
const t1 = new TimelineMax();

let sourceID="",sessid="",sess_no="",day="" , destTID = "" , message = "" , destName = "";
$(".Timetable").css({"opacity":"0"});

function send_req(sourceTID ,destTID,  sessid , sess_no, day , message){
    console.log(({sourceTID,destTID,sessid , sess_no ,day , message}))
    $.ajax({
        url: '/api/sendRequestToDest',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({sourceTID,destTID,sessid , sess_no ,day , message}),
        success: (response)=>{
            if(response.message === "Success"){
                console.log("DONE")
            }else{
                console.log("FAILED")
            }
        },
        error : (xhr,status,error)=>{
            alert("Something went wrong please refresh the page")
            console.log(error)
        }
    });
}

$(".send").on("click" , (e)=>{
    if(confirm("Send request to "+destName+"?")){
        message = $(".message_t").val()
        send_req(sourceID , destTID , sessid , sess_no , day , message)
    }else{
        alert("No requests were sent!")
    }
})

$(".cancel").on("click",(e)=>{
    t1.fromTo(overlay , 0.5 ,{left:"0",opacity:"1"} , { left:"100vw",opacity:"0" })

})

$(document).ready(function(){
    console.log("Loaded the script!");
    setTimeout((e)=>{
        t1.fromTo(timetable , 1 ,{opacity:"0px"} , { opacity:"1"})
    },2000)
    $(".selectStaff").on("click",(e)=>{
        sourceID = $("input[name=sourceID]").val();
        sessid = $("input[name=sessid]").val();
        sess_no = $("input[name=sess_no]").val();
        day = $("input[name=day]").val();
        destTID = e.target.getAttribute("data-destTID");
        destName = e.target.getAttribute("data-destName");
        $(".dest_name_cont").text(destName)
        t1.fromTo(overlay , 1 ,{ left:"-100vw",opacity:"0"}, {left:"0",opacity:"1"})
    })
});
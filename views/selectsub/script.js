
const timetable = document.querySelector('.Timetable');
const overlay = document.querySelector(".overlay");
const sentOverlay = document.querySelector(".sent_over");
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
                close_overlay();
                t1.fromTo(sentOverlay , 0.5 ,{left:"-100vw",opacity:"0"} , { left:"0",opacity:"1" })
                $(".sent_over").append(`<h2 style="margin:5px;">SENT</h2><br><img src = 'https://www.fbbc.info/wp-content/uploads/2017/08/mail-sent.gif'></img>`)
                setTimeout(close_sent_overlay , 3000);
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

function close_overlay(){
    t1.fromTo(overlay , 0.5 ,{left:"0",opacity:"1"} , { left:"100vw",opacity:"0" })
}

function close_sent_overlay(){
    t1.fromTo(sentOverlay , 0.5 ,{left:"0",opacity:"1"} , { left:"100vw",opacity:"0" })
}


$(".cancel").on("click",(e)=>{
    close_overlay();
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

const timetable = document.querySelector('.Timetable');
const t1 = new TimelineMax();
$(".Timetable").css({"height":"0px"});

function load_free_staff(tid , sessid , sess_no, day){
    $.ajax({
        url: '/api/freefetch',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({tid,sessid,sess_no,day}),
        success: (response)=>{
            console.log(response)
        },
        error : (xhr,status,error)=>{
            alert("Something went wrong please refresh the page")
            console.log(error)
        }
    });
}

$(document).ready(function(){
    console.log("Loaded the script!");
    setTimeout((e)=>{
        t1.fromTo(timetable , 1 ,{height:"0px" , opacity:"0"} , {height:"540px" , opacity:"1"})
    },2000)
    let sourceID="",sessid="",sess_no="",day="";
    $(".selectStaff").on("click",(e)=>{
        sourceID = $("input[name=sourceID]").val();
        sessid = $("input[name=sessid]").val();
        sess_no = $("input[name=sess_no]").val();
        day = $("input[name=day]").val();
        console.log(sourceID , sessid , sess_no , day)
    })
});
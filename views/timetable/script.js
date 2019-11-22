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
            for(let i in response){
                const data = response[i]
                $(".Timetable").append(`<div class="teacherName">
                    
                
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
    console.log("Loaded the script!");
    setTimeout((e)=>{
        t1.fromTo(timetable , 1 ,{height:"0px" , opacity:"0"} , {height:"540px" , opacity:"1"})
    },2000)
    // $(".Allocation").click((e)=>{
    //     let tid = e.target.getAttribute("data-teacher");
    //     let sessid = e.target.getAttribute("data-sessionid");
    //     let day = e.target.getAttribute("data-day");
    //     let sess_no = e.target.getAttribute("data-session_no");
    //     $(".Timetable").empty();
    //     load_free_staff(tid , sessid , sess_no , day);
    // })



});
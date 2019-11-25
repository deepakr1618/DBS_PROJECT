console.log('Service worker loaded')


self.addEventListener('push',(e)=>{
    const data =e.data.json();
    console.log('Recieved'+data);
    self.registration.showNotification(data.title , {
        body:data.body,
        icon:data.icon
    })
})
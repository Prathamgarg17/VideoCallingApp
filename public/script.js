const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/' ,
    port: '3001'
})

const myvideo = document.createElement('video')
myvideo.muted = true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream => {
   addVideoStream(myvideo, stream)

   myPeer.on('call' , call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream' , userVideoStream =>{
    //     const video = document.createElement('video')
        addVideoStream(video, userVideoStream)
     })
   })


   socket.on('user-connected' , userID => {
     connectToNewUser(userID, stream)
   })
})

myPeer.on('open' , id =>{
    socket.emit('join-room' , Room_Id , id) 
})


function connectToNewUser(userID , stream){
    const call = myPeer.call(userID, stream)
    const video = document.createElement('video')
    call.on('stream' , userVideoStream =>{
        addVideoStream(video , userVideoStream)

    })
    call.on('close' , ()=>{
        video.remove()
    })

}

function  addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () =>{
        video.play()
    })
    videoGrid.append(video)
}
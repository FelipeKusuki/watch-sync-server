const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')

const app = new Koa()
const server = http.createServer(app.callback())
const io = socket(server)
let userList = []
let videoList = ['https://www.youtube.com/watch?v=ERFXravD0AU']

const SERVER_HOST = 'localhost'
const SERVER_PORT = '8080'

io.on('connection', socket => {
    console.log('CONSEGUIU CONECTAR')

    socket.on('getUserList', () => {
        io.emit('receiveUserList', userList)
    })

    socket.on('getVideoList', () => {
        io.emit('receiveAddVideo', videoList)
    })

    socket.on('addUser', (userName) => {
        userList.push(userName)
        io.emit('receiveUserList', userList)
    })

    socket.on('removeUser', (userName) => {
        console.log("RFEMOSALÇKJFSÇA")
        if(userList.length > 1) {
            userList.forEach((element, index) => {
                if(element === userName) {
                    console.log("ACHOU ELEMENTO")
                    userList.splice(index, 1)
                }
            })
            io.emit('receiveUserList', userList)
        }
    })

    socket.on('addVideo', (newUrl) => {
        let videoAlradyOnTheList = videoList.find(element => element === newUrl)
        if(videoAlradyOnTheList === undefined) {
            videoList.push(newUrl)
            io.emit('receiveAddVideo', videoList)
        }
    })

    socket.on('endVideo', () => {
        if(videoList.length > 1) {
            // Remove o primeiro elemento da lista
            videoList.splice(0,1);
        }
        io.emit('receiveEndVideo', videoList)
    })

    socket.on('playOrPause', (data) => {
        console.log('playOrPause', data)
        // Talvez so precise de apenas um desses emit
        // socket.broadcast.emit('messageBroadcast', data)
        io.emit('receivePlayOrPause', data)
    })

    socket.on('syncVideo', (time) => {
        io.emit('receiveSyncVideo', time)
    })

    
})

server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log('ENTROU NO SERVER')
})

const Koa = require('koa')
const http = require('http')
const socket = require('socket.io')
const cors = require('@koa/cors');

const app = new Koa()
app.use(cors({origin:'*'}));
const server = http.createServer(app.callback())
const io = socket(server)
let userList = []
let videoList = ['https://www.youtube.com/watch?v=ERFXravD0AU']

// const SERVER_HOST = process.env.HOST
const SERVER_PORT = process.env.PORT || 8080

io.on('connection', socket => {
    console.log('CONSEGUIU CONECTAR')

    socket.on('getUserList', () => {
        io.emit('receiveUserList', userList)
    })

    socket.on('getVideoList', () => {
        io.emit('receiveAddVideo', videoList)
    })

    socket.on('addUser', (userName) => {
        if(!userName) return;
        userList.push({ id: socket.id, name: userName })
        io.emit('receiveUserList', userList)
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
        // Talvez so precise de apenas um desses emit
        // socket.broadcast.emit('messageBroadcast', data)
        io.emit('receivePlayOrPause', data)
    })

    socket.on('syncVideo', (time) => {
        io.emit('receiveSyncVideo', time)
    })

    socket.on('disconnect', () => {
        userList = userList.filter(u => u.id !== socket.id);
        io.emit('disconnect', userList);
    })

    
})

server.listen(SERVER_PORT, () => {
    console.log('ENTROU NO SERVER')
})

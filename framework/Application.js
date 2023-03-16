const http = require('http');// мы будем создавать и инкапсулировать наш сервер Тут
const EventEmitter = require('events');// и его тоже сюда инкапс будем

module.exports = class Application{
    constructor(){
        this.emitter = new EventEmitter();
        this.server = this._createServer()//САМ сервер  _ говорит о том что метод приватный и использовать его гдето снаружи НЕСТОИТ
        this.middlewares = []
    }

    use(middleware){// чтобы мидлвейер ы добавлять из parsejson
        this.middlewares.push(middleware);
    }

    listen(port, callback){
        this.server.listen(port, callback)
    }
// Так как у одного приложения может быть несколько роутеров по хорошему сделать эТО метож который эти роутеры будет добавлять
addRouter(router){
    Object.keys(router.endpoints).forEach(path => {// КЛЮЧ ЭТО МАРШРУТ проитерируемся по всем эндпоинтам получить пути методыб  ,  для каждого эндпоинта подписаться на соответствующее событие
        const endpoint = router.endpoints[path];// выципляем ссоответств эндпоинт для удобства
        // тееперь если мы получим ключи у эндпоинта это будут уже методы и затем мы можем плучить хэндлеры и подписаться на события!
        Object.keys(endpoint).forEach((method) => {
             this.emitter.on(this._getRouteMask(path, method), (req, res) => {// второе лисенер колбэк кот на это событие будет вызываться
                const handler = endpoint[method];
              
                handler(req, res)// req und res это стримы
             })

        })
    })
}
    _createServer(){
        return http.createServer((req, res) =>{
            let body = "";

            req.on('data', (chunk) => {
                body+= chunk;

            })

            // после того как прочитали всё тело запроса отраб событие энд
            req.on('end', ()=>{
                if(body){// если не пустое тело запроса
                    req.body = JSON.parse(body);// из обыч строки
                }
                this.middlewares.forEach(middleware => middleware(req, res))
               
                const emitted = this.emitter.emit(this._getRouteMask(req.pathname, req.method), req, res)// генерир событ эмитим его ПО МАСКЕ Н
                if(!emitted){//адо обрабоать тоже когда запрос по несущ адресУУУ
                    res.end()// закрываем стрим просто чтобы не крутилась загрузка вечно
                }
            })
             // res.writeHead(200, {// добав заколовок контент тайп для джейсоен
             //     'Content-Type': 'application/json'// в кач знач браузер будет понимать что сервер отправил строку в формате JSON
         
             // })
             // if (req.url === '/users'){// эндпоин users
             //     return res.end(JSON.stringify([
             //         {id: 1, name: 'Ulbi tv'}// массив с объектом
         
             //     ]))// стрим по умолчанию работает с буфером или со строкой надо js объекты с помощью стрингифай преобраз к строке
             // }
             // if (req.url === '/posts'){
             //     return res.end('POSTS')
             // }
            // res.end('req.url')// чтобы пользователь мог получить ответ от сервера нужно закрыть стрим и передать туда данные именно их получить пользователь ответом на свой запрос
         
         })

    }

    _getRouteMask(path, method ){
        return`[${path}]:[${method}]`
    }
}
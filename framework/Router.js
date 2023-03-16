module.exports = class Router{
    constructor(){
        this.endpoints = {}
    }
    /* структура объекта endpoints
    endpoints={
        '/users':{
            'GET': handler1,
            'POST': handler2,
            'DELETE': handler3
        }
    }
     */
    request(method ='GET', path, handler ){
        if(!this.endpoints[path]) {// в первую очередь убедиться что такого эендпоинта сейчас нет
              this.endpoints[path] = {} // пустой объект
        }
        const endpoint = this.endpoints[path];// для удобства вынесем в отдел перем

        // надо убедиться что по  такому адресу такого метода не существует!
        // иначе у нас будет конфликт и надо будет пробросить ошибку 

        if(endpoint[method]){
            throw new Error(`[${method}] по адресу ${path} уже существует`)

        }
        endpoint[method] = handler// handler - это фция колбэк что должен отрабатывать на этот эндпоинт 
       
            /*Событие нужно создавать по особому названию чтобы потом мы могли это событие сгенерировать и вызвать нухный хэндлер
        маска такая
        [path]:[method]
        zB [/users]:[get] */

    }

    get(path, handler){// методы оболочки для вызова функции риквест
        this.request('GET', path, handler);
    }
    post(path, handler){// методы оболочки для вызова функции риквест
        this.request('POST', path, handler);
    }
    put(path, handler){// методы оболочки для вызова функции риквест
        this.request('PUT', path, handler);
    }
    delete(path, handler){// методы оболочки для вызова функции риквест
        this.request('DELETE', path, handler);
    }
}

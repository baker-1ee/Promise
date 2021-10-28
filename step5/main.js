// Promise 정적 메소드 all, race 추가

// ES6의 Promise 동작방식 확인
(function(){
    console.log("=== promise ===")

    Promise.all([
        new Promise(resolve=>setTimeout(()=>resolve(1), 3000)), // 1
        new Promise(resolve=>setTimeout(()=>resolve(2), 2000)), // 2
        new Promise(resolve=>setTimeout(()=>resolve(3), 1000)), // 3
    ])
    .then(console.log)
    .catch(console.log);

    Promise.race([
        new Promise(resolve => setTimeout(() => resolve(1), 3000)), // 1
        new Promise(resolve => setTimeout(() => resolve(2), 2000)), // 2
        new Promise(resolve => setTimeout(() => resolve(3), 1000))  // 3
      ]).then(console.log) // 3
        .catch(console.log);

})();

// My Promise 구현
class MyPromise {

    #state = 'Pending';
    #thenCallbackList = [];
    #catchCallback = undefined;

    constructor(f){
        f(this.resolve, this.reject)
    }

    static resolve(param){
        return new MyPromise(resolve => resolve(param));
    }

    static reject(param){
        return new MyPromise((resolve, reject) => reject(param));
    }

    static all(promiseArray){
        let result = [];
        let count = promiseArray.length;

        return new MyPromise((resolve, reject) =>{
            promiseArray.forEach((v, i)=>{
                v.then(p=> {
                    result[i] = p;
                    --count || resolve(result);
                }).catch(reject);
            });
        });
    }

    static race(promiseArray){
        let result = [];
        let count = promiseArray.length;

        return new MyPromise((resolve, reject) =>{
            promiseArray.forEach((v, i)=>{
                v.then(resolve).catch(reject);
            });
        });
    }

    resolve = (response) => {
        this.#state = 'Fulfilled';
        setTimeout((response)=>{
            for(let i=0; i<this.#thenCallbackList.length; i++){
                this.#thenCallbackList[i](response);
            }
        }, 0, response);
        
    }

    reject = (error) => {
        if(this.#state === 'Pending'){
            this.#state = 'Rejected';
            setTimeout((error)=>{
                this.#catchCallback(error);
            }, 0, error);
        }
    }

    then(callback){
        this.#thenCallbackList.push(callback);
        return this;
    }

    catch(callback){
        this.#catchCallback = callback;
    }

    get state(){
        return this.#state;
    }

}

// My Promise Test
setTimeout(()=>{
    console.log("");
    console.log("=== my promise ===")

    MyPromise.all([
        new MyPromise(resolve=>setTimeout(()=>resolve(1), 3000)), // 1
        new MyPromise(resolve=>setTimeout(()=>resolve(2), 2000)), // 2
        new MyPromise(resolve=>setTimeout(()=>resolve(3), 1000)), // 3
    ])
    .then(console.log)
    .catch(console.log);

    MyPromise.race([
        new MyPromise(resolve => setTimeout(() => resolve(1), 3000)), // 1
        new MyPromise(resolve => setTimeout(() => resolve(2), 2000)), // 2
        new MyPromise(resolve => setTimeout(() => resolve(3), 1000))  // 3
      ]).then(console.log) // 3
        .catch(console.log);

}, 4000);

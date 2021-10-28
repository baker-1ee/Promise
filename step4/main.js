// Promise 정적 메소드 resolve, reject 추가

// ES6의 Promise 동작방식 확인
(function(){
    console.log("=== promise ===")

    Promise.resolve([1,2,3]).then(console.log);
    Promise.reject(new Error('Error!')).catch(console.log);

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

    MyPromise.resolve([1,2,3]).then(console.log);
    MyPromise.reject(new Error('Error!')).catch(console.log);

}, 2000);

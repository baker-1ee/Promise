// Promise basic 구현

// ES6의 Promise 동작방식 확인
(function(){
    console.log("=== promise ===")

    function getData() {
        console.log(1);
        // new Promise() 추가
        return new Promise(function(resolve, reject){
            console.log(2);
            // 서버에서 받아온 응답이 있으면 resolve() 호출하고 없으면 reject() 호출
            setTimeout(function(response) {
                console.log(4);
                if(response){
                    resolve(response);
                }
                reject(new Error("Request is faild"));
                console.log(5);
            }, 1000, {id:'zeemoong@abc.com'});
        });
    }

    getData().then(function(tableData){
        console.log(6);
        console.log(tableData);
    });
    console.log(3);

})();

// My Promise 구현
class MyPromise {

    #state = 'Pending';
    #thenCallback = undefined;

    constructor(f){
        f(this.resolve, this.reject)
    }

    resolve = (response) => {
        this.#state = 'Fulfilled';
        setTimeout((response)=>{
            this.#thenCallback(response);
        }, 0, response);
        
    }

    reject = (error) => {
        if(this.#state === 'Pending'){
            this.#state = 'Rejected';
            console.log("error");
        }
    }

    then(callback){
        this.#thenCallback = callback;
    }

}

// My Promise Test
setTimeout(()=>{
    console.log("=== my promise ===")

    function getData() {
        console.log(1);
        // new Promise() 추가
        return new MyPromise(function(resolve, reject){
            console.log(2);
            // 서버에서 받아온 응답이 있으면 resolve() 호출하고 없으면 reject() 호출
            setTimeout(function(response) {
                console.log(4);
                if(response){
                    resolve(response);
                }
                reject(new Error("Request is faild"));
                console.log(5);
            }, 1000, {id:'zeemoong@abc.com'});
        });
    }

    getData().then(function(tableData){
        console.log(6);
        console.log(tableData);
    });
    console.log(3);

}, 2000);

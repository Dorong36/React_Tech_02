const loggerMiddleware = store => next => action => {
    console.group(action && action.type); // 액션 타입으로 log를 그룹화함
    console.log('이전상태', store.getState());
    console.log('액션', action);
    next(action); // 다음 미들웨어 혹은 리듀서에게 전달
    console.log('다음상태', store.getState()); // 업데이트된 상태
    console.groupEnd(); // 그룹 끝
}


/* 미들웨어 기본구조
- 화살표함수 ver
const loggerMiddleware = store => next => action => {

}

- 이걸 function으로 풀어쓴다면
const loggerMiddleware = function(store){
    return function(next) {
        return function(action){
            
        }
    }
}
*/

export default loggerMiddleware;
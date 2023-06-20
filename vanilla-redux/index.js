const { createStore } = require("redux");

// DOM 노드를 가리키는 값 미리 선언
const divToggle = document.querySelector('.toggle');
const counter = document.querySelector('h1');
const btnIncrease = document.querySelector('#increase');
const btnDecrease = document.querySelector('#decrease');

// action이름 정의
const TOGGLE_SWITCH = 'TOGGLE_SWITCH';
const INCREASE = 'INCREASE';
const DECREASE = 'DECREASE';

/* action 생성 함수 작성
- 액션 객체는 type값을 반드시 갖고 있어야 함
- 추후 상태를 업데이트할 때 참고하고 싶은 값을 자유롭게 넣을 수 있음
*/
const toggleSwitch = () => ({ type : TOGGLE_SWITCH });
const increase = num => ({type : INCREASE, num});
const decrease = () => ({type : DECREASE})

/* 초기값 설정
- 초깃값의 형태는 자유 (ex. 숫자, 문자열, 객체, ...)
*/
const initialState = {
    toggle : false,
    counter : 0,
}

/* reducer 함수 정의
- 리듀서는 변화를 일으키는 함수
- 파라미터로는 state와 action 값을 받아옴
*/
function reducer(state = initialState, action) {
//                     => state가 undefined 일 때는 initialState 기본값으로 사용
    switch(action.type) {
        case TOGGLE_SWITCH :
            return {
                ...state, // 불변성 유지
                toggle : !state.toggle
            }
        case INCREASE :
            return {
                ...state,
                counter : state.counter + action.num
            }
        case DECREASE :
            return {
                ...state,
                counter : state.counter -1
            }
        default : 
            return state;
    }
}

/* store 만들기
- createStore import 해서 사용
- 함수의 파라미터에는 리듀서 함수를 넣어줘야함
*/
const store = createStore(reducer)

/* render 함수 만들기
- 상태가 업데이트될 때마다 호출
- 리액트의 render 함수와 다르게 이미 html을 사용하여 만들어진 UI 속성을 상태에 따라 변경해줌
*/
const render = () => {
    const state = store.getState(); // 현재 상태 불러오기
    // 토글 처리
    if(state.toggle) {
        divToggle.classList.add('active');
    }else {
        divToggle.classList.remove('active')
    }
    // 카운터 처리
    counter.innerText = state.counter
};

render();

/* subscribe (구독하기)
- 스토어의 상태가 바뀔 대마다 render 함수 호출되도록 해주기
- store의 내장함수 subscribe 사용
- 파라미터로 함수 형태의 값을 전달
- 전달된 함수는 추후 액션이 발생하여 상태가 업데이트될 때마다 호출
* 현대 바닐라스크립트에서는 subscribe 함수를 직접 사용 하지만, 리액트 환경에서는 react-redux 라이브러리가 대신 작업해줌
*/
store.subscribe(render);

/* dispatch
- 액션을 발생시키는 역할
- store 내장함수 dispatch
- 파라미터는 액션 객체를 넣어줌
*/
divToggle.onclick = () => {
    store.dispatch(toggleSwitch());
};
btnIncrease.onclick = () => {
    store.dispatch(increase(1));
};
btnDecrease.onclick = () => {
    store.dispatch(decrease());
};

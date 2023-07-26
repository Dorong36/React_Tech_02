### 🔹 react-redux 라이브러리 설치
> yarn add redux react-redux

<br>

### 🔹 프레젠테이셔널 컴포넌트 / 컨테이너 컴포넌트 분리
- 리액트 프로젝트에서 리덕스를 사용할 때 주로 사용하는 패턴(필수는 X)
- 프레젠테이셔널 컴포넌트는,
    => 주로 상태 관리가 이루어지지 않고,
    => 그저 props를 받아와서 화면에 UI를 보여주기만 하는 컴포넌트
- 컨테이너 컴포넌트는,
    => 리덕스와 연동되어 있는 컴포넌트로,
    => 리덕스로부터 상태를 받아오기도 하고 리덕스 스토어에 액션을 디스패치하기도 함

<br>

### 🔹 일반적 리덕스 코드 작성법
- 리덕스 사용에는 액션 타입, 액션 생성 함수, 리듀서 코드를 작성해야함
- 가각 다른 파일에 작성하거나 기능별로 묶어 파일 하나에 작성하는 방법도 있음
- 가장 일반적인 구조는,
  => actions, constants, reducers라는 세 개의 디렉터리를 만들고, 기능별로 파일을 하나씩 만드는 방식
  => 코드를 종류에 따라 다른 파일에 정리할 수 있어 편리
  => but 새로운 액션 만들 때마다 세 종류 파일 모두 수정해야하는 번거러움 존재
- 앞선 구조의 단점으로 인해 대체로 많이 사용하는 게,
  => 액션 타입, 액션 생성함수, 리듀서 함수를 기능별로 파일 하나에 몰아서 작성하는 'Ducks'패턴 (이걸로 연습!!)

<br>

## ✅ 리덕스 코드 작성하기 - counter / todos
- src/modules 디렉터리 생성
### 🔸 1. 액션 타입 정의하기
```
// modules/counter.js
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

// modules/todos.js
const CHANGE_INPUT = 'todo/CHANGE_INPUT'; // input 값 변경
const INSERT = 'todo/INSERT'; // 새로운 todo를 등록함
const TOGGLE = 'todo/TOGGLE'; // todo를 체크 / 체크해제
const REMOVE = 'todo/REMOVE'; // todo 제거
```
- 액션 타입은 대문자로 정의
- 문자열 내용은 '모듈이름/액션이름' 형태로 작성
- 문자열 안에 모듈 이름을 넣어 이름이 충돌되는 것 방지
<br>

### 🔸 2. 액션 생성 함수 만들기
```
// modules/counter.js
...
export const increase = () => ({type : INCREASE})
export const decrease = () => ({type : DECREASE})

// modules/todos.js
...
export const changeInput = input => ({
    type : CHANGE_INPUT,
    input
});

let id = 3;
export const insert = text => ({
    type : INSERT,
    todo : {
        id : id++,
        text,
        done : false,
    }
});

export const toggle = id => ({
    type : TOGGLE,
    id
});

export const remove = id => ({
    type : REMOVE,
    id
})
```
- 비교적 단순한 counter.js와 달리 todos.js에서는 액션 생성 함수에 파라미터 필요
- 전달받은 파라미터는 액션 객체 안에 추가 필드로 들어감
<br>

### 🔸 3. 초기 상태 및 리듀서 함수 만들기
```
// modules/counter.js
...
const initialState = {
    number : 0,
}

function counter(state = initialState, action){
    switch (action.type) {
        case INCREASE :
            return {
                number : state.number + 1
            };
        case DECREASE : 
            return {
                number : state.number -1
            }
        default :
            return state;
    }
}
export default counter;

// modules/todos.js
...
const initialState = {
    input : '',
    todos : [
        {
            id : 1,
            text : 'test content01',
            done : true,
        },
        {
            id : 2,
            text : 'test content02',
            done : false,
        }
    ]
}

function todos(state = initialState, action) {
    switch (action.type) {
        case CHANGE_INPUT :
            return {
                ...state,
                input : action.input,
            }
        case INSERT : 
            return {
                ...state,
                todos : state.todos.concat(action.todo)
            }
        case TOGGLE :
            return {
                ...state,
                todos : todos.map(todo => (
                    todo.id === action.id ? {...todo, done : !todo.done} : todo
                ))
            }
        case REMOVE :
            return {
                ...state,
                todos : state.todos.filter(todo => todo.id !== action.id)
            }
        default :
            return state
    }
}
export default todos;
```
- todos.js에서는 객체에 한 개 이상의 값이 들어가므로 spread 연사자 활용해 불변성 유지
<br>

### 🔸 루트 리듀서 만들기
- createStore 함수를 사용해 스토어를 만들 때는 리듀서를 하나만 사용
- 기존에 만들었던 리듀서들을 하나로 합쳐주는 combineReducers 유틸 함수 사용 (리덕스 내장)
```
// modules/index.js
import {combineReducers} from 'redux';
import counter from './counter';
import todos from './todos';

const rootReducer = combineReducers({
    counter, 
    todos,
})

export default rootReducer;
```
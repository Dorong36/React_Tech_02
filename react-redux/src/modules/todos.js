import { createAction, handleActions } from  'redux-actions'
import {produce} from 'immer';

// action type 정의
const CHANGE_INPUT = 'todo/CHANGE_INPUT'; // input 값 변경
const INSERT = 'todo/INSERT'; // 새로운 todo를 등록함
const TOGGLE = 'todo/TOGGLE'; // todo를 체크 / 체크해제
const REMOVE = 'todo/REMOVE'; // todo 제거


// action 생성함수
/*
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
*/

// action 생성함수 redux-actions 버전
export const changeInput = createAction(CHANGE_INPUT, input => input);

let id = 3;
export const insert = createAction(INSERT, text => ({
        id : id++,
        text,
        done : false,
    })
);

export const toggle = createAction(TOGGLE, id => id)
export const remove = createAction(REMOVE, id => id)


// initialState
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

// reducer 함수
/*
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
                todos : state.todos.map(todo => (
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
*/

// 리듀서 함수 redux-actions 버전 + immer
const todos = handleActions(
    {
        [CHANGE_INPUT] : (state, {payload : input}) => ({...state, input}),
        [INSERT] : (state, {payload : todo}) => ({
            ...state,
            todos : state.todos.concat(todo),
        }),
        // toggle은 immer 적용이 가독성 더 높음. 그 외에는 유지
        [TOGGLE] : (state, {payload : id}) => 
            produce(state, draft => {
                const todo = draft.todos.find(todo => todo.id === id);
                todo.done = !todo.done;
            }),
        [REMOVE] : (state, {payload : id}) => ({
            ...state,
            todos : state.todos.filter(todo => todo.id !== id)
        }),
    },
    initialState,
)

export default todos;

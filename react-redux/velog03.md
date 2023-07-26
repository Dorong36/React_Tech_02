## ✅ redux-actions
- 액션 생성함수를 더 짧은 코드로 작성 가능
- 리듀서 작성시에도 switch/case 문이 아닌 handleActions라는 함수를 사용해 각 액션마다 업데이트 함수 설정하는 형식으로 작성
- 설치
    > yarn add redux-actions

### 🔸 modules/counter.js에 적용한다면
```
import {createACtion, handleActions} from 'redux-actions';
...
// 액션생성 함수
export const increase = createActions(INCREASE);
export const decrease = createActions(DECREASE);

// 리듀서함수 대체
const counter = handleActions(
    {
        [INCREASE] : (state, action) => ({ number : state.number + 1 }),
        [DECREASE] : (state, action) => ({ number : state.number - 1 }),
    },
    initialState,
);
...
```

### 🔸 modules/todos.js에 적용한다면
```
...
// 액션생성 함수
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

// 리듀서함수 대체
const todos = handleActions(
    {
        [CHANGE_INPUT] : (state, action) => ({...state, action.payload}),
        [INSERT] : (state, action) => ({
            ...state,
            todos : state.todos.concat(action.payload),
        }),
        [TOGGLE] : (state, action) => ({
            ...state,
            todos : state.todos.map(todo => 
            todo.id === action.payload ? {...todos,, done : !todo.done} : todo,
            ),
        }),
        [REMOVE] : (state, action) => ({
            ...state,
            todos : state.todos.filter(todo => todo.id !== action.payload)
        }),
    },
    initialState,
)
...
```
- 위에서 볼 수 있듯 createActions로 만든 액션 생성함수들은 파라미터로 받아온 값을 공통적으로 action.payload라는 이름으로 넣어줌
- 이는 객체 비구조화 할당 문법으로 action 값의 payload 이름을 새로 설정해서 가독성을 높일 수 있음
```
...
const todos = handleActions({
    [CHANGE_INPUT] : (state, {payload : input}) => ({...state, input}),
    ...
})
```

<br>
<br>

## ✅ immer
- 리듀서의 상태 업데이트할 때에도 불변성을 지켜줘야함
- 기존에는 spread operator(...)를 사용해줬지만 상태가 복잡해질 수록 불변성 지키기 까다로워짐
- 이는 immer를 사용하면 훨씬 편리하게 상태 관리
- 하지만 모두 꼭 적용할 필요는 없음
- 오히려 코드가 길어지는 경우도 있으므로 상황에 맞게 사용할 것!!
```
// 먼저 immer 설치해주고
// > yarn add immer
// module/todos.js
import {produce} from 'immer';
...
const todos = handleActions({
    ...
    // TOGGLE 이외에는 기존 JS 코드가 더 간편
    [TOGGLE] : (state, {payload : id}) => 
        produce(state, draft => {
            const todo = draft.todos.find(todo => todo.id === id);
            todo.done = !todo.done;
        }),
    ...
})
```

<br>
<br>

## ✅ Hooks 사용해 컨테이너 컴포넌트 만들기
- 리덕스 스토어와 연동된 컨테이너 컴포넌트를 만들 때 connect 함수를 사용하는 대신,
- react-redux에서 제공하는 Hooks를 사용할 수 있음

### 🔸 useSelector
- useSelector 사용시 connect 함수 사용하지 않고 리덕스 상태 조회 가능
> 사용법
> const result = useSelector(상태 선택 함수)
> 상태선택 함수는 mapStateToProps와 형태가 똑같음
<br>

### 🔸 useDispatch
- useDispatch는 컴포넌트 내부에서 스토어의 내장 함수 dispatch를 사용할 수 있게 해줌
> 사용법
> const dispatch = useDispatch();
> dispatch({type : 'ACION_TYPE'});
- 이를 컴포넌트에 props로 'onSomething = {()=>dispatch(액션생성함수)}'와 같은 형태로 넘겨주게 되면,
- 리렌더링 될 때마다 onSomeThing 함수가 재생성됨
- 만약 성능 최적화를 원한다면 useCallback으로 액션 디스패치 함수를 감싸 주는 것이 좋음
<br>

### 🔹 container에 적용해보기
- container/CounterContainer.js
```
import {useSelector, useDispatch} from 'react-redux';
...
const CounterContainer = () => {
    // useSelector로 상태 조회
    const number = useSelector(state => state.counter.number);
    // useDispatch로 액션 디스패치
    const dispatch = useDispatch(); 
    // 바로 디스패치(액션생성함수) 넣으면 재렌더링 시마다 함수 재생성
    // useCallback으로 성능 최적화 권장
    const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
    const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);

    return (
        <Counter
            number={number} 
            onIncrease={onIncrease} 
            onDecrease={onDecrease}
        />
    )
};
export default CounterContainer;
// container/TodosContainer.js
```
<br>

- container/TodosContainer.js
```
...
const TodosContainer = () => {
    const {input, todos} = useSelector(({todos}) => ({
        input : todos.input,
        todos : todos.todos,
    }));

    const dispatch = useDispatch();
    const onChangeInput = useCallback(input => dispatch(changeInput(input)), [dispatch]);
    const onInsert = useCallback(text => dispatch(insert(text)), [dispatch]);
    const onToggle = useCallback(id => dispatch(toggle(id)), [dispatch]);
    const onRemove = useCallback(id => dispatch(remove(id)), [dispatch]);

    return (
        <Todos
            input = {input}
            todos = {todos}
            onChangeInput = {onChangeInput}
            onInsert = {onInsert}
            onToggle = {onToggle}
            onRemove = {onRemove}
        />
    )
}
export default TodosContainer;
```
<br>

### 🔸 useActions
- useActions는 원래 react-redux에 내장되어 릴리즈될 계획이었으나 제외된 Hook
- 공식문서에서 복사해 사용 가능!!
    => https://react-redux.js.org/api/hooks#recipe-useactions
- 코드를 src/lib 디렉터리를 만들어 넣어주고 import해 사용
- useActions는 액션 생성 함수를 액션 디스패치 함수로 변환해줌
- 액션 생성 함수를 사용해 액션 객체를 만들고, 이를 스토어에 디스패치하는 작업을 해주는 함수를 자동으로 만들어주는 것
- useActions에는 두 가지 파라미터가 필요
    1. action 생성 함수로 이루어진 배열
    2. deps 배열로, 배열 안에 원소가 바뀌면 액션을 디스패리하는 함수를 새로 만듦
```
// TodoContainer에 적용해보기
import { useActions } from "../lib/useActions";

const TodoContainer = () => {
    ...
    const [onChangeInput, onInsert, onToggle, onRemove] = useActions(
        [changeInput, insert, toggle, remove],
        []
    );
    return (
        <Todos
            input = {input}
            todos = {todos}
            onChangeInput = {onChangeInput}
            onInsert = {onInsert}
            onToggle = {onToggle}
            onRemove = {onRemove}
        />
    )
};
export default TodosContainer;
```
<br>

### 🔸 useStore
- useStore Hooks를 사용하면 컴포넌트 내부에서 리덕스 스토어 객체를 직접 사용 가능
- 꼬오옥 스토어에 직접 접근해야만 하는 상황에 사용
- 이를 사용할 상황이 흔치 않음
- 사용법
    ```
    const store = useStore();
    store.dispatch({type : 'SAMPLE_ACTION'});
    store.getState();
    ```
<br>

### 🔸 connect 함수와 주요 차이점
- 컨테이너 컴포넌트를 만들 때 connect와 useSelect, useDispatch 모두 사용 가능
- 하지만 차이점이 하나 있으니,
- 해당 컴포넌트의 부모 컴포넌트가 리렌더링될 때,
    1. connect를 사용해 컨테이너 컴포넌트를 만들 경우, 
       - 해당 컨테이너 컴포넌트의 props가 바뀌지 않았다면 리렌더링이 자동으로 방지되어 성능이 최적화됨
    2. useSelector를 사용해 리덕스 상태 조회할 경우,
       - 이 최적화 작업이 자동으로 이루어지지 않으므로, 
       - 최적화를 위해서는 REact.memo를 컨테이너 컴포넌트에 사용해 주어야 함
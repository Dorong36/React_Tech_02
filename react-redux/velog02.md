## ✅ 리액트 애플리케이션에 리덕스 적용하기
- 스토어를 만들고 리액트 애플리케이션에 리덕스를 적용하는 작업은 src/index.js에서 이루어짐
### 🔸 스토어 만들기
```
// src/index.js
...
import { createStore } from 'redux';
import rootReducer from './modules';

const store = createStore(rootReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```
- createStore deprecated(더 이상 사용하지 않음)이슈
    => We recommend using the configureStore method of the @reduxjs/toolkit package, which replaces createStore.
- 일단 공부 과정이라 사용하는걸로!!
<br>

### 🔸 Provider 컴포넌트를 사용하여 프로젝트에 리덕스 적용하기
- 리액트 컴포넌트에서 스토어 사용할 수 있도록,
- react-redux에서 제공하는 Provider로 App 컴포넌트 감싸주기
- Provider에는 store를 props로 전달해 주어야 함
```
...
import { Provider } from 'react-redux';
...
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```
<br>

### 🔹 Redux DevTools
- 이는 리덕스 개발자 도구로, 크롬 확장 프로그램으로 설치해 사용
- 먼저 크롬 웹 스토어에서 Redux DevTools 검색해 설치
- vsCode에서는 패키지를 설치해 적용하면 편함!
    > yarn add redux-devtools-extension 
```
// src/index.js
...
import { devToolsEnhancer } from 'redux-devtools-extension'

const store = createStore(rootReducer, devToolsEnhancer());
...
```
다시 앱 실행하면 개발자도구 Redux 탭에서 확인 가능

<br>
<br>

## ✅ 컨테이너 컴포넌트 만들기
- 리덕스 스토와 연동된 컴포넌트를 컨테이너 컴포넌트라 부름
- src/containers 디렉터리 생성
### 🔸 CounterContainer 만들고 적용하기
- 컴포넌트를 리덕스와 연동하려면 react-redux에서 제공하는 connect 함수 사용
> connect( mapStateToProps, mapDispatchToProps )
> - mapStateToProps는 리덕스 스토어 안 상태를,
> - mapDispatchToProps는 액션 생성 함수를
> - 컴포넌트의 props로 넘겨주기 위해 설정하고 사용하는 함수
- 이렇게 connect 함수 호출하면 또 다른 함수를 반환
- 반환된 함수에 컴포넌트를 파라미터로 넣어주면 리덕스와 연동된 컴포넌트가 만들어짐
> const makeContainer = connect( mapStateToProps, mapDispatchToProps )
> makeContainer(타깃 컴포넌트)
```
// containers/CounterContainer.js
import Counter from '../components/Counter';
import {connect} from 'react-redux'
// 액션 생성함수 import
import { increase, decrease } from '../modules/counter';

const CounterContainer = ({number, increase, decrease}) => {
    return (
        <Counter number={number} onIncrease={increase} onDecrease={decrease}/>
    )
};

const mapStateToProps = state => ({
    number : state.counter.number,
})

const mapDispatchToProps = dispatch => ({
    increase : () => {
        dispatch(incresae());
    },
    decrease : () => {
        dispatch(decresae());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);


// src/App.js
...
return (
    <div>
        <CounterContainer/>
        <hr>
        <Todos/>
    </div>
)
```
- mapStateToProps와 mapDispatchToProps에서 반환하는 객체 내부 값들은 컴포넌트의 props로 전달
- mapStateToProps는 state를 파라미터로 받아오고, 현재 스토어가 지니고 있는 상태 가리킴
- mapDispatchToProps는 store의 내장함수 dispatch를 파라미터로 받아옴

### 🔸 connect 좀 더 간단히 써보기
- mapDispatchToProps에서 액션을 디스패치하기 위해 각 액션 생성 함수 호출하고 dispatch로 감싸는 작업이 다소 복잡
- 리덕스 제공 bindActionCreators로 간략화
```
// container/CounterContainer.js
import {bindActionCreators} from 'redux';
...
export default connect(
    state => ({
        number : state.counter.number,
    }),
    dispatch => bindActionCreators(
        {
            increase,
            decrease
        },
        dispatch,
    )
)(CounterContainer)
```
- 여기서 하나 더 나가면, mapDispatchToProps에 해당하는 파라미터를 액션 생성 함수로 이루어진 객체 형태로 넣어줄 수 있음
- 이렇게 하면 connect가 함수 내부적으로 bindActionCreators 작업을 대신 해줌
```
// container/CounterContainer.js
...
export default connect(
    state => ({
        number : state.counter.number,
    }),
    {
        increase,
        decrease
    },
)(CounterContainer)
```

### 🔸 TodosContainer
```
import { connect } from "react-redux";
import { changeInput, insert, toggle, remove } from "../modules/todos";
import Todos from "../components/Todos";

const TodosContainer = ({input, todos, changeInput, insert, toggle, remove}) => {
    return (
        <Todos
            input = {input}
            todos = {todos}
            onChangeInput = {changeInput}
            onInsert = {insert}
            onToggle = {toggle}
            onRemove = {remove}
        />
    )
}

export default connect(
    // 비구조화 할당을 통해 todos를 분리하여
    // state.todos.input 대신 todos.input을 사용
    ({todos}) => ({
        input : todos.input,
        todos : todos.todos,
    }),
    {
        changeInput,
        insert,
        toggle,
        remove,
    },
)(TodosContainer)

// src/App.js에서 <TodosContainer/>로 변경해주고
// components/Todos.js 컴포넌트도 받아온 props를 사용하도록 구현
```
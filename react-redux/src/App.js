import './App.css';
// import Counter from './components/Counter';
// import Todos from './components/Todos';
import CounterContainer from './containers/CounterContainer';
import TodosContainer from './containers/TodosContainer';

function App() {
  return (
    <div>
      <CounterContainer/>
      <hr></hr>
      <TodosContainer/>
    </div>
  );
}

export default App;

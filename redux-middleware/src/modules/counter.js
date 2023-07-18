import {createAction, handleActions} from 'redux-actions';

const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';

// 액션 생성 함수
export const increase = createAction(INCREASE);
export const decrease = createAction(DECREASE);

// 액션객체가 아닌 함수를 반환하는 redux-thunk 액션 생성 함수
export const increaseAsync = () => dispatch => {
    setTimeout(()=>{
        dispatch(increase());
    }, 1000);
};
export const decreaseAsync = () => dispatch => {
    setTimeout(()=>{
        dispatch(decrease());
    }, 1000);
};

const initialState = 0; // 초기 상태 꼭 객체가 아니어도 됨! 이렇게 숫자도 작동

const counter = handleActions(
    {
        [INCREASE] : state => state + 1,
        [DECREASE] : state => state - 1,
    },
    initialState
);

export default counter;
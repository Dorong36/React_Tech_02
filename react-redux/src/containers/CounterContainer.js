import React, { useCallback } from 'react';
import Counter from '../components/Counter';
import {connect} from 'react-redux'
import { increase, decrease } from '../modules/counter';
import { bindActionCreators } from 'redux';
import { useSelector, useDispatch } from 'react-redux';

const CounterContainer = () => {
    // connect 대신 useSelector와 useDispatch를 활용해 간단히 상태 조회하고 액션 디스패치 하기
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


/*
// 아래의 기존 코드 좀 더 깔끔하게 정리
export default connect(
    state => ({
        number : state.counter.number,
    }),
    // dispatch => (
    //     // 🌟action을 dispatch하면 reducer함수를 호출🌟
    //     // reducer는 store의 state를 가져와 새 state로 반환

    //     // 🔹 각 액션 생성 함수를 호출해 dispatch로 감싸는 작업 간단히 할 수 있음
    //     // 🔸 간략화 방법1. bindActionCreators
    //     bindActionCreators(
    //         {
    //             increase,
    //             decrease,
    //         },
    //         dispatch,
    //     )
    // )
   {
        // 🔸 간략화 방법2. mapDispatchToProps 객체로 넣어주기
        // - 함수 형태가 아닌 액션 생성 함수로 이루어진 객체 형태로 넣어주기
        // - 이렇게 하면 connect 함수가 내부적으로 bindActionCreators 작업 대신 해줌
       increase,
       decrease
   }
)(CounterContainer)
*/

/* 기존 코드
const mapStateToProps = state => ({
    number : state.counter.number,
})

const mapDispatchToProps = dispatch => ({
    increase : () => {
        dispatch(increase());
    },
    decrease : () => {
        dispatch(decrease());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer);
 */





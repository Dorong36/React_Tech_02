import React from 'react';

const Counter = ({onIncrease, onDecrease, number}) => {
    return (
        <div>
            <h1>{number}</h1>
            <button onClick={onDecrease}>-</button>
            <button onClick={onIncrease}>+</button>
        </div>
    );
};

export default Counter;
import React, {createContext, useContext} from 'react';
import currencyFormat from 'mout/number/currencyFormat';

const Context = createContext(null);
const {Consumer, Provider} = Context;

const CurrencyProvider = ({
    children,
    currency
}) => {

    return (
        <Provider value={{
            currency
        }}>
            {children}
        </Provider>
    )

}

export {
    Context as CurrencyContext,
    CurrencyProvider,
    Consumer as CurrencyConsumer
}
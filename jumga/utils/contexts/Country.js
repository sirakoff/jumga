import React, {createContext, useContext} from 'react';

const Context = createContext(null);
const {Consumer, Provider} = Context;

const CountryProvider = ({
    children,
    country
}) => {

    return (
        <Provider value={{
            country
        }}>
            {children}
        </Provider>
    )

}

export {
    Context as CountryContext,
    CountryProvider,
    Consumer as CountryConsumer
}
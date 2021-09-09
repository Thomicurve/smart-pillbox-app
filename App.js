import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TokenContext from './context/TokenContext';
import useAuthUser from './hooks/useAuthUser';

import NavbarWelcome from './components/NavbarWelcome'
import NavbarLogged from './components/NavbarlLogged'
import Register from './screens/Register';
import Welcome from './screens/Welcome';
import Login from './screens/Login'
import Home from './screens/Home'

const Stack = createNativeStackNavigator();

const noLoggedNavOptions = {
  headerTitle: props => <NavbarWelcome {...props} />, headerBackVisible: false,
  headerStyle: { backgroundColor: '#152028', shadowOpacity: 0, borderBottomWidth: 0, paddingHorizontal: 0 }
}

const loggedNavOptions = {
  headerTitle: props => <NavbarLogged {...props} />, headerBackVisible: false, headerStyle: { backgroundColor: '#064372', borderBottomWidth: 0 }
}

export default function App() {


  const { getToken, setToken, token } = useAuthUser();

  useEffect(() => {
    async function handleToken() {
      const result = await getToken();
      setToken(result);
    }

    handleToken()
  }, [])

  return (
    <TokenContext.Provider value={token}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={token.length ? 'Home' : 'Welcome'}>
          {
            !token.length &&
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={noLoggedNavOptions}
              />
          }

          <Stack.Screen
            name="Home"
            component={Home}
            options={noLoggedNavOptions}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={noLoggedNavOptions}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={noLoggedNavOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TokenContext.Provider>
  );
}



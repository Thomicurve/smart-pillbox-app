import React, { useState } from 'react';
import {Text} from 'react-native'
// import { NavigationContainer } from '@react-navigation/native'
// import { createStackNavigator } from '@react-navigation/stack'

// import TokenContext from './context/TokenContext';

import NavbarWelcome from './components/NavbarWelcome'
import NavbarLogged from './components/NavbarlLogged'
import Register from './screens/Register';
import Welcome from './screens/Welcome'

// const Stack = createStackNavigator();

const noLoggedNavOptions = {
  headerTitle: props => <NavbarWelcome {...props} />, headerStyle: { backgroundColor: '#152028', borderBottomWidth: 0 }
}

const loggedNavOptions = {
  headerTitle: props => <NavbarLogged {...props} />, headerStyle: { backgroundColor: '#064372', borderBottomWidth: 0 }
}

export default function App() {

  // const [token, setToken] = useState('')

  return (
    // <TokenContext.Provider value={token}>
    // <Register/>
    <Text>Hola mundo!</Text>
      // <NavigationContainer>
      //   <Stack.Navigator>
      //     <Stack.Screen
      //       name="Welcome"
      //       component={Welcome}
      //       options={noLoggedNavOptions}
      //     />
      //     <Stack.Screen
      //       name="Register"
      //       component={Register}
      //       options={noLoggedNavOptions}
      //     />
      //   </Stack.Navigator>
      // </NavigationContainer>
    // </TokenContext.Provider>
  );
}



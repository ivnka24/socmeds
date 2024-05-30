import { NavigationContainer } from "@react-navigation/native";
import LoginRegisterNav from "./src/navigations/LoginRegisterNav";
import AuthProvider from "./src/AuthStore/AuthContext";
import { ApolloProvider } from "@apollo/client";
import client from "./src/config/instance";
export default function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <AuthProvider>
          <NavigationContainer>
            <LoginRegisterNav />
          </NavigationContainer>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}

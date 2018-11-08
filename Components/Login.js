import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";
import firebase from "firebase";
import LoginForm from "./LoginForm";
import { Button } from "native-base";
// import firebase from '../Firebase.js'

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      user: {}
    };
    this.login = this.login.bind(this);
  }

  login() {
    this.props.navigation.navigate("Home");
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
        keyboardVerticalOffset={345}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/parkpark.jpg")}
          />
        </View>
        <View>
          <Text style={styles.title}>STABLE</Text>
        </View>
        <View style={styles.formContainer}>
          <LoginForm
            login={this.login}
            authenticate={this.props.authenticate}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
            style={styles.forgotpassword}
          >
            <Text style={styles.buttontext}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3c3c3c",
    paddingTop: 48
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    height: 200,
    width: 200,
    borderRadius: 65
  },
  title: {
    color: "#fff",
    marginTop: 10,
    paddingTop: 30,
    paddingLeft: 160,
    letterSpacing: 1,
    fontSize: 25,
    fontFamily: "sans-serif-thin"
  },
  formContainer: {
    marginBottom: 65
  },
  forgotpassword: {
    marginLeft: 150,
    paddingBottom: 30
  },
  buttontext: {
    fontFamily: "sans-serif-thin"
  }
});

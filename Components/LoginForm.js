import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  returnKeyType,
  KeyboardAvoidingView
} from "react-native";
import firebase from "../Firebase";

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validate = () => {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(
        () => {
          if (firebase.auth().currentUser) {
            firebase
              .database()
              .ref("users")
              .on(
                "value",
                data => {
                  for (let keys in data.val()) {
                    if (
                      firebase.auth().currentUser.email ===
                      data.val()[keys].email
                    ) {
                      userObject = data.val()[keys];
                      this.props.authenticate(userObject);
                    }
                  }
                },
                () => {}
              );

            this.props.login();
          }
          //If login successful
        },
        error => {
          //If login failed
          alert(error.message);
        }
      );
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Text style={{ color: "red", textAlign: "center" }}>
          {this.state.Error}
        </Text>
        <TextInput
          blurOnSubmit={false}
          style={styles.input}
          placeholder="  Email"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
          keyboardType="email-address"
          autoCapitalize="none"
          blurOnSubmit={false}
          autoCorrect={false}
          underlineColorAndroid="transparent"
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          blurOnSubmit={true}
          style={styles.input}
          placeholder="  Password"
          placeholderTextColor="rgba(255,255,255,0.7)"
          returnKeyType="go"
          returnKeyLabel="Login"
          secureTextEntry
          underlineColorAndroid="transparent"
          ref={input => (this.passwordInput = input)}
          onChangeText={password => this.setState({ password })}
        />
        <TouchableOpacity
          onPress={this.validate}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: "#8a8a8a",
    marginTop: 10,
    borderRadius: 45,
    paddingLeft: 10,
    paddingVertical: 10,
    fontFamily: "sans-serif-thin"
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 45,
    backgroundColor: "#2f2f2f",
    paddingVertical: 15
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "sans-serif-thin"
  }
});

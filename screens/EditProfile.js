import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";
import { Container } from "native-base";
import ScreenHeader from "../Components/ScreenHeader";
import { Button } from "react-native-elements";

import firebase from "../Firebase";

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      license_plate: "",
      car_size: "",
      stripe_id: ""
    };
  }

  updateUser(newUser) {
    let user = firebase.auth().currentUser;

    firebase
      .database()
      .ref("users/" + user.uid)
      .set({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        license_plate: newUser.license_plate,
        car_size: newUser.car_size,
        stripe_id: this.state.stripe_id
      })
      .then(() => {
        console.log("profile updated successfully");
        if (newUser.email !== user.email) {
          user
            .updateEmail(newUser.email)
            .then(() => {
              console.log("email updated successfully");
            })
            .catch(() => {
              console.log("update email failed");
            });
        }
        this.props.navigation.navigate("Dashboard");
      })
      .catch(() => {
        console.log("error updating profile");
      });
  }

  componentDidMount() {
    this._isMounted = true;
    const user_id = firebase.auth().currentUser.uid;
    let user = firebase.database().ref(`users/${user_id}`);

    // populate form with currents users data
    user.once("value").then(data => {
      this.setState({
        first_name: data.val().first_name,
        last_name: data.val().last_name,
        email: data.val().email,
        phone_number: data.val().phone_number,
        license_plate: data.val().license_plate,
        car_size: data.val().car_size,
        stripe_id: data.val().stripe_id
      });
    });
  }

  render() {
    // form for updating user profile
    return (
      <Container style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScreenHeader navigation={this.props.navigation} />
          <View style={styles.body}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Edit Profile</Text>
            </View>
            <View style={styles.content}>
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.last_name.focus();
                }}
                blurOnSubmit={false}
                style={styles.inputField}
                onChangeText={text => this.setState({ first_name: text })}
                value={this.state.first_name}
              />
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.email.focus();
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.last_name = input;
                }}
                style={styles.inputField}
                onChangeText={text => this.setState({ last_name: text })}
                value={this.state.last_name}
              />
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.phone_number.focus();
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.email = input;
                }}
                style={styles.inputField}
                onChangeText={text => this.setState({ email: text })}
                value={this.state.email}
              />
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.license_plate.focus();
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.phone_number = input;
                }}
                style={styles.inputField}
                onChangeText={text => this.setState({ phone_number: text })}
                value={this.state.phone_number}
              />
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.car_size.focus();
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.license_plate = input;
                }}
                style={styles.inputField}
                onChangeText={text => this.setState({ license_plate: text })}
                value={this.state.license_plate}
              />
              <TextInput
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.address.focus();
                }}
                blurOnSubmit={false}
                ref={input => {
                  this.car_size = input;
                }}
                style={styles.inputField}
                onChangeText={text => this.setState({ car_size: text })}
                value={this.state.car_size}
              />
            </View>
            <Button
              style={styles.button}
              color="#2f2f2f"
              onPress={() => this.updateUser(this.state)}
              title="Save Changes"
              accessibilityLabel="Change User Profile"
            />
          </View>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#3c3c3c",
    height: 800,
    alignItems: "center"
  },
  inputField: {
    height: 40,
    width: 250,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
    backgroundColor: "#8a8a8a",
    padding: 5
  },
  button: {
    width: 300,
    borderRadius: 45
  },
  headerContent: {
    padding: 30,
    // fontSize: 10,
    alignItems: "center"
  },
  title: {
    color: "white"
  }
});

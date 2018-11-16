// React and react native components
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  Keyboard
} from "react-native";
import { Button } from 'react-native-elements';
import { Container } from "native-base";

// Header
import ScreenHeader from "../Components/ScreenHeader";

// Visual CC input package
import { CreditCardInput } from "react-native-credit-card-input";

// Stripe API
import { createCust } from "../Api.js";
import { STRIPE_PKEY } from "react-native-dotenv";
import Stripe from "react-native-stripe-api";
const client = new Stripe(STRIPE_PKEY);

// Firebase
import firebase from "../Firebase.js";

let formData = null;

export default class PaymentInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      submitButtonDisabled: true,
      keyboardUp: false
    };
    this.formOnChange = this.formOnChange.bind(this);
    this.submitPaymentInfo = this.submitPaymentInfo.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
  }

  _isMounted = false;
  userEmail = null;

  // When CC becomes valid, allows user to submit to Stripe
  formOnChange(form) {
    if (this._isMounted) {
      if (form.valid === true) {
        formData = form;
        console.log("Form valid, ready to submit");
        this.setState({
          submitButtonDisabled: false
        });
      }
      if (form.valid === false && this.state.submitButtonDisabled === false) {
        this.setState({
          submitButtonDisabled: true
        });
      }
    }
  }

  // Submits user and CC to Stripe
  submitPaymentInfo() {
    const currentUser = firebase.auth().currentUser;
    // Create a Stripe token with new card info & create a customer
    const token = client
      .createToken({
        number: formData.values.number,
        exp_month: formData.values.expiry.slice(0, 2),
        exp_year: formData.values.expiry.slice(3, 5),
        cvc: formData.values.cvc
      })
      .then(response => {
        console.log(response);
        return createCust(response.id, currentUser.email);
      })
      .then(data => {
        console.log("CUSTOMER SUCCESSFULLY CREATED", data.id);
        // Add customer id to user in database
        firebase
          .database()
          .ref(`users/${currentUser.uid}/stripe_id`)
          .set(data.id);
        // Alert user of success, then redirect back to dashboard
        if (this.state.keyboardUp) {
          Keyboard.dismiss();
        }
        alert("Credit card successfully added");
        this.props.navigation.navigate("Dashboard");
      })
      .catch(e => {
        console.log("ERROR", e);
        alert(e);
      });
  }

  // Keyboards functionality
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
    this._isMounted = true;
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this._isMounted = false;
  }

  _keyboardDidShow() {
    this.setState({
      keyboardUp: true
    });
  }

  _keyboardDidHide() {
    this.setState({
      keyboardUp: false
    });
  }

  // Renders form to add CC to user account
  render() {
    return (
      <Container style={styles.container}>
        <ScreenHeader navigation={this.props.navigation} />
        <View style={styles.paymentContainer}>
          <CreditCardInput onChange={this.formOnChange} allowScroll={true} inputStyle={styles.label} labelStyle={styles.label} />
          <Button
            buttonStyle={styles.button}
            color='#FAFAFA'
            title={
              this.state.submitButtonDisabled
                ? "Enter A Valid Credit Card"
                : "Add Credit Card"
            }
            disabled={this.state.submitButtonDisabled}
            onPress={this.submitPaymentInfo}
          />
        </View>
      </Container>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3c3c3c"
  },
  paymentContainer: {
    paddingTop: 20
  },
  label: {
    color: '#FAFAFA',
    fontFamily: 'sans-serif-thin',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#546E7A'
  }
});

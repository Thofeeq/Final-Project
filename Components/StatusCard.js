// React and react native components
import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import { Button } from 'react-native-elements';
import Map from "../screens/Map.js";

// Firebase
import firebase from "../Firebase.js";

// Payment API
import { doPayment } from "../Api.js";

class StatusCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkoutPressed: false,
      currentTime: null,
    }
  }

  calculateTotal(order) {
    firebase.database().ref(`/orders/${order}`).once('value', (data) => {
      const start = data.val().start;
      const end = data.val().end;
      const diff = (end - start) / 60000;
      const pricePerMin = this.props.info.price / 60;
      let total = Math.round((diff * pricePerMin) * 100); // Times 100 to be in cents
      if (total < 50) {
        total = 50; // Minimum 50 cent charge
      }
      firebase.database().ref(`/orders/${this.props.id}/totalPayed`).set(total);
      this.checkout(order, total)
    });
  }

  checkout(orderId, total) {
    let currentUser = firebase.auth().currentUser;
    let userStripeId = null;
    firebase.database().ref(`/users/${currentUser.uid}`).once('value', (data) => {
      userStripeId = data.val().stripe_id;
    });
    doPayment(total, userStripeId)
    .then((data) => {
      // console.log(data)
      this.props.checkout();
    });
  }

  updateOrderData(id) {
    this.setState({checkoutPressed: true});
    firebase
      .database()
      .ref("/orders/" + id)
      .update({
        end: Date.now()
      }).then(() => {
        this.calculateTotal(id);
      });
  }

  resetButton() {
    this.setState({checkoutPressed: false});
  }

  render() {
    return (
      <View style={styles.popup}>
        <Text style={styles.popupPrice}>Current Parking Session</Text>
        {this.props.info.info.map((desc, index) => {
          return (
            <Text key={index} style={styles.info}>
              {desc}
            </Text>
          );
        })}
        {!this.state.checkoutPressed ?
        <Button
          title="CHECKOUT"
          buttonStyle={styles.checkoutButton}
          onPress={() => {
            console.log("CHECKOUT PRESSED");
            // this.checkout();
            this.updateOrderData(this.props.id);
          }}
        />
        :
        <ActivityIndicator size="large" color="#FAFAFA" />
        }
      </View>
    );
  }
}

export default StatusCard;

// Styles
const styles = StyleSheet.create({
  popup: {
    display: "flex",
    alignItems: "center",
    padding: 20
  },
  popupPrice: {
    fontFamily: 'sans-serif-thin',
    color: '#FAFAFA',
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center'
  },
  info: {
    fontFamily: 'sans-serif-thin',
    marginBottom: 10,
    color: '#FAFAFA',
    textAlign: 'center'
  },
  checkoutButton: {
    backgroundColor: '#546E7A',
  },
});

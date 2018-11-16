// React and react native components
import React from "react";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import { StyleSheet } from "react-native";

// Header
import ScreenHeader from "../Components/ScreenHeader";

// Firebase
import firebase from "../Firebase";

export default class OrderHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
    firebase;
  }

  // Function to find total price for an order
  orderTotal(duration, price) {
    return (duration / 60) * price;
  }

  componentDidMount() {
    let uid = firebase.auth().currentUser.uid; // current user

    // finds a users past orders from firebase db
    firebase
      .database()
      .ref("/orders/")
      .on("value", data => {
        let orders = [];
        data.forEach(order => {
          // finds data for user
          if (uid === order.val().renter) {
            let newOrder = order.val();
            newOrder.key = order.key;
            orders.push(newOrder);
          }
        });
        this.setState({ orders: orders });
      });
  }

  // Renders a card for each order associated with user in db
  render() {
    let id = 0;
    let orderHistory = this.state.orders.map(order => {
      id++;
      return (
        <Card key={order.key}>
          <CardItem style={styles.card} header bordered>
            <Text style={styles.header}>Order # {id}</Text>
          </CardItem>
          <CardItem style={styles.card} bordered>
            <Body>
              <Text style={styles.body}>Address: {order.address}</Text>
            </Body>
          </CardItem>
          <CardItem style={styles.card} footer bordered>
            <Text style={styles.footer}>
              Total: ${order.totalPayed / 100.0}
            </Text>
          </CardItem>
        </Card>
      );
    });

    return (
      <Container style={styles.container}>
        <ScreenHeader navigation={this.props.navigation} />
        <Content padder>{orderHistory}</Content>
      </Container>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3c3c3c"
  },
  card: {
    backgroundColor: "#8a8a8a"
  },
  header: {
    color: "#3c3c3c",
    fontFamily: "sans-serif-thin"
  },
  body: {
    color: "#FFFFFF",
    fontFamily: "sans-serif-thin"
  },
  footer: {
    color: "#3c3c3c",
    fontFamily: "sans-serif-thin"
  }
});

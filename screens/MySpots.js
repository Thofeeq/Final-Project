import React from 'react';
// import { StyleSheet, View, Image, StatusBar, Button } from 'react-native';
import { Container, Header, Content, Card, CardItem, Text, Body } from 'native-base';
import { Image, StyleSheet }  from 'react-native';

let spots = [
  {
    id: 1,
    address: '123 Fake Street',
    description: 'Regular street parking spot.',
    date_added: 'Jan. 20th, 2018',
    picture_url: require('../assets/spot.jpg'),
    price: 5
  },
  {
    id: 2,
    address: '123 Fake Street',
    description: 'Regular street parking spot.',
    date_added: 'Jan. 20th, 2018',
    picture_url: require('../assets/spot.jpg'),
    price: 2
  },
  {
    id: 3,
    address: '123 Fake Street',
    description: 'Regular street parking spot.',
    date_added: 'Jan. 20th, 2018',
    picture_url: require('../assets/spot.jpg'),
    price: 3
  },
  
]

export default class MySpots extends React.Component {

  render() {
    let mySpots = spots.map((spot) => {
      return(
        <Card>
          <CardItem header bordered>
            <Text>Parking Spot Id # {spot.id}</Text>
          </CardItem>
          <CardItem bordered>
            <Body>
              <Image style={styles.picture} source={spot.picture_url} />
              <Text>
                Address: {spot.address}{'\n'}
                Description: {spot.description}
              </Text>
            </Body>
          </CardItem>
          <CardItem footer bordered>
            <Text>Price: ${spot.price}</Text>
          </CardItem>
        </Card>
      )
    });
    
    return (
      <Container>
        <Content padder>
          {mySpots}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    width: 100,
    height: 100
  }
})
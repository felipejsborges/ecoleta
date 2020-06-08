import React, { useEffect, useState } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  Linking,
  ScrollView,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface Params {
  point_id: number;
}

interface Data {
  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    number: number;
    latitude: number;
    longitude: number;
    address: string;
    neighborhood: string;
    uf: string;
  };
  items: {
    title: string;
  }[];
}

const Detail: React.FC = () => {
  const [data, setData] = useState<Data>({} as Data);

  const navigation = useNavigation();
  const route = useRoute(); // get info of points page when call handleNavigateToDetail function

  const routeParams = route.params as Params;

  // getting point data
  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then((response) => {
      setData(response.data);
    });
  }, [routeParams.point_id]);

  if (!data.point) {
    return null;
  }

  function handleNavigateBack(): void {
    navigation.goBack();
  }

  function handleWhatsapp(): void {
    Linking.openURL(
      `whatsapp://send?phone=+55${data.point.whatsapp}&text=Olá. Gostaria de depositar resíduos nesse local`,
    );
  }

  function handleMail(): void {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  }

  function handleMaps(): void {
    Linking.openURL(
      `https://www.google.com/maps/dir//${data.point.latitude},${data.point.longitude}`,
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34CB79" />
          </TouchableOpacity>

          <Text style={styles.pointName}>{data.point.name}</Text>

          <Image
            style={styles.pointImage}
            source={{ uri: data.point.image_url }}
          />

          <View style={styles.pointContainers}>
            <Text style={styles.pointTitles}>Materiais Coletados</Text>
            <Text style={styles.pointDescriptions}>
              {data.items.map((item) => item.title).join(', ')}
            </Text>
          </View>

          <View style={styles.pointContainers}>
            <Text style={styles.pointTitles}>Contato</Text>
            <View style={styles.pointContent}>
              <View style={styles.pointContentItems}>
                <Text style={styles.pointSubTitles}>E-mail</Text>

                <Text style={styles.pointDescriptions}>{data.point.email}</Text>
              </View>

              <RectButton style={styles.button} onPress={handleMail}>
                <Icon name="mail" size={20} color="#fff" />
              </RectButton>
            </View>

            <View style={styles.pointContent}>
              <View style={styles.pointContentItems}>
                <Text style={styles.pointSubTitles}>WhatsApp</Text>

                <Text style={styles.pointDescriptions}>
                  {data.point.whatsapp}
                </Text>
              </View>
              <RectButton style={styles.button} onPress={handleWhatsapp}>
                <FontAwesome name="whatsapp" size={20} color="#fff" />
              </RectButton>
            </View>
          </View>

          <View style={styles.pointContainers}>
            <Text style={styles.pointTitles}>Localização</Text>

            <View style={styles.pointContent}>
              <View style={styles.pointContentItems}>
                <Text style={styles.pointDescriptions}>
                  {data.point.address}, {data.point.number} -{' '}
                  {data.point.neighborhood}. {data.point.city}, {data.point.uf}
                </Text>
              </View>

              <RectButton style={styles.button} onPress={handleMaps}>
                <Icon name="map-pin" size={20} color="#fff" />
              </RectButton>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointContainers: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  pointContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  pointContentItems: {
    width: '60%',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  pointTitles: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    color: '#322153',
  },

  pointSubTitles: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    color: '#322153',
  },

  pointDescriptions: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: '#6C6C80',
  },

  button: {
    width: '30%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

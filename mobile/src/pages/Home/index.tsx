import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ImageBackground,
  Alert,
  Picker,
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('Selecione uma UF');
  const [selectedCity, setSelectedCity] = useState('Selecione uma cidade');

  const navigation = useNavigation();

  // getting UF from IBGE API
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  // getting city from IBGE API
  useEffect(() => {
    if (selectedUf === 'Selecione uma UF') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(itemValue: string): void {
    setSelectedUf(itemValue);
  }

  function handleSelectCity(itemValue: string): void {
    setSelectedCity(itemValue);
  }

  function handleNavigateToPoints(): void {
    if (selectedUf === 'Selecione uma UF') {
      Alert.alert('Alerta!', 'Insira um estado');
      return;
    }

    if (selectedCity === 'Selecione uma cidade') {
      Alert.alert('Alerta!', 'Insira uma cidade');
      return;
    }

    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />

        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>

        <Text style={styles.description}>
          Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente
        </Text>
      </View>

      <View>
        <Picker
          style={styles.select}
          selectedValue={selectedUf}
          onValueChange={handleSelectUf}
        >
          <Picker.Item label="Selecione uma UF" value="Selecione uma UF" />
          {ufs.map((uf) => (
            <Picker.Item key={uf} label={uf} value={uf} />
          ))}
        </Picker>

        <Picker
          style={styles.select}
          selectedValue={selectedCity}
          onValueChange={(itemValue) => handleSelectCity(itemValue)}
        >
          <Picker.Item
            label="Selecione uma cidade"
            value="Selecione uma cidade"
          />
          {cities.map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>

          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  select: {
    height: 60,
    backgroundColor: '#FFF',
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
